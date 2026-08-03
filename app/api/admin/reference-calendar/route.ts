import { NextRequest } from "next/server";
import { authorizeStaff } from "@/platform/auth/server";
import { frenchPublicCalendar } from "@/platform/calendar/french-reference-calendar";
import { noStoreJson, rateLimit } from "@/platform/http/security";

type OfficialHoliday = {
  description: string;
  start_date: string;
  end_date: string;
};

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;
  if (!(await authorizeStaff(request)))
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  const year = Number(request.nextUrl.searchParams.get("year"));
  const zone = request.nextUrl.searchParams.get("zone") ?? "B";
  if (!Number.isInteger(year) || year < 2025 || year > 2035 || !["A", "B", "C"].includes(zone))
    return noStoreJson({ error: "Calendrier de référence invalide." }, { status: 400 });

  const where = `zones="Zone ${zone}" AND start_date <= date'${year}-12-31' AND end_date >= date'${year}-01-01'`;
  const url = new URL(
    "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records",
  );
  url.searchParams.set("select", "description,start_date,end_date");
  url.searchParams.set("where", where);
  url.searchParams.set("limit", "100");

  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) throw new Error("OFFICIAL_CALENDAR_UNAVAILABLE");
    const payload = (await response.json()) as { results?: OfficialHoliday[] };
    const unique = new Map<string, OfficialHoliday>();
    for (const holiday of payload.results ?? [])
      unique.set(`${holiday.description}:${holiday.start_date}:${holiday.end_date}`, holiday);
    const schoolHolidays = [...unique.values()].flatMap((holiday) => {
      const start = new Date(holiday.start_date);
      const end = new Date(holiday.end_date);
      const days = [];
      for (const day = new Date(start); day < end; day.setUTCDate(day.getUTCDate() + 1)) {
        const date = day.toISOString().slice(0, 10);
        if (date.startsWith(String(year)))
          days.push({
            date,
            kind: "school_holiday" as const,
            zone,
            label: `${holiday.description} · Zone ${zone}`,
          });
      }
      return days;
    });
    return noStoreJson({
      year,
      zone,
      days: [...schoolHolidays, ...frenchPublicCalendar(year)],
      source: "Ministère de l’Éducation nationale — calendrier scolaire officiel",
      sourceUrl:
        "https://data.education.gouv.fr/explore/dataset/fr-en-calendrier-scolaire/information/",
    });
  } catch {
    return noStoreJson({
      year,
      zone,
      days: frenchPublicCalendar(year),
      warning: "Vacances scolaires momentanément indisponibles. Les jours fériés restent affichés.",
    });
  }
}
