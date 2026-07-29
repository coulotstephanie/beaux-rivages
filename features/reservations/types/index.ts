import type { QuoteRequest } from "@/platform/pricing/contracts";

export type AvailabilityBlock = {
  startsOn: string;
  endsOn: string;
  status: string;
};

export type AvailabilitySnapshot = {
  propertySlug: string;
  generatedAt: string;
  blocks: AvailabilityBlock[];
  sourcesHealthy: boolean;
};

export type ReservationSearchRequest = QuoteRequest;

export type ReservationSearchResult<TQuote = unknown> = {
  available: boolean;
  sourcesHealthy: boolean;
  quote: TQuote;
};
