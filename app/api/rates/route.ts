import { NextRequest } from "next/server";
import { isPropertySlug } from "@/platform/calendar/config";
import { buildAnnualRates } from "@/platform/pricing/service";
import { authorizeStaff } from "@/platform/auth/server";
import { noStoreJson, rateLimit } from "@/platform/http/security";
import { requireSameOrigin } from "@/platform/http/security";
import { isDatabaseConfigured } from "@/platform/database/client";
import { rateOverrideBatchSchema, rateOverrideSchema } from "@/features/revenue-management/schemas";
import { RateOverrideRepository } from "@/features/revenue-management/repositories";

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
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const identity = await authorizeStaff(request, ["admin"]);
  if (!identity) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Base non configurée." }, { status: 503 });
  const body = await request.json().catch(() => null);
  const batch = rateOverrideBatchSchema.safeParse(body);
  const parsed = batch.success ? batch : rateOverrideSchema.safeParse(body);
  if (!parsed.success)
    return noStoreJson(
      { error: "Tarif invalide.", details: parsed.error.flatten() },
      { status: 400 },
    );
  try {
    return noStoreJson(
      {
        ok: true,
        result:
          "entries" in parsed.data
            ? await new RateOverrideRepository().createBatch(parsed.data, identity.userId)
            : await new RateOverrideRepository().create(parsed.data, identity.userId),
      },
      { status: 201 },
    );
  } catch (error) {
    const code = error instanceof Error ? error.message.split(":")[0] : "UNKNOWN";
    return noStoreJson(
      {
        error:
          code === "RATE_OUTSIDE_GUARDRAILS"
            ? "Le prix doit rester entre le minimum et le maximum autorisés."
            : "Enregistrement impossible.",
        code,
      },
      { status: code === "RATE_OUTSIDE_GUARDRAILS" ? 409 : 500 },
    );
  }
}
