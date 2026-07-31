import { NextRequest } from "next/server";
import { z } from "zod";
import { authorizeStaff } from "@/platform/auth/server";
import { isDatabaseConfigured } from "@/platform/database/client";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";
import { guestBookEntrySchema } from "@/features/guestbook";
import { GuestBookRepository } from "@/features/guestbook/repository";

const deleteSchema = z.object({ id: z.string().uuid() });

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;
  if (!(await authorizeStaff(request)))
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Base non configurée." }, { status: 503 });
  try {
    return noStoreJson({ entries: await new GuestBookRepository().list({}, false) });
  } catch {
    return noStoreJson({ error: "Livre d’Or indisponible." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 15);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!(await authorizeStaff(request, ["admin", "concierge"])))
    return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = guestBookEntrySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return noStoreJson(
      { error: "Entrée invalide.", details: parsed.error.flatten() },
      { status: 400 },
    );
  try {
    return noStoreJson(
      { entry: await new GuestBookRepository().save(parsed.data) },
      { status: parsed.data.id ? 200 : 201 },
    );
  } catch {
    return noStoreJson({ error: "Enregistrement impossible." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const limited = rateLimit(request, 8);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!(await authorizeStaff(request, ["admin"])))
    return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = deleteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Identifiant invalide." }, { status: 400 });
  try {
    await new GuestBookRepository().remove(parsed.data.id);
    return noStoreJson({ success: true });
  } catch {
    return noStoreJson({ error: "Suppression impossible." }, { status: 500 });
  }
}
