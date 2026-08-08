import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("Tarifs & Canaux reste derrière l'authentification administrateur", () => {
  const route = readFileSync("app/api/admin/pricing-channels/route.ts", "utf8");
  assert.match(route, /authorizeStaff\(request\)/);
  assert.match(route, /authorizeStaff\(request, \["admin"\]\)/);
  assert.match(route, /requireSameOrigin\(request\)/);
});

test("les tables de canaux ne définissent aucune lecture anonyme", () => {
  const migration = readFileSync("supabase/migrations/20260813100000_pricing_channels.sql", "utf8");
  assert.doesNotMatch(migration, /to anon/);
  assert.doesNotMatch(migration, /grant select[^;]+anon/i);
  assert.match(migration, /enable row level security/g);
  assert.match(migration, /enabled boolean not null default false/);
});

test("l'interface annonce explicitement l'absence de connexion plateforme", () => {
  const component = readFileSync("components/admin/ChannelPricingAdmin.tsx", "utf8");
  assert.match(component, /visibles uniquement dans l’administration/);
  assert.match(component, /aucune connexion plateforme/);
  assert.match(component, /Modifier le prix maître/);
  assert.match(component, /Modification en masse/);
});

test("l'API et l'interface imposent la même fenêtre de douze mois", () => {
  const route = readFileSync("app/api/admin/pricing-channels/route.ts", "utf8");
  const component = readFileSync("components/admin/ChannelPricingAdmin.tsx", "utf8");
  assert.match(route, /isInsideRollingWindow\(start, today\)/);
  assert.match(route, /mutationDates\.some/);
  assert.match(component, /min=\{allowedDates\.start\}/);
  assert.match(component, /max=\{allowedDates\.end\}/);
});

test("l'import CSV historique respecte lui aussi les douze mois glissants", () => {
  const route = readFileSync("app/api/rates/route.ts", "utf8");
  const component = readFileSync("components/RatesAdmin.tsx", "utf8");
  assert.match(route, /stayDates\.some\(\(stayDate\) => !isInsideRollingWindow/);
  assert.match(component, /eligibleEntries = entries\.filter/);
  assert.match(component, /ligne\(s\) hors fenêtre ignorée\(s\)/);
});

test("l'import CSV applique le garde-fou administrable et conserve le prix source", () => {
  const repository = readFileSync(
    "features/revenue-management/repositories/rate-override.repository.ts",
    "utf8",
  );
  const component = readFileSync("components/RatesAdmin.tsx", "utf8");
  assert.match(repository, /from\("rate_guardrails"\)/);
  assert.match(repository, /sourceNightlyRate: entry\.nightlyRate/);
  assert.match(repository, /guardrail_applied_count/);
  assert.match(component, /Garde-fou appliqué à/);
  assert.match(component, /prix CSV d’origine est conservé dans l’historique/);
});
