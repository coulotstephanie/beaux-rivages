export type PropertyId = "chai-des-tortues" | "villa-raie-manta" | "nid-d-ete";
export type MessageType = "booking_confirmation" | "arrival" | "departure";

export type GuestMessageData = {
  reservationId: string;
  propertyId: PropertyId;
  guestFirstName: string;
  guestLastName?: string;
  arrivalDate: string;
  departureDate: string;
  adults: number;
  children: number;
  childrenAges?: number[];
  babies: number;
  pets: number;
  bookingSource: "direct" | "airbnb" | "booking" | "abritel" | "other";
  experienceLevel: "essentiel" | "confort" | "signature";
  selectedOptions: {
    linenPackage?: boolean;
    linenGuestsCount?: number;
    beachTowels?: boolean;
    bathrobes?: boolean;
    slippers?: boolean;
    earlyCheckIn?: boolean;
    lateCheckOut?: boolean;
    personalizedArrival?: boolean;
    aperitifBasket?: boolean;
    sweetBasket?: boolean;
    romancePack?: boolean;
    signatureRomancePack?: boolean;
    petOption?: boolean;
    customWelcomeMessage?: string;
  };
  estimatedArrivalTime?: string;
  locale: "fr" | "en" | "de";
};

/** Server-only values. Never return this object from a public endpoint or persist it in message payloads. */
export type ArrivalSecrets = {
  keyBoxCode: string;
  wifiName: string;
  wifiPassword: string;
  pedestrianGateCode?: string;
};

export type GuestMessage = {
  type: MessageType;
  subject: string;
  preheader: string;
  html: string;
  text: string;
  idempotencyKey: string;
};

export type MessageScheduleInput = {
  data: GuestMessageData;
  type: MessageType;
  scheduledDate: string;
  reservationStatus: "draft" | "pending_payment" | "requested" | "confirmed" | "cancelled" | "completed" | "declined";
  paymentValidated: boolean;
  accessSecretsAvailable: boolean;
};
