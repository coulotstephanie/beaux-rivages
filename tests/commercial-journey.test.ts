import assert from "node:assert/strict";
import test from "node:test";
import { calculateQuote } from "../platform/pricing/service";
import { stayEmailTemplates } from "../platform/email/templates";
import { StripePaymentAdapter } from "../platform/payments/stripe";
import { amountDue, purposeToKind } from "../platform/payments/contracts";
import { describeWelcomeBaskets } from "../platform/reservations/welcome-baskets";

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
    experiences: [],
  });
  assert.equal(quote.nights, 7);
  assert.equal(quote.stayRules.valid, true);
  assert.ok(quote.promotion?.discount);
  assert.ok(quote.cleaningFee > 0);
  assert.ok(quote.touristTax > 0);
  assert.equal(quote.touristTaxDetails.liableGuests, 2);
  assert.equal(quote.touristTaxDetails.exemptGuests, 3);
  assert.equal(quote.touristTaxDetails.method, "Tarif proportionnel");
  assert.ok(quote.optionLines.some((line) => line.id === "signature"));
  assert.ok(quote.total > quote.accommodation);
});

test("tourist tax excludes minors and respects the local nightly cap", async () => {
  const quote = await calculateQuote({
    propertySlug: "nid-d-ete",
    arrival: "2026-08-10",
    departure: "2026-08-12",
    adults: 2,
    children: 2,
    babies: 1,
    pets: 0,
    options: [],
    experiences: [],
  });
  assert.equal(quote.touristTaxDetails.liableGuests, 2);
  assert.equal(quote.touristTaxDetails.exemptGuests, 3);
  assert.ok(quote.touristTaxDetails.taxPerGuestNight <= 3.3);
  assert.equal(
    quote.touristTax,
    quote.touristTaxDetails.taxPerGuestNight * quote.touristTaxDetails.liableGuests * 2,
  );
});

test("Signature includes one welcome basket and charges only the additional basket", async () => {
  const quote = await calculateQuote({
    propertySlug: "chai-des-tortues",
    arrival: "2026-10-12",
    departure: "2026-10-19",
    adults: 2,
    children: 0,
    babies: 0,
    pets: 0,
    options: ["signature", "signature-aperitif", "basket"],
    experiences: [],
  });
  assert.equal(quote.optionLines.find((line) => line.id === "signature-aperitif")?.total, 0);
  assert.equal(quote.optionLines.find((line) => line.id === "basket")?.total, 45);
  assert.deepEqual(
    describeWelcomeBaskets([
      { code: "signature" },
      { code: "signature-aperitif" },
      { code: "basket" },
    ]),
    { included: "Panier Apéritif", extra: "Panier Douceur · 45 €" },
  );
});

test("all transactional email stages render responsive branded HTML", () => {
  const data = {
    travelerName: "Camille",
    propertyName: "Le Chai des Tortues",
    arrival: "12 octobre",
    departure: "19 octobre",
    portalUrl: "https://www.beaux-rivages.com/carnet-voyageur?access=test",
  };
  const expected = [
    "confirmation",
    "depositReceived",
    "fullPaymentReceived",
    "contractAvailable",
    "preArrival",
    "arrival",
    "duringStay",
    "departure",
    "thanks",
  ] as const;
  for (const name of expected) {
    const html = stayEmailTemplates[name](data);
    assert.match(html, /BEAUX RIVAGES/);
    assert.match(html, /viewport/);
    assert.match(html, /Stéphanie & Bruno/);
  }
});

test("Stripe remains disabled without an environment secret", async () => {
  const previous = process.env.STRIPE_SECRET_KEY;
  const previousTravelerPayments = process.env.STRIPE_TRAVELER_PAYMENTS_ENABLED;
  delete process.env.STRIPE_SECRET_KEY;
  process.env.STRIPE_TRAVELER_PAYMENTS_ENABLED = "true";
  const adapter = new StripePaymentAdapter();
  await assert.rejects(() => adapter.refund({ paymentProviderId: "pi_test" }), /not configured/);
  if (previous) process.env.STRIPE_SECRET_KEY = previous;
  if (previousTravelerPayments === undefined) delete process.env.STRIPE_TRAVELER_PAYMENTS_ENABLED;
  else process.env.STRIPE_TRAVELER_PAYMENTS_ENABLED = previousTravelerPayments;
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
