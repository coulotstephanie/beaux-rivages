import type { GuestMessageData, PropertyId } from "./contracts";

export function demoGuestMessageData(propertyId: PropertyId): GuestMessageData {
  return {
    reservationId: `preview-${propertyId}`,
    propertyId,
    guestFirstName: "Camille",
    guestLastName: "Martin",
    arrivalDate: "2026-08-15",
    departureDate: "2026-08-22",
    adults: 2,
    children: 1,
    childrenAges: [7],
    babies: 1,
    pets: propertyId === "nid-d-ete" ? 1 : 0,
    bookingSource: "direct",
    experienceLevel: "signature",
    selectedOptions: {
      linenPackage: true,
      linenGuestsCount: 4,
      beachTowels: true,
      personalizedArrival: true,
      aperitifBasket: true,
      romancePack: true,
    },
    estimatedArrivalTime: "17:30",
    locale: "fr",
  };
}
