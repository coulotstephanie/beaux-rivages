import type { PropertySlug } from "./config";

// Temporary safety blocks for confirmed Booking.com stays absent from both imported feeds
// on 25 September 2026. Remove each block after the underlying calendar link is repaired
// and its entire reservation is visible in the live feeds. Departure is exclusive.
const blocks: Partial<Record<PropertySlug, { id: string; startsOn: string; endsOn: string }[]>> = {
  "chai-des-tortues": [
    { id: "booking-2027-06-24", startsOn: "2027-06-24", endsOn: "2027-06-27" },
  ],
  "villa-raie-manta": [
    { id: "booking-2026-09-27", startsOn: "2026-09-27", endsOn: "2026-09-28" },
    { id: "booking-2027-08-14", startsOn: "2027-08-14", endsOn: "2027-08-15" },
  ],
};

export function verifiedBookingBlocks(propertySlug: PropertySlug) {
  return (blocks[propertySlug] ?? []).map((block) => ({ ...block, source: "verified-booking" }));
}
