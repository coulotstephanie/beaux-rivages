import { getPropertyAvailability } from "@/platform/calendar/service";
import { calculateQuote } from "@/platform/pricing/service";
import type { AvailabilityRepository, ReservationPricingRepository } from "./contracts";

export class PlatformAvailabilityRepository implements AvailabilityRepository {
  async get(propertySlug: Parameters<AvailabilityRepository["get"]>[0], force = false) {
    const snapshot = await getPropertyAvailability(propertySlug, force);
    return {
      propertySlug,
      generatedAt: snapshot.generatedAt,
      blocks: snapshot.blocks,
      sourcesHealthy: snapshot.sources.every((source) => source.status === "success"),
    };
  }
}

export class PlatformReservationPricingRepository implements ReservationPricingRepository {
  quote(request: Parameters<ReservationPricingRepository["quote"]>[0]) {
    return calculateQuote(request);
  }
}
