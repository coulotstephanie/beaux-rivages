import type { PropertySlug } from "@/platform/calendar/config";
import type { QuoteRequest } from "@/platform/pricing/contracts";
import type { calculateQuote } from "@/platform/pricing/service";
import type { AvailabilitySnapshot } from "../types";

export type ReservationQuote = Awaited<ReturnType<typeof calculateQuote>>;

export interface AvailabilityRepository {
  get(propertySlug: PropertySlug, force?: boolean): Promise<AvailabilitySnapshot>;
}

export interface ReservationPricingRepository {
  quote(request: QuoteRequest): Promise<ReservationQuote>;
}
