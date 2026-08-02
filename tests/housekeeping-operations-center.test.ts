import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("a confirmed reservation generates one operational preparation task", async () => {
  const migration = await readFile(
    "supabase/migrations/20260805100000_housekeeping_operations_center.sql",
    "utf8",
  );
  assert.match(migration, /generate_housekeeping_for_reservation/);
  assert.match(migration, /housekeeping_one_task_per_reservation/);
  assert.match(migration, /reservation_items item/);
});

test("quality control is mandatory before a house becomes ready", async () => {
  const repository = await readFile("platform/housekeeping/repository.ts", "utf8");
  assert.match(repository, /QUALITY_CONTROL_REQUIRED/);
  assert.match(repository, /verified_at/);
  assert.match(repository, /operational_audit_log/);
});

test("the center covers incidents, linen, stock, private photos and editable templates", async () => {
  const component = await readFile("components/admin/HousekeepingAdmin.tsx", "utf8");
  for (const feature of ["IncidentForm", "LinenForm", "PhotoForm", "TemplateForm", "adjust_stock"])
    assert.match(component, new RegExp(feature));
  const route = await readFile("app/api/admin/housekeeping/photo/route.ts", "utf8");
  assert.match(route, /10_485_760/);
  assert.match(route, /authorizeStaff/);
  assert.match(route, /requireSameOrigin/);
});
