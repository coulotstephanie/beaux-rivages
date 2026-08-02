import { NextRequest } from "next/server";
import { authorizeStaff } from "@/platform/auth/server";
import { isDatabaseConfigured } from "@/platform/database/client";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";
import { DocumentRepository } from "@/platform/documents/repository";
import { documentActionSchema } from "@/platform/documents/schemas";
export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;
  if (!(await authorizeStaff(request)))
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Base non configurée." }, { status: 503 });
  try {
    return noStoreJson(await new DocumentRepository().snapshot());
  } catch (error) {
    return noStoreJson(
      {
        error: "Centre documentaire indisponible.",
        code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN",
      },
      { status: 500 },
    );
  }
}
export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const staff = await authorizeStaff(request, ["admin", "concierge"]);
  if (!staff) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = documentActionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return noStoreJson(
      { error: "Données invalides.", details: parsed.error.flatten() },
      { status: 400 },
    );
  try {
    return noStoreJson(
      { ok: true, result: await new DocumentRepository().execute(parsed.data, staff.userId) },
      { status: 201 },
    );
  } catch (error) {
    return noStoreJson(
      {
        error: "Action documentaire impossible.",
        code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN",
      },
      { status: 500 },
    );
  }
}
