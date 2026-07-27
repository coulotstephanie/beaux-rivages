import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createReservationSchema } from "../platform/database/schemas";

const migration = readFileSync(
  new URL("../supabase/migrations/20260727170000_production_booking_foundation.sql", import.meta.url),
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
