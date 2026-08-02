import { NextRequest } from "next/server";
import { reservationSearchSchema } from "@/features/reservations/schemas";
import { reservationEngine } from "@/features/reservations/services";
import { noStoreJson, rateLimit } from "@/platform/http/security";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 25);
  if (limited) return limited;
  const body: unknown = await request.json().catch(() => null);
  const parsed = reservationSearchSchema.safeParse(body);
  if (!parsed.success) {
    return noStoreJson(
      {
        error: "Demande de séjour invalide.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  let result: Awaited<ReturnType<typeof reservationEngine.search>>;
  try {
    result = await reservationEngine.search(parsed.data);
  } catch (error) {
    const cause = error instanceof Error ? error.message : "UNKNOWN_QUOTE_ERROR";
    console.error("BOOKING_QUOTE_CALCULATION_FAILED", {
      reservation: request.headers.get("x-reservation-reference") ?? "quote-preview",
      travelers: {
        adults: parsed.data.adults,
        children: parsed.data.children,
        babies: parsed.data.babies,
        pets: parsed.data.pets,
      },
      property: parsed.data.propertySlug,
      options: parsed.data.options,
      experiences: parsed.data.experiences,
      calculationStep: cause.startsWith("PRICING_") ? "pricing-plan-loading" : "quote-calculation",
      responsibleVariable: cause.split(":")[0],
      cause,
    });
    return noStoreJson(
      {
        error:
          "Le devis n’a pas pu être calculé. Aucun montant n’a été enregistré. Veuillez réessayer dans quelques instants.",
        code: "QUOTE_CALCULATION_FAILED",
      },
      { status: 500 },
    );
  }
  if (!result.sourcesHealthy) {
    return noStoreJson(
      {
        ...result,
        available: false,
        error:
          "La disponibilité ne peut pas être vérifiée pour le moment. La réservation directe est temporairement suspendue.",
        code: "CALENDAR_UNAVAILABLE",
      },
      { status: 503 },
    );
  }
  if (!result.available) {
    return noStoreJson({ ...result, error: "Ces dates ne sont pas disponibles." }, { status: 409 });
  }
  if (!result.quote.stayRules.valid) {
    const rules = result.quote.stayRules;
    const error = !rules.arrivalIsAllowed
      ? "Cette date d’arrivée n’est pas proposée pour la période sélectionnée. Choisissez une autre date ou contactez-nous."
      : `Pour ces dates, la durée minimale est de ${rules.requiredMinimum} nuit${rules.requiredMinimum > 1 ? "s" : ""} et la durée maximale de ${rules.maximumNights} nuits.`;
    return noStoreJson(
      {
        ...result,
        error,
      },
      { status: 422 },
    );
  }
  return noStoreJson(result);
}
