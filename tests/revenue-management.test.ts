import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync("supabase/migrations/20260730010000_revenue_management.sql", "utf8");

test("les tarifs disposent de garde-fous et de périodes auditables", () => {
  assert.match(migration, /create table public\.rate_guardrails/);
  assert.match(migration, /create table public\.rate_overrides/);
  assert.match(migration, /enforce_rate_guardrails/);
  assert.match(migration, /created_by uuid references auth\.users/);
});

test("la tarification future selon l'occupation reste désactivée", () => {
  assert.match(migration, /occupancy_pricing_enabled boolean not null default false/);
});

test("l'écriture tarifaire impose authentification et origine fiable", () => {
  const source = readFileSync("app/api/rates/route.ts", "utf8");
  assert.match(source, /requireSameOrigin/);
  assert.match(source, /authorizeStaff/);
  assert.match(source, /rateOverrideSchema\.safeParse/);
});
