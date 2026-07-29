import { NextRequest } from "next/server";
import { isDatabaseConfigured } from "@/platform/database/client";
import { SupabaseAuditRepository } from "@/platform/database/operations";
import { SupabaseBackOfficeRepository } from "@/platform/database/back-office";
import { adminOperationSchema } from "@/platform/database/schemas";
import { authorizeStaff } from "@/platform/auth/server";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

function failure(error: unknown) {
  const message = error instanceof Error ? error.message : "UNKNOWN";
  if (message === "DATES_UNAVAILABLE") return noStoreJson({ error: "Ces dates ne sont plus disponibles." }, { status: 409 });
  if (message.startsWith("PROPERTY_NOT_FOUND")) return noStoreJson({ error: "Logement introuvable." }, { status: 404 });
  return noStoreJson({ error: "L’opération n’a pas pu être effectuée.", code: message.split(":")[0] }, { status: 500 });
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 15);
  if (limited) return limited;
  if (!await authorizeStaff(request)) return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  if (!isDatabaseConfigured()) return noStoreJson({ error: "Base de données non configurée." }, { status: 503 });
  try {
    return noStoreJson(await new SupabaseBackOfficeRepository().snapshot());
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 10);
  if (limited) return limited;
  if (!requireSameOrigin(request)) return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!await authorizeStaff(request, ["admin", "concierge"])) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  if (!isDatabaseConfigured()) return noStoreJson({ error: "Base de données non configurée." }, { status: 503 });
  const parsed = adminOperationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
  try {
    const result = await new SupabaseBackOfficeRepository().execute(parsed.data);
    await new SupabaseAuditRepository().record({ action: `admin.${parsed.data.action}`, entityType: "back_office", entityId: "id" in result ? String(result.id) : undefined });
    return noStoreJson({ ok: true, result }, { status: 201 });
  } catch (error) {
    return failure(error);
  }
}
