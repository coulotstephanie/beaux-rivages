import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { adminOperationSchema, createReservationSchema } from "../platform/database/schemas";

const migration = readFileSync(
  new URL("../supabase/migrations/20260727170000_production_booking_foundation.sql", import.meta.url),
  "utf8",
);
const stripeMigration = readFileSync(
  new URL("../supabase/migrations/20260727204500_stripe_test_payments.sql", import.meta.url),
  "utf8",
);

test("the reservation payload accepts a complete validated request", () => {
  const result = createReservationSchema.safeParse({
    propertySlug: "chai-des-tortues",
    arrival: "2026-10-12",
    departure: "2026-10-16",
    guest: {
      firstName: "Camille",
      lastName: "Martin",
      email: "camille@example.fr",
      countryCode: "FR",
    },
    quote: {
      adults: 2,
      children: 0,
      babies: 0,
      pets: 0,
      nightsTotalCents: 88000,
      optionsTotalCents: 0,
      cleaningFeeCents: 9500,
      touristTaxCents: 0,
      discountCents: 0,
      totalCents: 97500,
      depositDueCents: 29250,
      balanceDueCents: 68250,
      pricingVersion: "test",
      breakdown: [],
    },
    options: [],
    idempotencyKey: "73f640dc-e678-4ba0-a6df-b12576880805",
  });
  assert.equal(result.success, true);
});

test("the reservation payload rejects inconsistent financial totals", () => {
  const result = createReservationSchema.safeParse({
    propertySlug: "nid-d-ete",
    arrival: "2026-10-12",
    departure: "2026-10-16",
    guest: { firstName: "Camille", lastName: "Martin", email: "camille@example.fr" },
    quote: {
      adults: 2,
      children: 0,
      babies: 0,
      pets: 0,
      nightsTotalCents: 80000,
      optionsTotalCents: 0,
      cleaningFeeCents: 9000,
      touristTaxCents: 0,
      discountCents: 0,
      totalCents: 89000,
      depositDueCents: 100,
      balanceDueCents: 100,
      pricingVersion: "test",
      breakdown: [],
    },
    idempotencyKey: "73f640dc-e678-4ba0-a6df-b12576880805",
  });
  assert.equal(result.success, false);
});

test("the SQL foundation enforces transactional occupancy conflicts and RLS", () => {
  assert.match(migration, /exclude using gist/);
  assert.match(migration, /pg_advisory_xact_lock/);
  assert.match(migration, /create_direct_reservation/);
  assert.match(migration, /enable row level security/g);
  assert.doesNotMatch(migration, /create policy "[^"]+"[\s\S]*\bto anon\b/i);
});

test("all requested storage buckets remain private", () => {
  for (const bucket of ["contracts", "photos", "avatars", "documents", "guestbook", "invoices"]) {
    assert.equal(migration.includes(`('${bucket}', '${bucket}', false`), true);
  }
});

test("back-office operations validate manual reservations and date blocks", () => {
  const manual = adminOperationSchema.safeParse({
    action: "create_reservation",
    propertySlug: "villa-raie-manta",
    arrival: "2026-11-02",
    departure: "2026-11-06",
    adults: 4,
    children: 2,
    babies: 0,
    pets: 1,
    channel: "manual",
    status: "confirmed",
    totalCents: 145000,
    guest: { firstName: "Alice", lastName: "Durand", email: "alice@example.fr", countryCode: "FR" },
  });
  const block = adminOperationSchema.safeParse({
    action: "block_dates",
    propertySlug: "nid-d-ete",
    arrival: "2026-12-01",
    departure: "2026-12-04",
    note: "Entretien annuel",
  });
  assert.equal(manual.success, true);
  assert.equal(block.success, true);
});

test("back-office operations reject reversed dates and unknown actions", () => {
  assert.equal(adminOperationSchema.safeParse({
    action: "block_dates",
    propertySlug: "chai-des-tortues",
    arrival: "2026-12-10",
    departure: "2026-12-01",
    note: "Entretien",
  }).success, false);
  assert.equal(adminOperationSchema.safeParse({ action: "delete_everything" }).success, false);
});

test("back-office status changes accept only the reservation lifecycle", () => {
  assert.equal(adminOperationSchema.safeParse({
    action: "update_reservation",
    reservationId: "73f640dc-e678-4ba0-a6df-b12576880805",
    status: "cancelled",
    cancellationReason: "Demande du voyageur",
  }).success, true);
  assert.equal(adminOperationSchema.safeParse({
    action: "update_reservation",
    reservationId: "73f640dc-e678-4ba0-a6df-b12576880805",
    status: "deleted",
  }).success, false);
});

test("Stripe webhook persistence is idempotent, private and reversible", () => {
  assert.match(stripeMigration, /provider_event_id text not null/);
  assert.match(stripeMigration, /unique \(provider, provider_event_id\)/);
  assert.match(stripeMigration, /enable row level security/);
  assert.doesNotMatch(stripeMigration, /\bto anon\b/i);
  assert.match(stripeMigration, /claim_payment_event/);
});
