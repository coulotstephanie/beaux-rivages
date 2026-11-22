import type { PropertySlug } from "./config";

// Safety blocks for confirmed Booking.com stays absent or shortened in imported feeds.
// Remove only after the full stay appears in a live feed or its cancellation is
// verified in the source reservation record. Departure is exclusive.
const blocks: Partial<Record<PropertySlug, { id: string; startsOn: string; endsOn: string }[]>> = {
  "chai-des-tortues": [
    // Confirmed in the live Booking extranet on 22 November 2026.
    // 5116519432: the feeds currently cover only the final night.
    { id: "booking-2026-12-07", startsOn: "2026-12-07", endsOn: "2026-12-10" },
    // 6176664610: the stay is absent from the live feeds.
    { id: "booking-2027-06-24", startsOn: "2027-06-24", endsOn: "2027-06-27" },
    // 6077996582: the feeds currently cover only the final night.
    { id: "booking-2027-09-12", startsOn: "2027-09-12", endsOn: "2027-09-25" },
  ],
  "villa-raie-manta": [
    { id: "booking-2026-09-27", startsOn: "2026-09-27", endsOn: "2026-09-28" },
    { id: "booking-2027-08-14", startsOn: "2027-08-14", endsOn: "2027-08-15" },
  ],
};

export function verifiedBookingBlocks(propertySlug: PropertySlug) {
  return (blocks[propertySlug] ?? []).map((block) => ({ ...block, source: "verified-booking" }));
}
