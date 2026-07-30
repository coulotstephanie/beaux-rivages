import { NextRequest } from "next/server";
import { z } from "zod";
import { isDatabaseConfigured } from "@/platform/database/client";
import { authorizeStaff } from "@/platform/auth/server";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";
import { RevenueMarketingRepository } from "@/platform/revenue/repository";

const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("create_gift_card"),
    amountCents: z.number().int().min(5_000).max(500_000),
    expiresAt: z.iso.datetime(),
    recipientName: z.string().trim().max(120).optional(),
  }),
  z.object({
    action: z.literal("create_promotion"),
    code: z.string().trim().min(3).max(30).regex(/^[A-Za-z0-9-]+$/),
    label: z.string().trim().min(3).max(120),
    discountType: z.enum(["fixed", "percentage"]),
    value: z.number().int().positive().max(100_000),
    minimumStayNights: z.number().int().min(1).max(60).optional(),
    directOnly: z.boolean(),
    returningGuestsOnly: z.boolean(),
    lowSeasonOnly: z.boolean(),
    startsAt: z.iso.datetime(),
    endsAt: z.iso.datetime(),
  }).refine((value) => value.discountType !== "percentage" || value.value <= 100, { path: ["value"], message: "Pourcentage invalide." }),
  z.object({
    action: z.literal("create_campaign"),
    name: z.string().trim().min(3).max(120),
    kind: z.enum(["news", "new-offer", "school-holiday", "last-availability", "christmas", "spring", "summer", "autumn", "birthday", "post-stay", "loyalty"]),
    locale: z.enum(["fr", "en", "de"]),
    subject: z.string().trim().min(3).max(160),
    preheader: z.string().trim().max(200).optional(),
    contentBlocks: z.array(z.object({ type: z.enum(["heading", "text", "button"]), content: z.string().trim().min(1).max(2_000), href: z.string().url().optional() })).min(1).max(30),
    scheduledAt: z.iso.datetime().optional(),
  }),
]);

const unavailable = () => noStoreJson({ error: "Base commerciale non configurée." }, { status: 503 });

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  if (!await authorizeStaff(request)) return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  if (!isDatabaseConfigured()) return unavailable();
  try {
    return noStoreJson(await new RevenueMarketingRepository().dashboard());
  } catch (error) {
    return noStoreJson({ error: "Tableau commercial indisponible.", code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 8);
  if (limited) return limited;
  if (!requireSameOrigin(request)) return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!await authorizeStaff(request, ["admin"])) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  if (!isDatabaseConfigured()) return unavailable();
  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Données commerciales invalides.", details: parsed.error.flatten() }, { status: 400 });
  const repository = new RevenueMarketingRepository();
  try {
    const result = parsed.data.action === "create_gift_card"
      ? await repository.createGiftCard(parsed.data)
      : parsed.data.action === "create_promotion"
        ? await repository.createPromotion(parsed.data)
        : await repository.createCampaign(parsed.data);
    return noStoreJson({ ok: true, result }, { status: 201 });
  } catch (error) {
    return noStoreJson({ error: "Création impossible.", code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN" }, { status: 500 });
  }
}
