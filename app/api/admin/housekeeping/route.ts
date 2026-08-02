import { NextRequest } from "next/server";
import { authorizeStaff } from "@/platform/auth/server";
import { isDatabaseConfigured } from "@/platform/database/client";
import { HousekeepingRepository } from "@/platform/housekeeping/repository";
import { housekeepingActionSchema } from "@/platform/housekeeping/schemas";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  if (!(await authorizeStaff(request)))
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Base non configurée." }, { status: 503 });
  try {
    return noStoreJson(await new HousekeepingRepository().snapshot());
  } catch (error) {
    return noStoreJson(
      {
        error: "Housekeeping indisponible.",
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
  const staff = await authorizeStaff(request, ["admin", "concierge"]);
  if (!staff) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = housekeepingActionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return noStoreJson(
      { error: "Données invalides.", details: parsed.error.flatten() },
      { status: 400 },
    );
  try {
    return noStoreJson(
      { ok: true, result: await new HousekeepingRepository().execute(parsed.data, staff.userId) },
      { status: 201 },
    );
  } catch (error) {
    const code = error instanceof Error ? error.message.split(":")[0] : "UNKNOWN";
    return noStoreJson(
      {
        error:
          code === "OFFLINE_CONFLICT"
            ? "Cette checklist a été modifiée sur un autre appareil. Actualisez avant de reprendre."
            : "Action impossible.",
        code,
      },
      { status: code === "OFFLINE_CONFLICT" ? 409 : 500 },
    );
  }
}
