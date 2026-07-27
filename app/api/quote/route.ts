import { NextRequest } from "next/server";
import type { BookingExperienceId, StayOptionId } from "@/booking";
import { bookingExperiences, stayOptions } from "@/booking";
import { isPropertySlug } from "@/platform/calendar/config";
import { getPropertyAvailability, isRangeAvailable } from "@/platform/calendar/service";
import { isIsoDate, noStoreJson, rateLimit } from "@/platform/http/security";
import { calculateQuote } from "@/platform/pricing/service";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 25);
  if (limited) return limited;
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return noStoreJson({ error: "Demande invalide." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const propertySlug = String(input.propertySlug);
  if (!isPropertySlug(propertySlug) || !isIsoDate(input.arrival) || !isIsoDate(input.departure) || input.departure <= input.arrival) {
    return noStoreJson({ error: "Logement ou dates invalides." }, { status: 400 });
  }
  const adults = Number(input.adults ?? 0);
  const children = Number(input.children ?? 0);
  const babies = Number(input.babies ?? 0);
  const pets = Number(input.pets ?? 0);
  if (![adults, children, babies, pets].every(Number.isInteger) || adults < 1 || adults + children > 8 || babies < 0 || pets < 0) {
    return noStoreJson({ error: "Voyageurs invalides." }, { status: 400 });
  }
  const options = Array.isArray(input.options) ? input.options.filter((id): id is StayOptionId => stayOptions.some((option) => option.id === id)) : [];
  const experiences = Array.isArray(input.experiences) ? input.experiences.filter((id): id is BookingExperienceId => bookingExperiences.some((experience) => experience.id === id)) : [];
  const availability = await getPropertyAvailability(propertySlug);
  const available = isRangeAvailable(availability.blocks, input.arrival, input.departure);
  const quote = await calculateQuote({
    propertySlug,
    arrival: input.arrival,
    departure: input.departure,
    adults,
    children,
    babies,
    pets,
    options,
    experiences,
    promotionCode: typeof input.promotionCode === "string" ? input.promotionCode.slice(0, 40) : undefined,
  });
  if (!available) return noStoreJson({ available, sourcesHealthy: availability.sources.every((source) => source.status === "success"), quote, error: "Ces dates ne sont pas disponibles." }, { status: 409 });
  if (!quote.stayRules.valid) return noStoreJson({ available, sourcesHealthy: availability.sources.every((source) => source.status === "success"), quote, error: `La durée doit être comprise entre ${quote.stayRules.requiredMinimum} et ${quote.stayRules.maximumNights} nuits.` }, { status: 422 });
  return noStoreJson({ available, sourcesHealthy: availability.sources.every((source) => source.status === "success"), quote });
}
