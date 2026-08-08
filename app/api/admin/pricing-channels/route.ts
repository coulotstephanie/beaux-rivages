import { NextRequest } from "next/server";
import { z } from "zod";
import { authorizeStaff } from "@/platform/auth/server";
import { isPropertySlug } from "@/platform/calendar/config";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";
import { ChannelPricingRepository } from "@/platform/pricing/channel-repository";
import { RateOverrideRepository } from "@/features/revenue-management/repositories/rate-override.repository";
import { isInsideRollingWindow } from "@/platform/pricing/channels";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const slug = z.enum(["chai-des-tortues", "villa-raie-manta", "nid-d-ete"]);
const mutation = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("master-bulk"),
    propertySlug: slug,
    entries: z
      .array(
        z.object({
          date,
          nightlyRate: z.number().positive().max(10_000),
          minimumNights: z.number().int().min(1).max(60).optional(),
        }),
      )
      .min(1)
      .max(366),
  }),
  z.object({
    action: z.literal("channel-override"),
    propertySlug: slug,
    channel: z.enum(["airbnb", "booking"]),
    date,
    nightlyRate: z.number().positive().max(10_000),
    reason: z.string().trim().max(250).optional(),
  }),
  z.object({
    action: z.literal("channel-override-delete"),
    propertySlug: slug,
    channel: z.enum(["airbnb", "booking"]),
    date,
  }),
]);

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;
  const identity = await authorizeStaff(request);
  if (!identity) return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  const property = request.nextUrl.searchParams.get("property");
  const start = request.nextUrl.searchParams.get("start") ?? "";
  const end = request.nextUrl.searchParams.get("end") ?? "";
  if (
    !isPropertySlug(property) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(start) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(end) ||
    start > end
  )
    return noStoreJson({ error: "Période ou maison invalide." }, { status: 400 });
  const today = new Date().toISOString().slice(0, 10);
  if (!isInsideRollingWindow(start, today) || !isInsideRollingWindow(end, today))
    return noStoreJson(
      { error: "La période doit rester dans les 12 mois glissants autorisés." },
      { status: 400 },
    );
  try {
    return noStoreJson(await new ChannelPricingRepository().calendar(property, start, end));
  } catch (error) {
    return noStoreJson(
      {
        error: "Tarifs & Canaux indisponible.",
        code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 15);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const identity = await authorizeStaff(request, ["admin"]);
  if (!identity) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = mutation.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return noStoreJson(
      { error: "Modification invalide.", details: parsed.error.flatten() },
      { status: 400 },
    );
  const today = new Date().toISOString().slice(0, 10);
  const mutationDates =
    parsed.data.action === "master-bulk"
      ? parsed.data.entries.map((entry) => entry.date)
      : [parsed.data.date];
  if (mutationDates.some((stayDate) => !isInsideRollingWindow(stayDate, today)))
    return noStoreJson(
      { error: "Modification impossible hors des 12 mois glissants autorisés." },
      { status: 400 },
    );
  try {
    if (parsed.data.action === "master-bulk") {
      const result = await new RateOverrideRepository().createBatch(
        {
          propertySlug: parsed.data.propertySlug,
          name: "Tarifs & Canaux",
          kind: "manual",
          entries: parsed.data.entries,
        },
        identity.userId,
      );
      return noStoreJson({ ok: true, result });
    }
    const repository = new ChannelPricingRepository();
    if (parsed.data.action === "channel-override")
      await repository.setChannelOverride(
        parsed.data.propertySlug,
        parsed.data.channel,
        parsed.data.date,
        parsed.data.nightlyRate,
        parsed.data.reason,
        identity.userId,
      );
    else
      await repository.deleteChannelOverride(
        parsed.data.propertySlug,
        parsed.data.channel,
        parsed.data.date,
        identity.userId,
      );
    return noStoreJson({ ok: true });
  } catch (error) {
    return noStoreJson(
      {
        error: "Modification impossible.",
        code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN",
      },
      { status: 500 },
    );
  }
}
