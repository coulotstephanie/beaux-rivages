import { NextRequest } from "next/server";
import { z } from "zod";
import { authorizeStaff } from "@/platform/auth/server";
import { isPropertySlug } from "@/platform/calendar/config";
import { isDatabaseConfigured } from "@/platform/database/client";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";
import { PricingAdminRepository } from "@/platform/pricing/admin-repository";

const slug = z.enum(["chai-des-tortues", "villa-raie-manta", "nid-d-ete"]);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const mutation = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("arrival-days"),
    propertySlug: slug,
    weekdays: z.array(z.number().int().min(1).max(7)).min(1),
  }),
  z.object({ action: z.literal("gap-optimization"), propertySlug: slug, enabled: z.boolean() }),
  z.object({
    action: z.literal("season"),
    propertySlug: slug,
    name: z.string().trim().min(2).max(120),
    kind: z.enum(["low", "mid", "high", "custom"]),
    startsOn: date,
    endsOn: date,
    nightlyRate: z.number().positive().max(10_000),
    minimumNights: z.number().int().min(1).max(60),
  }),
  z
    .object({
      action: z.literal("promotion"),
      propertySlug: slug,
      name: z.string().trim().min(2).max(120),
      kind: z.enum(["seasonal", "code"]),
      percentage: z.number().min(0).max(100),
      fixedAmount: z.number().positive().max(10_000).optional(),
      startsOn: date,
      endsOn: date,
      code: z.string().trim().max(40).optional(),
    })
    .refine(
      (value) => value.percentage > 0 || value.fixedAmount,
      "Une réduction fixe ou en pourcentage est requise.",
    ),
  z.object({
    action: z.literal("option"),
    propertySlug: slug,
    code: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    price: z.number().min(0).max(10_000),
    enabled: z.boolean(),
  }),
  z.object({
    action: z.literal("copy-year"),
    propertySlug: slug,
    fromYear: z.number().int().min(2025).max(2035),
    toYear: z.number().int().min(2025).max(2035),
  }),
  z
    .object({ action: z.literal("copy-property"), propertySlug: slug, targetPropertySlug: slug })
    .refine(
      (value) => value.propertySlug !== value.targetPropertySlug,
      "Les logements doivent être différents.",
    ),
  z.object({ action: z.literal("undo"), propertySlug: slug, changeId: z.string().uuid() }),
]);

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;
  const identity = await authorizeStaff(request);
  if (!identity) return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Base non configurée." }, { status: 503 });
  const property = request.nextUrl.searchParams.get("property");
  if (!isPropertySlug(property))
    return noStoreJson({ error: "Logement invalide." }, { status: 400 });
  try {
    return noStoreJson(await new PricingAdminRepository().snapshot(property));
  } catch (error) {
    return noStoreJson(
      {
        error: "Centre Tarifaire indisponible.",
        code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 10);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const identity = await authorizeStaff(request, ["admin"]);
  if (!identity) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Base non configurée." }, { status: 503 });
  const parsed = mutation.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return noStoreJson(
      { error: "Modification tarifaire invalide.", details: parsed.error.flatten() },
      { status: 400 },
    );
  try {
    return noStoreJson(
      { ok: true, result: await new PricingAdminRepository().mutate(parsed.data, identity.userId) },
      { status: 201 },
    );
  } catch (error) {
    return noStoreJson(
      {
        error: "Enregistrement impossible.",
        code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN",
      },
      { status: 500 },
    );
  }
}
