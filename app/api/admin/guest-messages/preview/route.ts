import { NextRequest } from "next/server";
import { z } from "zod";
import { demoGuestMessageData } from "@/platform/guest-messaging/demo";
import { renderGuestMessage } from "@/platform/guest-messaging/templates";
import { authorizeStaff } from "@/platform/auth/server";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

const schema = z.object({
  propertyId: z.enum(["chai-des-tortues", "villa-raie-manta", "nid-d-ete"]),
  type: z.enum(["booking_confirmation", "arrival", "departure"]),
  data: z.object({
    reservationId: z.string().max(100),
    guestFirstName: z.string().min(1).max(100),
    guestLastName: z.string().max(100).optional(),
    arrivalDate: z.iso.date(),
    departureDate: z.iso.date(),
    adults: z.number().int().min(1).max(30),
    children: z.number().int().min(0).max(20),
    babies: z.number().int().min(0).max(10),
    pets: z.number().int().min(0).max(10),
    bookingSource: z.enum(["direct", "airbnb", "booking", "abritel", "other"]),
  }).optional(),
});

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  if (!requireSameOrigin(request)) return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!await authorizeStaff(request, ["admin", "concierge"])) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Prévisualisation invalide." }, { status: 400 });
  const data = parsed.data.data ? {
    ...demoGuestMessageData(parsed.data.propertyId),
    ...parsed.data.data,
    propertyId: parsed.data.propertyId,
    selectedOptions: {},
  } : demoGuestMessageData(parsed.data.propertyId);
  // Deliberately obvious preview placeholders. Production secrets must be loaded server-side from guest_access_secrets.
  const previewSecrets = { keyBoxCode: "[CODE BOÎTE À CLÉS]", wifiName: "[RÉSEAU WI-FI]", wifiPassword: "[MOT DE PASSE WI-FI]", pedestrianGateCode: "[CODE PORTILLON]" };
  return noStoreJson({ data, message: renderGuestMessage(data, parsed.data.type, parsed.data.type === "arrival" ? previewSecrets : undefined) });
}
