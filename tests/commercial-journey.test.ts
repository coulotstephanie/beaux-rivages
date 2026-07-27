import assert from "node:assert/strict";
import test from "node:test";
import { calculateQuote } from "../platform/pricing/service";
import { stayEmailTemplates } from "../platform/email/templates";
import { StripePaymentAdapter } from "../platform/payments/stripe";
import { amountDue, purposeToKind } from "../platform/payments/contracts";

test("complete direct-booking preparation calculates a family quote", async () => {
  const quote = await calculateQuote({
    propertySlug: "chai-des-tortues",
    arrival: "2026-10-12",
    departure: "2026-10-19",
    adults: 2,
    children: 2,
    babies: 1,
    pets: 1,
    options: ["signature", "linen", "pet"],
    experiences: ["famille"],
  });
  assert.equal(quote.nights, 7);
  assert.equal(quote.stayRules.valid, true);
  assert.ok(quote.promotion?.discount);
  assert.ok(quote.cleaningFee > 0);
  assert.ok(quote.optionLines.some((line) => line.id === "signature"));
  assert.ok(quote.total > quote.accommodation);
});

test("all transactional email stages render responsive branded HTML", () => {
  const data = { travelerName: "Camille", propertyName: "Le Chai des Tortues", arrival: "12 octobre", departure: "19 octobre", portalUrl: "https://www.beaux-rivages.com/carnet-voyageur?access=test" };
  const expected = ["confirmation", "depositReceived", "fullPaymentReceived", "contractAvailable", "preArrival", "arrival", "duringStay", "departure", "thanks"] as const;
  for (const name of expected) {
    const html = stayEmailTemplates[name](data);
    assert.match(html, /BEAUX RIVAGES/);
    assert.match(html, /viewport/);
    assert.match(html, /Stéphanie & Bruno/);
  }
});

test("Stripe remains disabled without an environment secret", async () => {
  const previous = process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_SECRET_KEY;
  const adapter = new StripePaymentAdapter();
  await assert.rejects(() => adapter.refund({ paymentProviderId: "pi_test" }), /not configured/);
  if (previous) process.env.STRIPE_SECRET_KEY = previous;
});

test("Stripe amount calculation never exceeds the authoritative database balance", () => {
  const reservation = { totalCents: 120000, depositDueCents: 36000 };
  assert.equal(amountDue({ ...reservation, purpose: "deposit", paidCents: 0 }), 36000);
  assert.equal(amountDue({ ...reservation, purpose: "deposit", paidCents: 10000 }), 26000);
  assert.equal(amountDue({ ...reservation, purpose: "balance", paidCents: 36000 }), 84000);
  assert.equal(amountDue({ ...reservation, purpose: "full-payment", paidCents: 0 }), 120000);
  assert.equal(amountDue({ ...reservation, purpose: "balance", paidCents: 120000 }), 0);
  assert.equal(purposeToKind("full-payment"), "full");
});
