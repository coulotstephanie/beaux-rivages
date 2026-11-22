import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getStaffAuthClient, isStaffAuthConfigured } from "@/platform/auth/provider";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";
import { ConfigurableEmailProvider } from "@/platform/email/contracts";
import { isStaffRole } from "@/platform/auth/contracts";
import { staffRecoveryEmail } from "@/platform/auth/recovery-link";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

const requestSchema = z.object({ email: z.string().trim().email().max(254) }).strict();
const updateSchema = z
  .object({
    tokenHash: z.string().min(20).max(4096).optional(),
    code: z.string().min(10).max(4096).optional(),
    accessToken: z.string().min(20).max(4096).optional(),
    refreshToken: z.string().min(20).max(4096).optional(),
    password: z.string().min(10).max(1024),
  })
  .strict()
  .refine(
    (value) => Boolean(value.tokenHash || value.code || (value.accessToken && value.refreshToken)),
    "Lien de réinitialisation incomplet.",
  );

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 3, 60_000);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!isStaffAuthConfigured())
    return noStoreJson({ error: "Authentification indisponible." }, { status: 503 });

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Adresse e-mail invalide." }, { status: 400 });

  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Récupération temporairement indisponible." }, { status: 503 });

  // Generate only a recovery token for an existing user; never create a user or change a role.
  const database = getDatabaseClient();
  const generated = await database.auth.admin.generateLink({
    type: "recovery",
    email: parsed.data.email,
  });
  if (generated.error && generated.error.code !== "user_not_found") {
    return noStoreJson({ error: "Récupération temporairement indisponible." }, { status: 503 });
  }
  if (generated.data?.user && generated.data.properties?.hashed_token) {
    const roles = await database
      .from("app_user_roles")
      .select("role")
      .eq("user_id", generated.data.user.id);
    if (roles.error)
      return noStoreJson({ error: "Récupération temporairement indisponible." }, { status: 503 });
    if (roles.data?.some((row) => isStaffRole(row.role)) && generated.data.user.email) {
      try {
        // The provider's action_link may still point to localhost. Send our own canonical
        // landing page; Supabase verifies the single-use recovery token only on submission.
        await new ConfigurableEmailProvider().send({
          to: generated.data.user.email,
          ...staffRecoveryEmail(generated.data.properties.hashed_token),
          idempotencyKey: `staff-recovery-${randomUUID()}`,
        });
      } catch {
        return noStoreJson(
          { error: "Le lien n’a pas pu être envoyé. Réessayez dans un instant." },
          { status: 503 },
        );
      }
    }
  }

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
  const session = parsed.data.tokenHash
    ? await client.auth.verifyOtp({ token_hash: parsed.data.tokenHash, type: "recovery" })
    : parsed.data.code
      ? await client.auth.exchangeCodeForSession(parsed.data.code)
      : await client.auth.setSession({
          access_token: parsed.data.accessToken!,
          refresh_token: parsed.data.refreshToken!,
        });
  if (session.error || !session.data.session)
    return noStoreJson({ error: "Ce lien a expiré. Demandez-en un nouveau." }, { status: 401 });

  const updated = await client.auth.updateUser({ password: parsed.data.password });
  if (updated.error)
    return noStoreJson({ error: "Le mot de passe n’a pas pu être enregistré." }, { status: 400 });

  await client.auth.signOut();
  return noStoreJson({ success: true });
}
