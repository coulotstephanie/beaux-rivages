import type { PropertySlug } from "./config";

// Safety blocks for confirmed Booking.com stays absent from imported feeds.
// Remove only after the full stay appears in a live feed or its cancellation is
// verified in the source reservation record. Departure is exclusive.
const blocks: Partial<Record<PropertySlug, { id: string; startsOn: string; endsOn: string }[]>> = {
  "chai-des-tortues": [
    // Booking 6176664610: confirmed in the live extranet on 22 November 2026.
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
