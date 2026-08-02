import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { calculateQuote, rateForDate } from "../platform/pricing/service";
import type { PropertyRatePlan } from "../platform/pricing/contracts";

const plan: PropertyRatePlan = {
  propertySlug: "chai-des-tortues",
  currency: "EUR",
  baseNightlyRate: 100,
  weekendNightlyRate: 120,
  minimumNights: 2,
  maximumNights: 28,
  allowedArrivalWeekdays: [6],
  cleaningFee: 80,
  securityDeposit: 500,
  touristTax: { enabled: false, mode: "percentage", value: 0 },
  optionPrices: {},
  seasons: [
    {
      id: "high",
      label: "Haute saison",
      kind: "high",
      startsOn: "2026-07-01",
      endsOn: "2026-09-01",
      nightlyRate: 250,
      minimumNights: 7,
    },
  ],
  promotions: [],
};

test("the unique pricing engine prioritizes a season over the standard rate", () => {
  assert.deepEqual(rateForDate(plan, "2026-07-18"), {
    rate: 250,
    season: "Haute saison",
    minimumNights: 7,
  });
});

test("arrival-day rules are exposed by the public quote", async () => {
  const quote = await calculateQuote({
    propertySlug: "chai-des-tortues",
    arrival: "2026-08-03",
    departure: "2026-08-10",
    adults: 2,
    children: 0,
    babies: 0,
    pets: 0,
    options: [],
    experiences: [],
  });
  assert.equal(typeof quote.stayRules.arrivalIsAllowed, "boolean");
  assert.deepEqual(quote.stayRules.allowedArrivalWeekdays, [1, 2, 3, 4, 5, 6, 7]);
});

test("pricing-center persistence is audited and platform push stays disabled", async () => {
  const migration = await readFile("supabase/migrations/20260803100000_pricing_center.sql", "utf8");
  assert.match(migration, /create table public\.pricing_change_log/);
  assert.match(migration, /check \(automatic_push_enabled = false\)/);
  const route = await readFile("app/api/admin/pricing-center/route.ts", "utf8");
  assert.match(route, /authorizeStaff\(request, \["admin"\]\)/);
  assert.match(route, /requireSameOrigin/);
});
