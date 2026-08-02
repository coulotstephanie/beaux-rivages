import { NextRequest } from "next/server";
import { authorizeStaff } from "@/platform/auth/server";
import { isDatabaseConfigured } from "@/platform/database/client";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";
import { CarnetRepository } from "@/features/carnet/repositories";
import { carnetEntrySchema } from "@/features/carnet/schemas";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;
  if (!(await authorizeStaff(request)))
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Base non configurée." }, { status: 503 });
  try {
    return noStoreJson({ entries: await new CarnetRepository().list() });
  } catch (error) {
    return noStoreJson(
      {
        error: "Carnet indisponible.",
        code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 12);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!(await authorizeStaff(request, ["admin", "concierge"])))
    return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = carnetEntrySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return noStoreJson(
      { error: "Contenu invalide.", details: parsed.error.flatten() },
      { status: 400 },
    );
  try {
    return noStoreJson(
      { entry: await new CarnetRepository().save(parsed.data) },
      { status: parsed.data.id ? 200 : 201 },
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

export async function DELETE(request: NextRequest) {
  const limited = rateLimit(request, 12);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!(await authorizeStaff(request, ["admin", "concierge"])))
    return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !/^[0-9a-f-]{36}$/i.test(id))
    return noStoreJson({ error: "Identifiant invalide." }, { status: 400 });
  try {
    await new CarnetRepository().remove(id);
    return noStoreJson({ deleted: true });
  } catch (error) {
    return noStoreJson(
      {
        error: "Suppression impossible.",
        code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN",
      },
      { status: 500 },
    );
  }
}
