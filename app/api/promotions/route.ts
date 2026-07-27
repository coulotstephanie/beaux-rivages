import { NextRequest } from "next/server";
import { isPropertySlug } from "@/platform/calendar/config";
import { ratePlanRepository } from "@/platform/pricing/repository";
import { noStoreJson, rateLimit, requireAdmin } from "@/platform/http/security";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 40);
  if (limited) return limited;
  const property = request.nextUrl.searchParams.get("property");
  if (!isPropertySlug(property)) return noStoreJson({ error: "Logement inconnu." }, { status: 400 });
  const plan = await ratePlanRepository.get(property);
  return noStoreJson({
    propertySlug: property,
    promotions: plan.promotions.filter((promotion) => promotion.enabled && promotion.kind !== "code").map(({ id, label, kind, percentage }) => ({ id, label, kind, percentage })),
  });
}

export async function PUT(request: NextRequest) {
  const limited = rateLimit(request, 5);
  if (limited) return limited;
  if (!requireAdmin(request)) return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  return noStoreJson({ error: "Le dépôt tarifaire persistant doit être configuré avant toute modification en production.", code: "PERSISTENT_RATE_STORE_REQUIRED" }, { status: 501 });
}
