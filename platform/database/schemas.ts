import { z } from "zod";
import { propertySlugs } from "@/platform/calendar/config";
import { reservationStatuses } from "@/platform/admin/contracts";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const cents = z.number().int().min(0).max(10_000_000);

export const guestInputSchema = z
  .object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: z.string().trim().min(6).max(30).optional(),
    addressLine1: z.string().trim().max(200).optional(),
    postalCode: z.string().trim().max(20).optional(),
    city: z.string().trim().max(100).optional(),
    countryCode: z.string().trim().length(2).toUpperCase().default("FR"),
  })
  .strict();

export const reservationOptionInputSchema = z
  .object({
    code: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    label: z.string().trim().min(1).max(150),
    quantity: z.number().int().min(1).max(20).default(1),
    unitPriceCents: cents,
  })
  .strict();

export const reservationServiceInputSchema = reservationOptionInputSchema.extend({
  kind: z.enum(["option", "experience", "basket"]),
  totalCents: cents,
});

export const reservationSpecialRequestsSchema = z
  .object({
    occasion: z.string().trim().max(100).nullable().default(null),
    message: z.string().trim().max(2000).nullable().default(null),
    allergies: z.string().trim().max(1000).nullable().default(null),
    lateArrival: z.string().trim().max(500).nullable().default(null),
  })
  .strict();

export const reservationQuoteSchema = z
  .object({
    adults: z.number().int().min(1).max(30),
    children: z.number().int().min(0).max(30).default(0),
    babies: z.number().int().min(0).max(10).default(0),
    pets: z.number().int().min(0).max(10).default(0),
    nightsTotalCents: cents,
    optionsTotalCents: cents.default(0),
    cleaningFeeCents: cents.default(0),
    touristTaxCents: cents.default(0),
    touristTaxDetails: z
      .object({
        liableGuests: z.number().int().min(0).max(30),
        exemptGuests: z.number().int().min(0).max(40),
        nights: z.number().int().min(1).max(365),
        nightlyPricePerGuest: z.number().min(0),
        baseRate: z.number().min(0),
        additionalRate: z.number().min(0),
        nightlyCap: z.number().min(0).nullable(),
        taxPerGuestNight: z.number().min(0),
        method: z.string().min(1).max(100),
        category: z.string().min(1).max(150),
        classification: z.string().min(1).max(30),
        effectiveFrom: z.string().optional(),
        municipality: z.string().optional(),
        intercommunality: z.string().optional(),
      })
      .optional(),
    discountCents: cents.default(0),
    totalCents: cents,
    depositDueCents: cents.default(0),
    balanceDueCents: cents,
    balanceDueDate: isoDate,
    depositPercentage: z.union([z.literal(30), z.literal(100)]),
    fullPaymentRequired: z.boolean(),
    pricingVersion: z.string().min(1).max(50),
    paymentMethod: z.enum(["bank_transfer", "holiday_vouchers", "card"]),
    termsVersion: z.string().min(1).max(50),
    termsAcceptedAt: z.string().datetime(),
    cancellationVersion: z.string().min(1).max(50),
    cancellationAcceptedAt: z.string().datetime(),
    breakdown: z.array(z.unknown()).default([]),
    services: z.array(reservationServiceInputSchema).max(50).default([]),
    specialRequests: reservationSpecialRequestsSchema.optional(),
    calendarValidation: z
      .object({
        checkedAt: z.string().datetime(),
        sources: z.array(z.string()),
        reliable: z.boolean(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine((quote, context) => {
    if (quote.depositDueCents + quote.balanceDueCents !== quote.totalCents) {
      context.addIssue({
        code: "custom",
        message: "L’acompte et le solde doivent correspondre au total.",
      });
    }
  });

export const createReservationSchema = z
  .object({
    propertySlug: z.enum(propertySlugs),
    arrival: isoDate,
    departure: isoDate,
    guest: guestInputSchema,
    quote: reservationQuoteSchema,
    options: z.array(reservationOptionInputSchema).max(30).default([]),
    idempotencyKey: z.string().uuid(),
  })
  .strict()
  .superRefine((input, context) => {
    if (input.departure <= input.arrival) {
      context.addIssue({
        code: "custom",
        path: ["departure"],
        message: "La date de départ doit suivre l’arrivée.",
      });
    }
  });

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const adminManualReservationSchema = z
  .object({
    action: z.literal("create_reservation"),
    propertySlug: z.enum(propertySlugs),
    arrival: isoDate,
    departure: isoDate,
    adults: z.number().int().min(1).max(30),
    children: z.number().int().min(0).max(30).default(0),
    babies: z.number().int().min(0).max(10).default(0),
    pets: z.number().int().min(0).max(10).default(0),
    channel: z.enum(["direct", "manual"]).default("manual"),
    status: z.enum(["requested", "confirmed"]).default("confirmed"),
    totalCents: cents.optional(),
    overrideReason: z.string().trim().min(10).max(500).optional(),
    options: z
      .array(
        z.enum([
          "signature",
          "linen",
          "beach-towels",
          "robes",
          "slippers",
          "personal-arrival",
          "late-checkout",
          "pet",
          "aperitif-basket",
          "basket",
          "signature-aperitif",
          "signature-sweet",
        ]),
      )
      .max(30)
      .default([]),
    experiences: z
      .array(z.enum(["romance", "anniversaire"]))
      .max(20)
      .default([]),
    specialRequests: reservationSpecialRequestsSchema.optional(),
    guest: guestInputSchema,
  })
  .strict()
  .superRefine((input, context) => {
    if (input.departure <= input.arrival) {
      context.addIssue({
        code: "custom",
        path: ["departure"],
        message: "La date de départ doit suivre l’arrivée.",
      });
    }
    if (input.totalCents !== undefined && !input.overrideReason) {
      context.addIssue({
        code: "custom",
        path: ["overrideReason"],
        message: "Une dérogation tarifaire doit être justifiée.",
      });
    }
  });

export const adminBlockDatesSchema = z
  .object({
    action: z.literal("block_dates"),
    propertySlug: z.enum(propertySlugs),
    arrival: isoDate,
    departure: isoDate,
    note: z.string().trim().min(2).max(300),
  })
  .strict()
  .superRefine((input, context) => {
    if (input.departure <= input.arrival) {
      context.addIssue({
        code: "custom",
        path: ["departure"],
        message: "La date de fin doit suivre la date de début.",
      });
    }
  });

export const adminUnblockDatesSchema = z
  .object({
    action: z.literal("unblock_dates"),
    blockId: z.string().uuid(),
  })
  .strict();

export const adminReservationUpdateSchema = z
  .object({
    action: z.literal("update_reservation"),
    reservationId: z.string().uuid(),
    status: z.enum(reservationStatuses),
    arrival: isoDate.optional(),
    departure: isoDate.optional(),
    cancellationReason: z.string().trim().max(500).optional(),
  })
  .strict()
  .superRefine((input, context) => {
    if (input.arrival && input.departure && input.departure <= input.arrival) {
      context.addIssue({
        code: "custom",
        path: ["departure"],
        message: "La date de départ doit suivre l’arrivée.",
      });
    }
  });

const checklistItemSchema = z
  .object({
    id: z.string().trim().min(1).max(80),
    label: z.string().trim().min(1).max(150),
    done: z.boolean(),
  })
  .strict();

export const adminHousekeepingUpdateSchema = z
  .object({
    action: z.literal("update_housekeeping"),
    taskId: z.string().uuid(),
    status: z.enum(["todo", "in_progress", "blocked", "completed", "verified"]),
    checklist: z.array(checklistItemSchema).max(40),
  })
  .strict();

export const adminMaintenanceCreateSchema = z
  .object({
    action: z.literal("create_maintenance"),
    propertyId: z.string().uuid(),
    reservationId: z.string().uuid().optional(),
    title: z.string().trim().min(2).max(180),
    description: z.string().trim().max(2000).optional(),
    priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
    assignee: z.string().trim().max(120).optional(),
  })
  .strict();

export const adminMaintenanceUpdateSchema = z
  .object({
    action: z.literal("update_maintenance"),
    incidentId: z.string().uuid(),
    status: z.enum(["open", "assigned", "in_progress", "waiting", "resolved", "closed"]),
  })
  .strict();

export const adminConciergeCreateSchema = z
  .object({
    action: z.literal("create_concierge"),
    reservationId: z.string().uuid(),
    kind: z.string().trim().min(2).max(80),
    title: z.string().trim().min(2).max(180),
    details: z.string().trim().max(2000).optional(),
    scheduledFor: z.string().datetime().optional(),
    isSurprise: z.boolean().default(false),
  })
  .strict();

export const adminNotificationUpdateSchema = z
  .object({
    action: z.literal("update_notification"),
    notificationId: z.string().uuid(),
    read: z.boolean(),
  })
  .strict();

export const adminReservationNoteSchema = z
  .object({
    action: z.literal("create_reservation_note"),
    reservationId: z.string().uuid(),
    category: z
      .enum(["general", "arrival", "departure", "payment", "concierge", "incident"])
      .default("general"),
    content: z.string().trim().min(2).max(2000),
    pinned: z.boolean().default(false),
  })
  .strict();
export const adminConciergeOrderUpdateSchema = z
  .object({
    action: z.literal("update_concierge_order"),
    orderId: z.string().uuid(),
    status: z.enum([
      "requested",
      "confirmed",
      "partially_confirmed",
      "declined",
      "payment_pending",
      "paid",
      "preparing",
      "delivered",
      "cancelled",
    ]),
  })
  .strict();
export const adminSpecialRequestUpdateSchema = z
  .object({
    action: z.literal("update_special_request"),
    requestId: z.string().uuid(),
    status: z.enum(["requested", "reviewing", "accepted", "declined", "completed"]),
  })
  .strict();

export const adminRecordPaymentSchema = z
  .object({
    action: z.literal("record_payment"),
    reservationId: z.string().uuid(),
    kind: z.enum(["deposit", "balance", "full"]),
    amountCents: z.number().int().positive().max(10_000_000),
    receivedAt: z.string().datetime(),
    bankReference: z.string().trim().min(2).max(160),
    ibanLabel: z.string().trim().max(120).optional(),
    comment: z.string().trim().max(1000).optional(),
    evidencePath: z.string().trim().max(500).optional(),
  })
  .strict();

export const adminRefundPaymentSchema = z
  .object({
    action: z.literal("refund_manual_payment"),
    paymentId: z.string().uuid(),
    amountCents: z.number().int().positive().max(10_000_000),
    reason: z.string().trim().min(10).max(1000),
  })
  .strict();

export const adminCreditNoteSchema = z
  .object({
    action: z.literal("create_credit_note"),
    reservationId: z.string().uuid(),
    amountCents: z.number().int().positive().max(10_000_000),
    reason: z.string().trim().min(10).max(1000),
  })
  .strict();

export const adminPaymentReminderSchema = z
  .object({
    action: z.literal("create_payment_reminder"),
    reservationId: z.string().uuid(),
    kind: z.enum(["deposit", "balance"]),
    channel: z.enum(["email", "manual"]).default("manual"),
    comment: z.string().trim().max(1000).optional(),
  })
  .strict();

export const adminPaymentMethodSchema = z
  .object({
    action: z.literal("update_payment_method"),
    method: z.enum(["bank_transfer", "holiday_vouchers", "card"]),
    enabled: z.boolean(),
  })
  .strict();

export const adminOperationSchema = z.discriminatedUnion("action", [
  adminManualReservationSchema,
  adminBlockDatesSchema,
  adminUnblockDatesSchema,
  adminReservationUpdateSchema,
  adminHousekeepingUpdateSchema,
  adminMaintenanceCreateSchema,
  adminMaintenanceUpdateSchema,
  adminConciergeCreateSchema,
  adminNotificationUpdateSchema,
  adminReservationNoteSchema,
  adminConciergeOrderUpdateSchema,
  adminSpecialRequestUpdateSchema,
  adminRecordPaymentSchema,
  adminRefundPaymentSchema,
  adminCreditNoteSchema,
  adminPaymentReminderSchema,
  adminPaymentMethodSchema,
]);

export type AdminOperationInput = z.infer<typeof adminOperationSchema>;
