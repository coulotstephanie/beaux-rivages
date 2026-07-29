import "server-only";

import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";
import {
  isStaffRole,
  staffRolePriority,
  type StaffIdentity,
  type StaffRole,
} from "@/platform/auth/contracts";

export const staffAccessCookie = "br-staff-access";

function bearerToken(request: NextRequest) {
  return request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim()
    ?? request.cookies.get(staffAccessCookie)?.value
    ?? null;
}

function securelyEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function legacyIdentity(token: string): StaffIdentity | null {
  const configured = process.env.ADMIN_API_TOKEN;
  if (!configured || process.env.ADMIN_TOKEN_FALLBACK_ENABLED === "false") return null;
  if (!securelyEquals(token, configured)) return null;
  return {
    userId: "legacy-admin-token",
    email: null,
    role: "admin",
    authentication: "legacy-token",
  };
}

export async function authorizeStaffToken(
  token: string,
  allowedRoles: readonly StaffRole[] = ["admin", "concierge", "read_only"],
): Promise<StaffIdentity | null> {
  if (token.length > 8_000) return null;

  const legacy = legacyIdentity(token);
  if (legacy) return allowedRoles.includes(legacy.role) ? legacy : null;
  if (!isDatabaseConfigured()) return null;

  const client = getDatabaseClient();
  const { data: authData, error: authError } = await client.auth.getUser(token);
  if (authError || !authData.user) return null;

  const { data: roleRows, error: roleError } = await client
    .from("app_user_roles")
    .select("role")
    .eq("user_id", authData.user.id);
  if (roleError) return null;

  const role = (roleRows ?? [])
    .map((row) => row.role)
    .filter(isStaffRole)
    .sort((left, right) => staffRolePriority[left] - staffRolePriority[right])
    .find((candidate) => allowedRoles.includes(candidate));

  if (!role) return null;
  return {
    userId: authData.user.id,
    email: authData.user.email ?? null,
    role,
    authentication: "supabase",
  };
}

export async function authorizeStaff(
  request: NextRequest,
  allowedRoles: readonly StaffRole[] = ["admin", "concierge", "read_only"],
) {
  const token = bearerToken(request);
  return token ? authorizeStaffToken(token, allowedRoles) : null;
}
