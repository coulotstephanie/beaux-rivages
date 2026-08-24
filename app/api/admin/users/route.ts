import { NextRequest } from "next/server";
import { z } from "zod";
import { authorizeStaff } from "@/platform/auth/server";
import { getDatabaseClient } from "@/platform/database/client";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  if (!(await authorizeStaff(request, ["admin"])))
    return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const database = getDatabaseClient();
  const [users, roles, security, logins] = await Promise.all([
    database.auth.admin.listUsers({ page: 1, perPage: 200 }),
    database.from("app_user_roles").select("user_id, role"),
    database.from("staff_security_settings").select("*"),
    database
      .from("staff_login_events")
      .select("id, user_id, outcome, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);
  if (users.error || roles.error || security.error || logins.error)
    return noStoreJson({ error: "Utilisateurs indisponibles." }, { status: 500 });
  return noStoreJson({
    users: users.data.users.map((user) => {
      const settings = security.data?.find((row) => row.user_id === user.id);
      return {
        id: user.id,
        email: user.email,
        lastSignInAt: user.last_sign_in_at,
        createdAt: user.created_at,
        roles: (roles.data ?? []).filter((row) => row.user_id === user.id).map((row) => row.role),
        mfaRequired: settings?.mfa_required ?? false,
        idleTimeoutMinutes: settings?.idle_timeout_minutes ?? 30,
      };
    }),
    logins: logins.data,
  });
}

const assignment = z.object({
  userId: z.uuid(),
  role: z.enum(["admin", "editor", "concierge", "read_only"]),
});
export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 12);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const actor = await authorizeStaff(request, ["admin"]);
  if (!actor) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = assignment.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Attribution invalide." }, { status: 400 });
  const database = getDatabaseClient();
  const { error } = await database
    .from("app_user_roles")
    .upsert({ user_id: parsed.data.userId, role: parsed.data.role });
  if (error) return noStoreJson({ error: "Attribution impossible." }, { status: 500 });
  await database
    .from("audit_logs")
    .insert({
      actor_id: actor.userId,
      actor_role: actor.role,
      entity_type: "app_user_role",
      entity_id: parsed.data.userId,
      action: "assign",
      after_data: { role: parsed.data.role },
    });
  return noStoreJson({ saved: true });
}

const securitySettings = z.object({
  userId: z.uuid(),
  mfaRequired: z.boolean(),
  idleTimeoutMinutes: z.number().int().min(5).max(480),
});
export async function PATCH(request: NextRequest) {
  const limited = rateLimit(request, 12);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  const actor = await authorizeStaff(request, ["admin"]);
  if (!actor) return noStoreJson({ error: "Permission insuffisante." }, { status: 403 });
  const parsed = securitySettings.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Réglage invalide." }, { status: 400 });
  const { error } = await getDatabaseClient()
    .from("staff_security_settings")
    .upsert({
      user_id: parsed.data.userId,
      mfa_required: parsed.data.mfaRequired,
      idle_timeout_minutes: parsed.data.idleTimeoutMinutes,
      updated_at: new Date().toISOString(),
    });
  if (error) return noStoreJson({ error: "Réglage impossible." }, { status: 500 });
  return noStoreJson({ saved: true });
}
