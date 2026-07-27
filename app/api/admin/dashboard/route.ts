import { NextRequest } from "next/server";
import { properties } from "@/data";
import { propertySlugs } from "@/platform/calendar/config";
import { synchronizePropertyCalendars } from "@/platform/calendar/service";
import { isDatabaseConfigured } from "@/platform/database/client";
import { SupabaseAdminRepository } from "@/platform/database/operations";
import { noStoreJson, rateLimit, requireAdmin } from "@/platform/http/security";
import { ratePlanRepository } from "@/platform/pricing/repository";
import { rateForDate } from "@/platform/pricing/service";

function enumerate(startsOn: string, endsOn: string) {
  const days: string[] = [];
  const cursor = new Date(`${startsOn}T12:00:00Z`);
  while (cursor.toISOString().slice(0, 10) < endsOn) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 12);
  if (limited) return limited;
  if (!requireAdmin(request)) return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  const year = new Date().getFullYear();
  const startsOn = `${year}-01-01`;
  const endsOn = `${year + 1}-01-01`;
  const houses = await Promise.all(propertySlugs.map(async (propertySlug) => {
    const [calendar, plan] = await Promise.all([synchronizePropertyCalendars(propertySlug), ratePlanRepository.get(propertySlug)]);
    const occupied = new Map<string, { provider: string; rate: number }>();
    for (const block of calendar.blocks) {
      const provider = block.sourceId.split("-").at(-1) ?? "other";
      for (const day of enumerate(block.startsAt.slice(0, 10), block.endsAt.slice(0, 10))) {
        if (day >= startsOn && day < endsOn && !occupied.has(day)) occupied.set(day, { provider, rate: rateForDate(plan, day).rate });
      }
    }
    const byProvider = [...occupied.values()].reduce<Record<string, number>>((totals, value) => ({ ...totals, [value.provider]: (totals[value.provider] ?? 0) + 1 }), {});
    const monthly = Array.from({ length: 12 }, (_, month) => {
      const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
      const values = [...occupied].filter(([date]) => date.startsWith(prefix)).map(([, value]) => value);
      return { month: month + 1, occupiedNights: values.length, estimatedRevenue: values.reduce((sum, value) => sum + value.rate, 0) };
    });
    return {
      propertySlug,
      property: properties.find((item) => item.slug === propertySlug)?.title,
      occupancyRate: Math.round((occupied.size / 365) * 10_000) / 100,
      occupiedNights: occupied.size,
      estimatedRevenue: [...occupied.values()].reduce((sum, value) => sum + value.rate, 0),
      sourceNights: { airbnb: byProvider.airbnb ?? 0, booking: byProvider.booking ?? 0, abritel: byProvider.abritel ?? 0, direct: 0 },
      monthly,
      sync: calendar.results,
    };
  }));
  const databaseSummary = isDatabaseConfigured()
    ? await new SupabaseAdminRepository().getYearSummary(year).catch(() => null)
    : null;
  return noStoreJson({
    year,
    houses,
    totals: {
      estimatedRevenue: houses.reduce((sum, house) => sum + house.estimatedRevenue, 0),
      occupiedNights: houses.reduce((sum, house) => sum + house.occupiedNights, 0),
      directReservations: databaseSummary?.directReservations ?? 0,
      confirmedDirectRevenue: databaseSummary ? databaseSummary.confirmedRevenueCents / 100 : 0,
      requests: databaseSummary?.requests ?? 0,
    },
    caveat: "Le revenu des plateformes reste estimé à partir des nuits bloquées : les flux iCal ne contiennent aucun montant. Le revenu direct confirmé provient de Supabase.",
  });
}
