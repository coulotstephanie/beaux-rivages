import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  isStaffRole,
  staffRolePriority,
  staffRoles,
} from "../platform/auth/contracts";

test("les rôles du Back Office sont fermés et priorisés", () => {
  assert.deepEqual(staffRoles, ["admin", "concierge", "read_only"]);
  assert.equal(isStaffRole("admin"), true);
  assert.equal(isStaffRole("traveler"), false);
  assert.ok(staffRolePriority.admin < staffRolePriority.concierge);
  assert.ok(staffRolePriority.concierge < staffRolePriority.read_only);
});

test("l’autorisation vérifie le JWT Supabase et le rôle interne", () => {
  const source = readFileSync("platform/auth/server.ts", "utf8");
  assert.match(source, /auth\.getUser\(token\)/);
  assert.match(source, /\.from\("app_user_roles"\)/);
  assert.match(source, /timingSafeEqual/);
  assert.match(source, /ADMIN_TOKEN_FALLBACK_ENABLED/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_.*(SECRET|TOKEN)/);
});

test("la connexion n’altère jamais le client Supabase privilégié", () => {
  const route = readFileSync("app/api/auth/staff/route.ts", "utf8");
  const provider = readFileSync("platform/auth/provider.ts", "utf8");
  assert.match(route, /getStaffAuthClient\(\)\.auth\.signInWithPassword/);
  assert.doesNotMatch(route, /getDatabaseClient\(\)\.auth\.signInWithPassword/);
  assert.match(provider, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(provider, /persistSession: false/);
});

test("la migration provisionne les profils sans attribuer de rôle implicitement", () => {
  const sql = readFileSync(
    "supabase/migrations/20260729160000_staff_auth_foundation.sql",
    "utf8",
  );
  assert.match(sql, /create or replace function public\.handle_new_auth_user/);
  assert.match(sql, /after insert on auth\.users/);
  assert.match(sql, /insert into public\.users/);
  assert.doesNotMatch(sql, /insert into public\.app_user_roles/);
});

test("toutes les API d’administration utilisent l’autorisation centralisée", () => {
  const routes = [
    "app/api/admin/channel-manager/route.ts",
    "app/api/admin/dashboard/route.ts",
    "app/api/admin/export/route.ts",
    "app/api/admin/guest-messages/preview/route.ts",
    "app/api/admin/housekeeping/route.ts",
    "app/api/admin/operations/route.ts",
    "app/api/admin/payments/refund/route.ts",
    "app/api/admin/revenue/route.ts",
    "app/api/calendar/admin/route.ts",
    "app/api/promotions/route.ts",
    "app/api/rates/route.ts",
  ];
  for (const route of routes) {
    const source = readFileSync(route, "utf8");
    assert.match(source, /authorizeStaff/, `${route} doit utiliser authorizeStaff`);
    assert.doesNotMatch(source, /requireAdmin/, `${route} utilise encore l’ancien garde`);
  }
});
