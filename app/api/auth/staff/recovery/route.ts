import { NextRequest } from "next/server";
import { z } from "zod";
import { getStaffAuthClient, isStaffAuthConfigured } from "@/platform/auth/provider";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

const requestSchema = z.object({ email: z.string().trim().email().max(254) }).strict();
const updateSchema = z
  .object({
    accessToken: z.string().min(20).max(4096),
    refreshToken: z.string().min(20).max(4096),
    password: z.string().min(10).max(1024),
  })
  .strict();

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 3, 60_000);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!isStaffAuthConfigured())
    return noStoreJson({ error: "Authentification indisponible." }, { status: 503 });

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Adresse e-mail invalide." }, { status: 400 });

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.beaux-rivages.com";

  await getStaffAuthClient().auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/administration/reinitialiser`,
  });

  return noStoreJson({
    message: "Si ce compte existe, un lien sécurisé vient de lui être envoyé.",
  });
}

export async function PUT(request: NextRequest) {
  const limited = rateLimit(request, 5, 60_000);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!isStaffAuthConfigured())
    return noStoreJson({ error: "Authentification indisponible." }, { status: 503 });

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return noStoreJson({ error: "Lien expiré ou nouveau mot de passe invalide." }, { status: 400 });

  const client = getStaffAuthClient();
  const session = await client.auth.setSession({
    access_token: parsed.data.accessToken,
    refresh_token: parsed.data.refreshToken,
  });
  if (session.error || !session.data.session)
    return noStoreJson({ error: "Ce lien a expiré. Demandez-en un nouveau." }, { status: 401 });

  const updated = await client.auth.updateUser({ password: parsed.data.password });
  if (updated.error)
    return noStoreJson({ error: "Le mot de passe n’a pas pu être enregistré." }, { status: 400 });

  await client.auth.signOut();
  return noStoreJson({ success: true });
}
