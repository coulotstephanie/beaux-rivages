import { NextRequest } from "next/server";
import { z } from "zod";
import {
  authorizeStaff,
  authorizeStaffToken,
  staffAccessCookie,
} from "@/platform/auth/server";
import { getStaffAuthClient, isStaffAuthConfigured } from "@/platform/auth/provider";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

const signInSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(1_024),
}).strict();

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  const identity = await authorizeStaff(request);
  if (!identity) {
    return noStoreJson({
      authenticated: false,
      supabaseConfigured: isStaffAuthConfigured(),
    }, { status: 401 });
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

  const { data, error } = await getStaffAuthClient().auth.signInWithPassword(parsed.data);
  if (error || !data.session) {
    return noStoreJson({ error: "Adresse e-mail ou mot de passe incorrect." }, { status: 401 });
  }
  const identity = await authorizeStaffToken(data.session.access_token);
  if (!identity) {
    return noStoreJson({ error: "Ce compte ne possède aucun accès au Back Office." }, { status: 403 });
  }

  const response = noStoreJson({
    authenticated: true,
    email: identity.email,
    role: identity.role,
  });
  response.cookies.set(staffAccessCookie, data.session.access_token, {
    ...cookieOptions,
    maxAge: data.session.expires_in,
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!requireSameOrigin(request)) {
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  }
  const response = noStoreJson({ authenticated: false });
  response.cookies.set(staffAccessCookie, "", {
    ...cookieOptions,
    maxAge: 0,
  });
  return response;
}
