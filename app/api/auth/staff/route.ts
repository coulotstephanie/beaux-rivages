import { NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";
import { authorizeStaff, authorizeStaffToken, staffAccessCookie } from "@/platform/auth/server";
import { getStaffAuthClient, isStaffAuthConfigured } from "@/platform/auth/provider";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";

const staffRefreshCookie = "br-staff-refresh";
const pendingAccessCookie = "br-staff-mfa-access";
const pendingRefreshCookie = "br-staff-mfa-refresh";

const signInSchema = z
  .object({
    email: z.string().trim().email().max(254),
    password: z.string().min(8).max(1_024),
  })
  .strict();
const mfaSchema = z
  .object({
    factorId: z.string().min(10).max(200),
    challengeId: z.string().min(10).max(200),
    code: z.string().regex(/^\d{6}$/),
  })
  .strict();

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

function hash(value: string | null) {
  return value ? createHash("sha256").update(value).digest("hex") : null;
}

async function recordLogin(request: NextRequest, outcome: string, userId?: string, email?: string) {
  if (!isDatabaseConfigured()) return;
  await getDatabaseClient()
    .from("staff_login_events")
    .insert({
      user_id: userId ?? null,
      email_hash: hash(email?.toLowerCase() ?? null),
      outcome,
      ip_hash: hash(
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          request.headers.get("x-real-ip"),
      ),
      user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
    });
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  const refreshToken = request.cookies.get(staffRefreshCookie)?.value;
  if (refreshToken && isStaffAuthConfigured()) {
    const { data } = await getStaffAuthClient().auth.refreshSession({
      refresh_token: refreshToken,
    });
    if (data.session) {
      const refreshedIdentity = await authorizeStaffToken(data.session.access_token);
      if (refreshedIdentity) {
        const refreshedResponse = noStoreJson({
          authenticated: true,
          email: refreshedIdentity.email,
          role: refreshedIdentity.role,
          authentication: refreshedIdentity.authentication,
          refreshed: true,
        });
        refreshedResponse.cookies.set(staffAccessCookie, data.session.access_token, {
          ...cookieOptions,
          maxAge: data.session.expires_in,
        });
        refreshedResponse.cookies.set(staffRefreshCookie, data.session.refresh_token, {
          ...cookieOptions,
          maxAge: 60 * 60 * 24 * 30,
        });
        return refreshedResponse;
      }
    }
  }
  const identity = await authorizeStaff(request);
  if (!identity) {
    return noStoreJson({ authenticated: false }, { status: 401 });
  }
  return noStoreJson({
    authenticated: true,
    email: identity.email,
    role: identity.role,
    authentication: identity.authentication,
  });
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 5, 60_000);
  if (limited) return limited;
  if (!requireSameOrigin(request)) {
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  }
  if (!isStaffAuthConfigured()) {
    return noStoreJson({ error: "Authentification Supabase non configurée." }, { status: 503 });
  }
  const parsed = signInSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return noStoreJson({ error: "Identifiants invalides." }, { status: 400 });
  }

  const authClient = getStaffAuthClient();
  const { data, error } = await authClient.auth.signInWithPassword(parsed.data);
  if (error || !data.session) {
    await recordLogin(request, "failure", undefined, parsed.data.email);
    return noStoreJson({ error: "Adresse e-mail ou mot de passe incorrect." }, { status: 401 });
  }

  const identity = await authorizeStaffToken(data.session.access_token);
  if (!identity) {
    await recordLogin(request, "failure", data.user?.id, parsed.data.email);
    return noStoreJson(
      { error: "Ce compte ne possède aucun accès au Back Office." },
      { status: 403 },
    );
  }
  const security = await getDatabaseClient()
    .from("staff_security_settings")
    .select("mfa_required")
    .eq("user_id", identity.userId)
    .maybeSingle();
  if (security.data?.mfa_required) {
    const factor = data.user.factors?.find((candidate) => candidate.status === "verified");
    if (!factor) {
      await recordLogin(request, "mfa_required", identity.userId, identity.email ?? undefined);
      return noStoreJson(
        {
          error:
            "La double authentification est requise mais aucun appareil TOTP n’est enrôlé. Contactez un administrateur.",
        },
        { status: 403 },
      );
    }
    const challenge = await authClient.auth.mfa.challenge({ factorId: factor.id });
    if (challenge.error)
      return noStoreJson({ error: "Double authentification indisponible." }, { status: 503 });
    await recordLogin(request, "mfa_required", identity.userId, identity.email ?? undefined);
    const pending = noStoreJson(
      {
        authenticated: false,
        mfaRequired: true,
        factorId: factor.id,
        challengeId: challenge.data.id,
      },
      { status: 202 },
    );
    pending.cookies.set(pendingAccessCookie, data.session.access_token, {
      ...cookieOptions,
      maxAge: 300,
    });
    pending.cookies.set(pendingRefreshCookie, data.session.refresh_token, {
      ...cookieOptions,
      maxAge: 300,
    });
    return pending;
  }
  await recordLogin(request, "success", identity.userId, identity.email ?? parsed.data.email);

  const response = noStoreJson({
    authenticated: true,
    email: identity.email,
    role: identity.role,
  });
  response.cookies.set(staffAccessCookie, data.session.access_token, {
    ...cookieOptions,
    maxAge: data.session.expires_in,
  });
  response.cookies.set(staffRefreshCookie, data.session.refresh_token, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export async function PUT(request: NextRequest) {
  const limited = rateLimit(request, 5, 60_000);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const parsed = mfaSchema.safeParse(await request.json().catch(() => null));
  const accessToken = request.cookies.get(pendingAccessCookie)?.value;
  const refreshToken = request.cookies.get(pendingRefreshCookie)?.value;
  if (!parsed.success || !accessToken || !refreshToken)
    return noStoreJson({ error: "Validation MFA expirée." }, { status: 400 });
  const authClient = getStaffAuthClient();
  const session = await authClient.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (session.error) return noStoreJson({ error: "Session MFA expirée." }, { status: 401 });
  const verification = await authClient.auth.mfa.verify({
    factorId: parsed.data.factorId,
    challengeId: parsed.data.challengeId,
    code: parsed.data.code,
  });
  if (verification.error || !verification.data.access_token) {
    await recordLogin(request, "mfa_failure", session.data.user?.id, session.data.user?.email);
    return noStoreJson({ error: "Code de vérification incorrect." }, { status: 401 });
  }
  const identity = await authorizeStaffToken(verification.data.access_token);
  if (!identity) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  await recordLogin(request, "mfa_success", identity.userId, identity.email ?? undefined);
  const response = noStoreJson({ authenticated: true, email: identity.email, role: identity.role });
  response.cookies.set(staffAccessCookie, verification.data.access_token, {
    ...cookieOptions,
    maxAge: verification.data.expires_in,
  });
  response.cookies.set(staffRefreshCookie, verification.data.refresh_token, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.set(pendingAccessCookie, "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set(pendingRefreshCookie, "", { ...cookieOptions, maxAge: 0 });
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!requireSameOrigin(request)) {
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  }
  const identity = await authorizeStaff(request);
  if (identity)
    await recordLogin(request, "signed_out", identity.userId, identity.email ?? undefined);
  const response = noStoreJson({ authenticated: false });
  response.cookies.set(staffAccessCookie, "", {
    ...cookieOptions,
    maxAge: 0,
  });
  response.cookies.set(staffRefreshCookie, "", {
    ...cookieOptions,
    maxAge: 0,
  });
  return response;
}
