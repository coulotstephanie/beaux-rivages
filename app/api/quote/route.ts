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

  const result = await reservationEngine.search(parsed.data);
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
    return noStoreJson(
      {
        ...result,
        error: `La durée doit être comprise entre ${result.quote.stayRules.requiredMinimum} et ${result.quote.stayRules.maximumNights} nuits.`,
      },
      { status: 422 },
    );
  }
  return noStoreJson(result);
}
