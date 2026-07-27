import { NextRequest } from "next/server";
import { z } from "zod";
import { bookingExperiences, stayOptions, type BookingExperienceId, type StayOptionId } from "@/booking";
import { isPropertySlug } from "@/platform/calendar/config";
import { getPropertyAvailability, isRangeAvailable } from "@/platform/calendar/service";
import { isDatabaseConfigured } from "@/platform/database/client";
import { SupabaseReservationRepository, ReservationConflictError } from "@/platform/database/reservations";
import { guestInputSchema } from "@/platform/database/schemas";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";
import { calculateQuote } from "@/platform/pricing/service";

const reservationRequestSchema = z.object({
  propertySlug: z.string(),
  arrival: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  departure: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.number().int().min(1).max(8),
  children: z.number().int().min(0).max(8),
  babies: z.number().int().min(0).max(4),
  pets: z.number().int().min(0).max(4),
  options: z.array(z.string()).max(30).default([]),
  experiences: z.array(z.string()).max(20).default([]),
  promotionCode: z.string().trim().max(40).optional(),
  guest: guestInputSchema,
  idempotencyKey: z.string().uuid(),
}).strict().superRefine((input, context) => {
  if (input.departure <= input.arrival) {
    context.addIssue({ code: "custom", path: ["departure"], message: "Dates invalides." });
  }
  if (input.adults + input.children > 8) {
    context.addIssue({ code: "custom", path: ["adults"], message: "Capacité dépassée." });
  }
});

function toCents(value: number) {
  return Math.round(value * 100);
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 5, 60_000);
  if (limited) return limited;
  if (!requireSameOrigin(request)) return noStoreJson({ error: "Origine refusée." }, { status: 403 });
  if (!isDatabaseConfigured()) {
    return noStoreJson({ error: "Les réservations durables ne sont pas encore activées." }, { status: 503 });
  }

  const parsed = reservationRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return noStoreJson({ error: "Demande de réservation invalide." }, { status: 400 });
  }
  const input = parsed.data;
  if (!isPropertySlug(input.propertySlug)) {
    return noStoreJson({ error: "Logement inconnu." }, { status: 400 });
  }
  const propertySlug = input.propertySlug;
  const options = input.options.filter((id): id is StayOptionId => stayOptions.some((option) => option.id === id));
  const experiences = input.experiences.filter((id): id is BookingExperienceId => bookingExperiences.some((experience) => experience.id === id));

  const calendar = await getPropertyAvailability(propertySlug, true);
  if (!isRangeAvailable(calendar.blocks, input.arrival, input.departure)) {
    return noStoreJson({ error: "Ces dates ne sont plus disponibles.", code: "DATES_UNAVAILABLE" }, { status: 409 });
  }

  const quote = await calculateQuote({
    propertySlug,
    arrival: input.arrival,
    departure: input.departure,
    adults: input.adults,
    children: input.children,
    babies: input.babies,
    pets: input.pets,
    options,
    experiences,
    promotionCode: input.promotionCode,
  });
  if (!quote.stayRules.valid) {
    return noStoreJson({ error: "La durée du séjour ne respecte pas les règles tarifaires." }, { status: 422 });
  }

  const totalCents = toCents(quote.total);
  const depositPercentage = Math.min(100, Math.max(0, Number(process.env.BOOKING_DEPOSIT_PERCENTAGE ?? 30)));
  const depositDueCents = Math.round(totalCents * depositPercentage / 100);

  try {
    const reservation = await new SupabaseReservationRepository().create({
      propertySlug,
      arrival: input.arrival,
      departure: input.departure,
      guest: input.guest,
      idempotencyKey: input.idempotencyKey,
      options: quote.optionLines.map((line) => ({
        code: line.id,
        label: line.label,
        quantity: line.quantity,
        unitPriceCents: toCents(line.unitPrice),
      })),
      quote: {
        adults: input.adults,
        children: input.children,
        babies: input.babies,
        pets: input.pets,
        nightsTotalCents: toCents(quote.accommodation),
        optionsTotalCents: toCents(quote.optionsTotal + quote.experiencesTotal),
        cleaningFeeCents: toCents(quote.cleaningFee),
        touristTaxCents: toCents(quote.touristTax),
        discountCents: toCents(quote.promotion?.discount ?? 0),
        totalCents,
        depositDueCents,
        balanceDueCents: totalCents - depositDueCents,
        pricingVersion: "rates-json-2026-07",
        breakdown: quote.nightlyLines,
      },
    });
    console.info(JSON.stringify({ event: "reservation.persisted", reference: reservation.reference, propertySlug }));
    return noStoreJson({
      id: reservation.id,
      reference: reservation.reference,
      status: reservation.status,
      paymentEnabled: false,
      message: "Demande enregistrée. Aucun paiement n’est encore activé.",
    }, { status: 201 });
  } catch (error) {
    if (error instanceof ReservationConflictError) {
      return noStoreJson({ error: "Ces dates viennent d’être réservées.", code: "DATES_UNAVAILABLE" }, { status: 409 });
    }
    console.error(JSON.stringify({ event: "reservation.failed", reason: error instanceof Error ? error.message : "unknown" }));
    return noStoreJson({ error: "La réservation n’a pas pu être enregistrée." }, { status: 503 });
  }
}
