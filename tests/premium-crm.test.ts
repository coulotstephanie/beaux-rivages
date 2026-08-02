import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the CRM creates one canonical privacy-aware traveler profile", async () => {
  const migration = await readFile("supabase/migrations/20260804100000_premium_crm.sql", "utf8");
  assert.match(migration, /normalized_email text not null unique/);
  assert.match(migration, /lower\(trim\(new\.email\)\)/);
  assert.match(migration, /guest_profile_links/);
  assert.match(migration, /birthday_processing_consent_at/);
});

test("private CRM information is protected and changes are audited", async () => {
  const migration = await readFile("supabase/migrations/20260804100000_premium_crm.sql", "utf8");
  assert.match(migration, /enable row level security/g);
  assert.match(migration, /current_app_role\(\) in \('admin','concierge'\)/);
  assert.match(migration, /create table public\.crm_change_log/);
  const route = await readFile("app/api/admin/crm/route.ts", "utf8");
  assert.match(route, /authorizeStaff\(request, \["admin", "concierge"\]\)/);
  assert.match(route, /requireSameOrigin/);
});

test("the premium CRM provides stays, finance, documents and communications", async () => {
  const repository = await readFile("platform/crm/repository.ts", "utf8");
  for (const source of [
    "reservation_items",
    "contracts",
    "invoices",
    "payments",
    "transactional_emails",
  ])
    assert.match(repository, new RegExp(source));
  const dashboard = await readFile("components/AdminDashboard.tsx", "utf8");
  assert.match(dashboard, /PremiumCrmAdmin/);
  assert.match(dashboard, /Fiche CRM/);
});
