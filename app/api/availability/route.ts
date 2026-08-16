import { NextRequest } from "next/server";
import { properties } from "@/data";
import { propertySlugs, isPropertySlug } from "@/platform/calendar/config";
import { getPropertyAvailability, isRangeAvailable } from "@/platform/calendar/service";
import { isIsoDate, noStoreJson, rateLimit } from "@/platform/http/security";
import { isStayInsidePublicBookingWindow } from "@/platform/reservations/booking-window";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request);
  if (limited) return limited;
  const params = request.nextUrl.searchParams;
  const arrival = params.get("arrival");
  const departure = params.get("departure");
  const requestedProperty = params.get("property");
  const guests = Math.max(1, Number(params.get("guests") ?? 1));
  if (!isIsoDate(arrival) || !isIsoDate(departure) || departure <= arrival || guests > 8) {
    return noStoreJson({ error: "Dates ou nombre de voyageurs invalides." }, { status: 400 });
  }
  if (!isStayInsidePublicBookingWindow(arrival, departure)) {
    return noStoreJson(
      {
        error: "Les réservations sont ouvertes sur les 12 prochains mois uniquement.",
        code: "OUTSIDE_BOOKING_WINDOW",
      },
      { status: 422 },
    );
  }
  if (requestedProperty && !isPropertySlug(requestedProperty))
    return noStoreJson({ error: "Logement inconnu." }, { status: 400 });
  const slugs =
    requestedProperty && isPropertySlug(requestedProperty)
      ? [requestedProperty]
      : [...propertySlugs];
  const results = await Promise.all(
    slugs.map(async (slug) => {
      const property = properties.find((candidate) => candidate.slug === slug)!;
      const capacity = Number(property.capacity.match(/\d+/)?.[0] ?? 0);
      const calendar = await getPropertyAvailability(slug);
      const capacityFits = guests <= capacity;
      return {
        propertySlug: slug,
        property: property.title,
        available:
          calendar.reliable &&
          capacityFits &&
          isRangeAvailable(calendar.blocks, arrival, departure),
        capacityFits,
        sourcesHealthy: calendar.reliable,
        usingLastKnownState: calendar.usingLastKnownState,
      };
    }),
  );
  return noStoreJson({ arrival, departure, guests, results });
}
