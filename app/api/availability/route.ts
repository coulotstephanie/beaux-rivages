import { NextRequest } from "next/server";
import { properties } from "@/data";
import { propertySlugs, isPropertySlug } from "@/platform/calendar/config";
import { getPropertyAvailability, isRangeAvailable } from "@/platform/calendar/service";
import { isIsoDate, noStoreJson, rateLimit } from "@/platform/http/security";

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
  if (requestedProperty && !isPropertySlug(requestedProperty)) return noStoreJson({ error: "Logement inconnu." }, { status: 400 });
  const slugs = requestedProperty && isPropertySlug(requestedProperty) ? [requestedProperty] : [...propertySlugs];
  const results = await Promise.all(slugs.map(async (slug) => {
    const property = properties.find((candidate) => candidate.slug === slug)!;
    const capacity = Number(property.capacity.match(/\d+/)?.[0] ?? 0);
    const calendar = await getPropertyAvailability(slug);
    const capacityFits = guests <= capacity;
    return {
      propertySlug: slug,
      property: property.title,
      available: capacityFits && isRangeAvailable(calendar.blocks, arrival, departure),
      capacityFits,
      sourcesHealthy: calendar.sources.every((source) => source.status === "success"),
    };
  }));
  return noStoreJson({ arrival, departure, guests, results });
}
