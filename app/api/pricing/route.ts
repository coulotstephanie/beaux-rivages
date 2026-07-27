import { NextRequest } from "next/server";
import type { BookingExperienceId, StayOptionId } from "@/booking";
import { bookingExperiences, stayOptions } from "@/booking";
import { isPropertySlug } from "@/platform/calendar/config";
import { isIsoDate, noStoreJson, rateLimit } from "@/platform/http/security";
import { calculateQuote } from "@/platform/pricing/service";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return noStoreJson({ error: "Corps de requête invalide." }, { status: 400 });
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
    return noStoreJson({ error: "Composition du séjour invalide." }, { status: 400 });
  }
  const validOptionIds = new Set(stayOptions.map((option) => option.id));
  const validExperienceIds = new Set(bookingExperiences.map((experience) => experience.id));
  const options = Array.isArray(input.options) ? input.options.filter((id): id is StayOptionId => typeof id === "string" && validOptionIds.has(id as StayOptionId)) : [];
  const experiences = Array.isArray(input.experiences) ? input.experiences.filter((id): id is BookingExperienceId => typeof id === "string" && validExperienceIds.has(id as BookingExperienceId)) : [];
  return noStoreJson(await calculateQuote({ propertySlug, arrival: input.arrival, departure: input.departure, adults, children, babies, pets, options, experiences, promotionCode: typeof input.promotionCode === "string" ? input.promotionCode.slice(0, 40) : undefined }));
}
