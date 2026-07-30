import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { calculateLoyaltyTier, commercialRecommendations, recommendExperiences, validateRevenuePromotion } from "../platform/revenue/engine";
import type { RevenuePromotion } from "../platform/revenue/contracts";

test("loyalty tiers progress from Découverte to Ambassadeur", () => {
  assert.equal(calculateLoyaltyTier({ stays: 1, totalSpentCents: 80_000 }), "decouverte");
  assert.equal(calculateLoyaltyTier({ stays: 2, totalSpentCents: 180_000 }), "insulaire");
  assert.equal(calculateLoyaltyTier({ stays: 4, totalSpentCents: 450_000 }), "grand-large");
  assert.equal(calculateLoyaltyTier({ stays: 8, totalSpentCents: 900_000 }), "ambassadeur");
});

test("upsell engine personalizes experiences without duplicating selections", () => {
  const family = recommendExperiences({ adults: 2, children: 1, babies: 1, pets: 1, arrival: "2026-07-10", departure: "2026-07-17", selectedCodes: ["linen"] });
  assert.equal(family.some((item) => item.experience.code === "linen"), false);
  assert.equal(family[0].experience.code, "pet");
  assert.ok(family.some((item) => item.experience.code === "early-check-in"));
  const couple = recommendExperiences({ adults: 2, children: 0, babies: 0, pets: 0, arrival: "2026-06-10", departure: "2026-06-14", selectedCodes: [] });
  assert.equal(couple[0].experience.code, "romance");
});

test("promotion rules enforce channel, season, loyalty, property and minimum stay", () => {
  const promotion: RevenuePromotion = {
    id: "promo", code: "RETOUR", label: "Retour sur les îles", discountType: "percentage", value: 10,
    minimumStayNights: 4, directOnly: true, lowSeasonOnly: true, returningGuestsOnly: true,
    propertySlugs: ["chai-des-tortues"], startsAt: "2026-01-01T00:00:00Z", endsAt: "2026-12-31T23:59:59Z", enabled: true,
  };
  const valid = { code: "retour", nights: 5, channel: "direct", propertySlug: "chai-des-tortues", season: "low", returningGuest: true, stayTotalCents: 120_000, date: new Date("2026-10-10") };
  assert.equal(validateRevenuePromotion(promotion, valid), 12_000);
  assert.equal(validateRevenuePromotion(promotion, { ...valid, channel: "airbnb" }), null);
  assert.equal(validateRevenuePromotion(promotion, { ...valid, returningGuest: false }), null);
});

test("commercial assistant produces actionable premium recommendations", () => {
  const recommendations = commercialRecommendations({ directShare: 20, occupancyRate: 40, averageBasketCents: 80_000 });
  assert.ok(recommendations.some((item) => item.title.includes("réservation directe")));
  assert.ok(recommendations.some((item) => item.title.includes("périodes calmes")));
  assert.equal(recommendations.every((item) => item.detail.length > 30), true);
});

test("Supabase migration includes every Revenue & Marketing foundation", () => {
  const sql = readFileSync("supabase/migrations/20260729113000_revenue_marketing_engine.sql", "utf8");
  for (const table of ["loyalty_accounts", "gift_cards", "gift_card_uses", "revenue_promotions", "referrals", "premium_experiences", "marketing_campaigns", "marketing_automations", "review_requests"]) {
    assert.match(sql, new RegExp(`create table public\\.${table}`));
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`));
  }
  assert.match(sql, /idempotency_key text not null unique/);
  assert.match(sql, /revoke all on public\.gift_cards/);
});

test("Revenue admin API requires authentication and same-origin mutations", () => {
  const source = readFileSync("app/api/admin/revenue/route.ts", "utf8");
  assert.match(source, /authorizeStaff/);
  assert.match(source, /\["admin"\]/);
  assert.match(source, /requireSameOrigin/);
  assert.match(source, /rateLimit/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_.*(SECRET|KEY|TOKEN)/);
});
