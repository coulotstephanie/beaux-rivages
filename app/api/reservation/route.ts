import { NextRequest } from "next/server";
import { z } from "zod";
import {
  bookingExperiences,
  stayOptions,
  type BookingExperienceId,
  type StayOptionId,
} from "@/booking";
import { isPropertySlug } from "@/platform/calendar/config";
import { getPropertyAvailability, isRangeAvailable } from "@/platform/calendar/service";
import { isDatabaseConfigured } from "@/platform/database/client";
import {
  SupabaseReservationRepository,
  ReservationConflictError,
} from "@/platform/database/reservations";
import { guestInputSchema } from "@/platform/database/schemas";
import { ConfigurableEmailProvider } from "@/platform/email/contracts";
import { ownerRequestEmail, travelerRequestEmail } from "@/platform/email/reservation-request";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";
import { calculateQuote } from "@/platform/pricing/service";
import { legalVersion } from "@/content/legal";
import { reservationSpecialRequestsSchema } from "@/platform/database/schemas";
import { reservationServiceItems } from "@/platform/reservations/context";
import { assertPaymentMethodEnabled } from "@/platform/payments/methods";
import { isStayInsidePublicBookingWindow } from "@/platform/reservations/booking-window";

const reservationRequestSchema = z
  .object({
    propertySlug: z.string(),
    arrival: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    departure: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    adults: z.number().int().min(1).max(8),
    children: z.number().int().min(0).max(8),
    babies: z.number().int().min(0).max(4),
    pets: z.number().int().min(0).max(4),
    options: z.array(z.string()).max(30).default([]),
    experiences: z.array(z.string()).max(20).default([]),
    specialRequests: reservationSpecialRequestsSchema.optional(),
    promotionCode: z.string().trim().max(40).optional(),
    guest: guestInputSchema,
    idempotencyKey: z.string().uuid(),
    paymentMethod: z.enum(["bank_transfer", "holiday_vouchers", "card"]),
    termsAccepted: z.literal(true),
    cancellationAccepted: z.literal(true),
  })
  .strict()
  .superRefine((input, context) => {
    if (input.departure <= input.arrival) {
      context.addIssue({ code: "custom", path: ["departure"], message: "Dates invalides." });
    }
    if (input.adults + input.children > 8) {
      context.addIssue({ code: "custom", path: ["adults"], message: "Capacité dépassée." });
    }
    const signature = input.options.includes("signature");
    const included = input.options.filter((item) =>
      ["signature-aperitif", "signature-sweet"].includes(item),
    );
    const paid = input.options.filter((item) => ["aperitif-basket", "basket"].includes(item));
    if (!signature && included.length) {
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "Panier Signature invalide.",
      });
    }
    if (signature && included.length !== 1) {
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "Choisissez le panier inclus.",
      });
    }
    if (paid.length > 1) {
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "Un seul panier d’accueil peut être sélectionné.",
      });
    }
    if (
      (input.options.includes("signature-aperitif") && input.options.includes("aperitif-basket")) ||
      (input.options.includes("signature-sweet") && input.options.includes("basket"))
    ) {
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "Un panier ne peut pas être sélectionné deux fois.",
      });
    }
  });

function toCents(value: number) {
  return Math.round(value * 100);
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 5, 60_000);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine refusée." }, { status: 403 });
  if (!isDatabaseConfigured()) {
    return noStoreJson(
      { error: "Les réservations durables ne sont pas encore activées." },
      { status: 503 },
    );
  }

  const parsed = reservationRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return noStoreJson({ error: "Demande de réservation invalide." }, { status: 400 });
  }
  const input = parsed.data;
  if (!isStayInsidePublicBookingWindow(input.arrival, input.departure)) {
    return noStoreJson(
      {
        error: "Les réservations sont ouvertes sur les 12 prochains mois uniquement.",
        code: "OUTSIDE_BOOKING_WINDOW",
      },
      { status: 422 },
    );
  }
  try {
    await assertPaymentMethodEnabled(input.paymentMethod);
  } catch {
    return noStoreJson({ error: "Ce mode de règlement n’est pas disponible." }, { status: 409 });
  }
  if (!isPropertySlug(input.propertySlug)) {
    return noStoreJson({ error: "Logement inconnu." }, { status: 400 });
  }
  const propertySlug = input.propertySlug;
  const options = input.options.filter((id): id is StayOptionId =>
    stayOptions.some((option) => option.id === id),
  );
  const experiences = input.experiences.filter((id): id is BookingExperienceId =>
    bookingExperiences.some((experience) => experience.id === id),
  );
  if (options.length !== input.options.length || experiences.length !== input.experiences.length) {
    return noStoreJson({ error: "Une prestation sélectionnée est invalide." }, { status: 400 });
  }
  if (
    experiences.some((id) => {
      const experience = bookingExperiences.find((item) => item.id === id);
      return experience?.propertySlugs && !experience.propertySlugs.includes(propertySlug);
    })
  ) {
    return noStoreJson(
      { error: "Une expérience n’est pas proposée dans ce logement." },
      { status: 400 },
    );
  }

  const calendar = await getPropertyAvailability(propertySlug, { force: true, persist: true });
  if (!calendar.reliable) {
    return noStoreJson(
      {
        error:
          "La disponibilité ne peut pas être vérifiée pour le moment. Réessayez dans quelques minutes.",
        code: "CALENDAR_UNAVAILABLE",
      },
      { status: 503 },
    );
  }
  if (!isRangeAvailable(calendar.blocks, input.arrival, input.departure)) {
    return noStoreJson(
      { error: "Ces dates ne sont plus disponibles.", code: "DATES_UNAVAILABLE" },
      { status: 409 },
    );
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
    return noStoreJson(
      { error: "La durée du séjour ne respecte pas les règles tarifaires." },
      { status: 422 },
    );
  }

  const totalCents = toCents(quote.total);
  const services = reservationServiceItems(quote.optionLines, quote.experienceLines);
  const {
    depositDueCents,
    balanceDueCents,
    balanceDueDate,
    depositPercentage,
    fullPaymentRequired,
  } = quote.paymentSchedule;

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
        touristTaxDetails: quote.touristTaxDetails,
        discountCents: toCents(quote.promotion?.discount ?? 0),
        totalCents,
        depositDueCents,
        balanceDueCents,
        balanceDueDate,
        depositPercentage,
        fullPaymentRequired,
        pricingVersion: "rates-json-2026-07",
        paymentMethod: input.paymentMethod,
        termsVersion: legalVersion,
        termsAcceptedAt: new Date().toISOString(),
        cancellationVersion: legalVersion,
        cancellationAcceptedAt: new Date().toISOString(),
        breakdown: quote.nightlyLines,
        services,
        specialRequests: input.specialRequests,
        calendarValidation: {
          checkedAt: calendar.generatedAt,
          sources: calendar.sources.map((source) => source.sourceId),
          reliable: true,
        },
      },
    });
    console.info(
      JSON.stringify({
        event: "reservation.persisted",
        reference: reservation.reference,
        propertySlug,
      }),
    );
    const emailInput = {
      reference: reservation.reference,
      propertySlug,
      arrival: input.arrival,
      departure: input.departure,
      total: quote.total,
      touristTax: quote.touristTax,
      touristTaxDetails: quote.touristTaxDetails,
      depositDue: depositDueCents / 100,
      balanceDue: balanceDueCents / 100,
      balanceDueDate,
      fullPaymentRequired,
      depositPercentage,
      fullPaymentThresholdDays: quote.paymentSchedule.fullPaymentThresholdDays,
      balanceDueDays: quote.paymentSchedule.balanceDueDays,
      paymentMethod: input.paymentMethod,
      guest: input.guest,
      options: quote.optionLines.map((line) => line.label),
      experiences: quote.experienceLines.map((line) => line.label),
      specialRequests: input.specialRequests,
    };
    const provider = new ConfigurableEmailProvider();
    const travelerEmail = travelerRequestEmail(emailInput);
    const ownerEmail = ownerRequestEmail(emailInput);
    const recipient = process.env.RESERVATION_RECIPIENT?.trim();
    const deliveries = [
      provider.send({
        to: input.guest.email,
        ...travelerEmail,
        idempotencyKey: `reservation-${reservation.id}-traveler`,
      }),
      ...(recipient
        ? [
            provider.send({
              to: recipient,
              ...ownerEmail,
              idempotencyKey: `reservation-${reservation.id}-owner`,
            }),
          ]
        : []),
    ];
    const results = await Promise.allSettled(deliveries);
    const rejected = results.filter((result) => result.status === "rejected").length;
    console.info(
      JSON.stringify({
        event: "reservation.email.completed",
        reference: reservation.reference,
        sent: results.length - rejected,
        failed: rejected,
      }),
    );
    return noStoreJson(
      {
        id: reservation.id,
        reference: reservation.reference,
        status: reservation.status,
        paymentEnabled: false,
        paymentMethod: input.paymentMethod,
        message:
          input.paymentMethod === "holiday_vouchers"
            ? "Demande enregistrée. Les modalités Chèques‑Vacances vous seront transmises après validation."
            : "Demande enregistrée. Les coordonnées de virement vous seront transmises après validation.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ReservationConflictError) {
      return noStoreJson(
        { error: "Ces dates viennent d’être réservées.", code: "DATES_UNAVAILABLE" },
        { status: 409 },
      );
    }
    console.error(
      JSON.stringify({
        event: "reservation.failed",
        reason: error instanceof Error ? error.message : "unknown",
      }),
    );
    return noStoreJson({ error: "La réservation n’a pas pu être enregistrée." }, { status: 503 });
  }
}
