import { NextRequest } from "next/server";
import { z } from "zod";
import { authorizeStaff } from "@/platform/auth/server";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

const settingSchema = z.object({
  id: z.string().uuid(),
  municipality: z.string().trim().min(2).max(120),
  intercommunality: z.string().trim().min(2).max(180),
  accommodationCategory: z.string().trim().min(2).max(180),
  classification: z.enum(["unclassified", "1", "2", "3", "4", "5"]),
  calculationMode: z.enum(["proportional", "fixed"]),
  rateValue: z.number().min(0).max(100),
  additionalRatePercent: z.number().min(0).max(500),
  nightlyCapCents: z.number().int().min(0).max(100_000),
  effectiveFrom: z.string().date(),
  effectiveTo: z.string().date().nullable(),
  enabled: z.boolean(),
});

async function listSettings() {
  const { data, error } = await getDatabaseClient()
    .from("tourist_tax_settings")
    .select("*,properties(name,slug)")
    .order("effective_from", { ascending: false });
  if (error) throw new Error(`TOURIST_TAX_READ_FAILED:${error.code}`);
  return (data ?? []).map((row) => ({
    id: row.id,
    propertyId: row.property_id,
    propertyName: row.properties?.name ?? "Logement",
    propertySlug: row.properties?.slug ?? "",
    municipality: row.municipality,
    intercommunality: row.intercommunality,
    accommodationCategory: row.accommodation_category,
    classification: row.classification,
    calculationMode: row.calculation_mode,
    rateValue: Number(row.rate_value),
    additionalRatePercent: Number(row.additional_rate_percent),
    nightlyCapCents: row.nightly_cap_cents,
    effectiveFrom: row.effective_from,
    effectiveTo: row.effective_to,
    enabled: row.enabled,
    sourceUrl: row.source_url,
  }));
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 15);
  if (limited) return limited;
  if (!(await authorizeStaff(request)))
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Base non configurée." }, { status: 503 });
  try {
    return noStoreJson({ settings: await listSettings() });
  } catch (error) {
    return noStoreJson(
      {
        error: "Paramètres fiscaux indisponibles.",
        code: error instanceof Error ? error.message : "UNKNOWN",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const limited = rateLimit(request, 8);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!(await authorizeStaff(request, ["admin"])))
    return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = settingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return noStoreJson(
      { error: "Paramètres invalides.", details: parsed.error.flatten() },
      { status: 400 },
    );
  const value = parsed.data;
  const { error } = await getDatabaseClient()
    .from("tourist_tax_settings")
    .update({
      municipality: value.municipality,
      intercommunality: value.intercommunality,
      accommodation_category: value.accommodationCategory,
      classification: value.classification,
      calculation_mode: value.calculationMode,
      rate_value: value.rateValue,
      additional_rate_percent: value.additionalRatePercent,
      nightly_cap_cents: value.nightlyCapCents,
      effective_from: value.effectiveFrom,
      effective_to: value.effectiveTo,
      enabled: value.enabled,
    })
    .eq("id", value.id);
  if (error)
    return noStoreJson({ error: "Enregistrement impossible.", code: error.code }, { status: 500 });
  return noStoreJson({ ok: true, settings: await listSettings() });
}
