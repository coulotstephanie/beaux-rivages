import { z } from "zod";
import { propertySlugs } from "@/platform/calendar/config";
import { reservationStatuses } from "@/platform/admin/contracts";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const cents = z.number().int().min(0).max(10_000_000);

export const guestInputSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().min(6).max(30).optional(),
  addressLine1: z.string().trim().max(200).optional(),
  postalCode: z.string().trim().max(20).optional(),
  city: z.string().trim().max(100).optional(),
  countryCode: z.string().trim().length(2).toUpperCase().default("FR"),
}).strict();

export const reservationOptionInputSchema = z.object({
  code: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  label: z.string().trim().min(1).max(150),
  quantity: z.number().int().min(1).max(20).default(1),
  unitPriceCents: cents,
}).strict();

export const reservationQuoteSchema = z.object({
  adults: z.number().int().min(1).max(30),
  children: z.number().int().min(0).max(30).default(0),
  babies: z.number().int().min(0).max(10).default(0),
  pets: z.number().int().min(0).max(10).default(0),
  nightsTotalCents: cents,
  optionsTotalCents: cents.default(0),
  cleaningFeeCents: cents.default(0),
  touristTaxCents: cents.default(0),
  discountCents: cents.default(0),
  totalCents: cents,
  depositDueCents: cents.default(0),
  balanceDueCents: cents,
  pricingVersion: z.string().min(1).max(50),
  breakdown: z.array(z.unknown()).default([]),
}).strict().superRefine((quote, context) => {
  if (quote.depositDueCents + quote.balanceDueCents !== quote.totalCents) {
    context.addIssue({ code: "custom", message: "L’acompte et le solde doivent correspondre au total." });
  }
});

export const createReservationSchema = z.object({
  propertySlug: z.enum(propertySlugs),
  arrival: isoDate,
  departure: isoDate,
  guest: guestInputSchema,
  quote: reservationQuoteSchema,
  options: z.array(reservationOptionInputSchema).max(30).default([]),
  idempotencyKey: z.string().uuid(),
}).strict().superRefine((input, context) => {
  if (input.departure <= input.arrival) {
    context.addIssue({ code: "custom", path: ["departure"], message: "La date de départ doit suivre l’arrivée." });
  }
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const adminManualReservationSchema = z.object({
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
  totalCents: cents,
  guest: guestInputSchema,
}).strict().superRefine((input, context) => {
  if (input.departure <= input.arrival) {
    context.addIssue({ code: "custom", path: ["departure"], message: "La date de départ doit suivre l’arrivée." });
  }
});

export const adminBlockDatesSchema = z.object({
  action: z.literal("block_dates"),
  propertySlug: z.enum(propertySlugs),
  arrival: isoDate,
  departure: isoDate,
  note: z.string().trim().min(2).max(300),
}).strict().superRefine((input, context) => {
  if (input.departure <= input.arrival) {
    context.addIssue({ code: "custom", path: ["departure"], message: "La date de fin doit suivre la date de début." });
  }
});

export const adminReservationUpdateSchema = z.object({
  action: z.literal("update_reservation"),
  reservationId: z.string().uuid(),
  status: z.enum(reservationStatuses),
  arrival: isoDate.optional(),
  departure: isoDate.optional(),
  cancellationReason: z.string().trim().max(500).optional(),
}).strict().superRefine((input, context) => {
  if (input.arrival && input.departure && input.departure <= input.arrival) {
    context.addIssue({ code: "custom", path: ["departure"], message: "La date de départ doit suivre l’arrivée." });
  }
});

export const adminOperationSchema = z.discriminatedUnion("action", [
  adminManualReservationSchema,
  adminBlockDatesSchema,
  adminReservationUpdateSchema,
]);

export type AdminOperationInput = z.infer<typeof adminOperationSchema>;
