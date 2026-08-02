import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  adminCreditNoteSchema,
  adminPaymentMethodSchema,
  adminPaymentReminderSchema,
  adminRecordPaymentSchema,
  adminRefundPaymentSchema,
} from "../platform/database/schemas";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("bank transfers require a complete reconciliation record", () => {
  assert.equal(
    adminRecordPaymentSchema.safeParse({
      action: "record_payment",
      reservationId: "11111111-1111-4111-8111-111111111111",
      kind: "deposit",
      amountCents: 45_000,
      receivedAt: "2026-08-02T08:00:00.000Z",
      bankReference: "VIR-DUPONT-2026",
      ibanLabel: "Compte principal",
      comment: "Acompte rapproché",
    }).success,
    true,
  );
  assert.equal(
    adminRecordPaymentSchema.safeParse({
      action: "record_payment",
      reservationId: "11111111-1111-4111-8111-111111111111",
      kind: "deposit",
      amountCents: 45_000,
      receivedAt: "2026-08-02T08:00:00.000Z",
    }).success,
    false,
  );
});

test("refunds, credit notes and reminders require explicit financial context", () => {
  assert.equal(
    adminRefundPaymentSchema.safeParse({
      action: "refund_manual_payment",
      paymentId: "11111111-1111-4111-8111-111111111111",
      amountCents: 10_000,
      reason: "Annulation justifiée par le dossier voyageur",
    }).success,
    true,
  );
  assert.equal(
    adminCreditNoteSchema.safeParse({
      action: "create_credit_note",
      reservationId: "11111111-1111-4111-8111-111111111111",
      amountCents: 10_000,
      reason: "Avoir consécutif à une annulation documentée",
    }).success,
    true,
  );
  assert.equal(
    adminPaymentReminderSchema.safeParse({
      action: "create_payment_reminder",
      reservationId: "11111111-1111-4111-8111-111111111111",
      kind: "balance",
      channel: "manual",
    }).success,
    true,
  );
});

test("payment switches only accept supported methods", () => {
  assert.equal(
    adminPaymentMethodSchema.safeParse({
      action: "update_payment_method",
      method: "holiday_vouchers",
      enabled: true,
    }).success,
    true,
  );
  assert.equal(
    adminPaymentMethodSchema.safeParse({
      action: "update_payment_method",
      method: "crypto",
      enabled: true,
    }).success,
    false,
  );
});

test("traveler card checkout has two independent activation gates", () => {
  assert.match(read("app/api/payments/checkout/route.ts"), /assertPaymentMethodEnabled\("card"\)/);
  assert.match(read("platform/payments/stripe.ts"), /STRIPE_TRAVELER_PAYMENTS_ENABLED/);
});

test("the booking form obtains enabled methods from the server", () => {
  const form = read("components/DirectBookingForm.tsx");
  assert.match(form, /fetch\("\/api\/payment-methods"/);
  assert.doesNotMatch(form, /value="holiday_vouchers"/);
  assert.doesNotMatch(form, /value="card"/);
});

test("database constraints prevent duplicate active settlements", () => {
  const migration = read("supabase/migrations/20260802100000_bank_transfer_payments.sql");
  assert.match(migration, /payments_single_settlement_kind/);
  assert.match(migration, /payment_method_settings/);
  assert.match(migration, /bank_reference/);
  assert.match(migration, /payment_reminders/);
});
