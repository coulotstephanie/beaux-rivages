import { NextRequest } from "next/server";
import { isPropertySlug } from "@/platform/calendar/config";
import { buildAnnualRates } from "@/platform/pricing/service";
import { noStoreJson, rateLimit, requireAdmin } from "@/platform/http/security";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 40);
  if (limited) return limited;
  const property = request.nextUrl.searchParams.get("property");
  const year = Number(request.nextUrl.searchParams.get("year") ?? new Date().getFullYear());
  if (!isPropertySlug(property) || !Number.isInteger(year) || year < 2025 || year > 2032) {
    return noStoreJson({ error: "Logement ou année invalide." }, { status: 400 });
  }
  return noStoreJson(await buildAnnualRates(property, year));
}

export async function PUT(request: NextRequest) {
  const limited = rateLimit(request, 5);
  if (limited) return limited;
  if (!requireAdmin(request)) return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  return noStoreJson({
    error: "Le dépôt tarifaire persistant doit être configuré avant toute modification en production.",
    code: "PERSISTENT_RATE_STORE_REQUIRED",
  }, { status: 501 });
}
