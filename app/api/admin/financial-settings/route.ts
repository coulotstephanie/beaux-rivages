import { NextRequest } from "next/server";
import { z } from "zod";
import { authorizeStaff } from "@/platform/auth/server";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

const financialSettingsSchema = z.object({
  depositPercentage: z.number().int().min(0).max(100),
  fullPaymentThresholdDays: z.number().int().min(0).max(365),
  balanceDueDays: z.number().int().min(0).max(365),
  securityDepositCents: z.literal(0),
});

async function readSettings() {
  const { data, error } = await getDatabaseClient()
    .from("financial_settings" as "properties")
    .select(
      "deposit_percentage,full_payment_threshold_days,balance_due_days,security_deposit_cents",
    )
    .filter("id" as "slug", "eq", "true")
    .single();
  if (error) throw new Error(`FINANCIAL_SETTINGS_READ_FAILED:${error.code}`);
  const row = data as unknown as {
    deposit_percentage: number;
    full_payment_threshold_days: number;
    balance_due_days: number;
    security_deposit_cents: number;
  };
  return {
    depositPercentage: row.deposit_percentage,
    fullPaymentThresholdDays: row.full_payment_threshold_days,
    balanceDueDays: row.balance_due_days,
    securityDepositCents: 0,
  };
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 15);
  if (limited) return limited;
  if (!(await authorizeStaff(request)))
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Base non configurée." }, { status: 503 });
  try {
    return noStoreJson({ settings: await readSettings() });
  } catch (error) {
    return noStoreJson(
      {
        error: "Paramètres financiers indisponibles.",
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
  const actor = await authorizeStaff(request, ["admin"]);
  if (!actor) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = financialSettingsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return noStoreJson(
      { error: "Paramètres invalides.", details: parsed.error.flatten() },
      { status: 400 },
    );
  const value = parsed.data;
  const { error } = await getDatabaseClient()
    .from("financial_settings" as "properties")
    .update({
      deposit_percentage: value.depositPercentage,
      full_payment_threshold_days: value.fullPaymentThresholdDays,
      balance_due_days: value.balanceDueDays,
      security_deposit_cents: 0,
      updated_by: actor.userId,
    } as never)
    .filter("id" as "slug", "eq", "true");
  if (error)
    return noStoreJson({ error: "Enregistrement impossible.", code: error.code }, { status: 500 });
  return noStoreJson({ ok: true, settings: await readSettings() });
}
