import type { PropertySlug } from "./config";

// Temporary safety blocks for confirmed Booking.com stays absent from both imported feeds
// on 25 September 2026. Remove each block after the underlying calendar link is repaired
// and its entire reservation is visible in the live feeds, or cancellation is confirmed.
// The Chai stay of 24–27 June 2027 was cancelled and its safety block removed.
// Departure is exclusive.
const blocks: Partial<Record<PropertySlug, { id: string; startsOn: string; endsOn: string }[]>> = {
  "villa-raie-manta": [
    { id: "booking-2026-09-27", startsOn: "2026-09-27", endsOn: "2026-09-28" },
    { id: "booking-2027-08-14", startsOn: "2027-08-14", endsOn: "2027-08-15" },
  ],
};

export function verifiedBookingBlocks(propertySlug: PropertySlug) {
  return (blocks[propertySlug] ?? []).map((block) => ({ ...block, source: "verified-booking" }));
}
