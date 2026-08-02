import { NextRequest } from "next/server";
import { z } from "zod";
import { authorizeStaff } from "@/platform/auth/server";
import { CrmRepository } from "@/platform/crm/repository";
import { isDatabaseConfigured } from "@/platform/database/client";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

const profileUpdate = z
  .object({
    profileId: z.string().uuid(),
    action: z.literal("update"),
    first_name: z.string().trim().min(1).max(100),
    last_name: z.string().trim().min(1).max(100),
    phone: z.string().trim().max(30).nullable(),
    address_line1: z.string().trim().max(200).nullable(),
    address_line2: z.string().trim().max(200).nullable(),
    postal_code: z.string().trim().max(20).nullable(),
    city: z.string().trim().max(100).nullable(),
    country_code: z.string().trim().length(2).toUpperCase(),
    locale: z.enum(["fr", "en", "de", "es"]),
    floor_preference: z.string().trim().max(300).nullable(),
    room_preference: z.string().trim().max(300).nullable(),
    sleeping_preferences: z.string().trim().max(500).nullable(),
    arrival_preferences: z.string().trim().max(500).nullable(),
    allergies: z.string().trim().max(1000).nullable(),
    dietary_preferences: z.string().trim().max(1000).nullable(),
    useful_comments: z.string().trim().max(2000).nullable(),
    internal_notes: z.string().trim().max(5000).nullable(),
    loyalty_override: z.enum(["new", "loyal", "regular", "vip"]).nullable(),
  })
  .strict();
const activity = z
  .object({
    profileId: z.string().uuid(),
    action: z.literal("activity"),
    kind: z.enum(["email", "reminder", "message", "call", "internal_note", "document"]),
    direction: z.enum(["incoming", "outgoing", "internal"]),
    subject: z.string().trim().min(1).max(200),
    details: z.string().trim().max(3000).nullable(),
    reservation_id: z.string().uuid().nullable(),
  })
  .strict();
const pet = z
  .object({
    profileId: z.string().uuid(),
    action: z.literal("pet"),
    name: z.string().trim().max(100).nullable(),
    animal_type: z.string().trim().min(2).max(100),
    useful_information: z.string().trim().max(1000).nullable(),
  })
  .strict();
const child = z
  .object({
    profileId: z.string().uuid(),
    action: z.literal("child"),
    first_name: z.string().trim().max(100).nullable(),
    birth_year: z.number().int().min(2000).max(2100).nullable(),
    equipment_preferences: z
      .array(z.enum(["lit-parapluie", "chaise-haute", "baignoire", "poussette"]))
      .max(4),
    useful_information: z.string().trim().max(1000).nullable(),
  })
  .strict();
const mutation = z.discriminatedUnion("action", [profileUpdate, activity, pet, child]);

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;
  if (!(await authorizeStaff(request)))
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Base non configurée." }, { status: 503 });
  const profileId = request.nextUrl.searchParams.get("profileId");
  const guestId = request.nextUrl.searchParams.get("guestId");
  try {
    const repository = new CrmRepository();
    if (profileId) return noStoreJson(await repository.detail(profileId));
    if (guestId) return noStoreJson(await repository.detailByGuest(guestId));
    const boolean = (name: string) =>
      request.nextUrl.searchParams.get(name) === "true" ? true : undefined;
    return noStoreJson({
      travelers: await repository.list({
        query: request.nextUrl.searchParams.get("q") ?? undefined,
        loyalty: request.nextUrl.searchParams.get("loyalty") ?? undefined,
        pets: boolean("pets"),
        children: boolean("children"),
        locale: request.nextUrl.searchParams.get("locale") ?? undefined,
        country: request.nextUrl.searchParams.get("country") ?? undefined,
        property: request.nextUrl.searchParams.get("property") ?? undefined,
      }),
    });
  } catch (error) {
    const code = error instanceof Error ? error.message.split(":")[0] : "UNKNOWN";
    return noStoreJson(
      {
        error: code === "CRM_PROFILE_NOT_FOUND" ? "Voyageur introuvable." : "CRM indisponible.",
        code,
      },
      { status: code === "CRM_PROFILE_NOT_FOUND" ? 404 : 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 15);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const staff = await authorizeStaff(request, ["admin", "concierge"]);
  if (!staff) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = mutation.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return noStoreJson(
      { error: "Données CRM invalides.", details: parsed.error.flatten() },
      { status: 400 },
    );
  try {
    const { profileId, action, ...values } = parsed.data;
    const repository = new CrmRepository();
    const result =
      action === "update"
        ? await repository.update(profileId, values, staff.userId)
        : action === "activity"
          ? await repository.addActivity(profileId, values, staff.userId)
          : await repository.addCompanion(profileId, action, values, staff.userId);
    return noStoreJson({ ok: true, result }, { status: 201 });
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
