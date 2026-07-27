import { NextRequest } from "next/server";
import { getCalendarConfigurationStatus, isPropertySlug, propertySlugs } from "@/platform/calendar/config";
import { synchronizePropertyCalendars } from "@/platform/calendar/service";
import { noStoreJson, rateLimit, requireAdmin } from "@/platform/http/security";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  if (!requireAdmin(request)) return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  const calendars = await Promise.all(propertySlugs.map(async (propertySlug) => {
    const sync = await synchronizePropertyCalendars(propertySlug);
    return { propertySlug, sources: sync.results };
  }));
  return noStoreJson({ configuration: getCalendarConfigurationStatus(), calendars, persistentEditingEnabled: false });
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 10);
  if (limited) return limited;
  if (!requireAdmin(request)) return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  const propertySlug = body && typeof body === "object" ? String((body as Record<string, unknown>).propertySlug ?? "") : "";
  if (!isPropertySlug(propertySlug)) return noStoreJson({ error: "Logement inconnu." }, { status: 400 });
  const result = await synchronizePropertyCalendars(propertySlug, true);
  console.info(JSON.stringify({ event: "calendar.sync.forced", propertySlug }));
  return noStoreJson({ propertySlug, sources: result.results, imported: result.blocks.length });
}

export async function PUT(request: NextRequest) {
  const limited = rateLimit(request, 5);
  if (limited) return limited;
  if (!requireAdmin(request)) return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  return noStoreJson({
    error: "La modification persistante nécessite le dépôt chiffré CalendarSourceRepository. Les secrets de production restent administrés dans Vercel pour cette version.",
    code: "PERSISTENT_SECRET_STORE_REQUIRED",
  }, { status: 501 });
}
