export const reservationStatuses = [
  "draft",
  "pending_payment",
  "requested",
  "confirmed",
  "cancelled",
  "completed",
  "declined",
] as const;

export type ReservationStatus = typeof reservationStatuses[number];

export type BackOfficeReservation = {
  id: string;
  reference: string;
  propertyId: string;
  propertyName: string;
  propertySlug: string;
  status: ReservationStatus;
  channel: string;
  arrival: string;
  departure: string;
  adults: number;
  children: number;
  babies: number;
  pets: number;
  totalCents: number;
  depositDueCents: number;
  balanceDueCents: number;
  guestId: string | null;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  createdAt: string;
};

export type BackOfficeSnapshot = {
  generatedAt: string;
  today: string;
  metrics: {
    revenueTodayCents: number;
    revenueMonthCents: number;
    revenueYearCents: number;
    pendingPaymentsCents: number;
    averageStayNights: number;
    directShare: number;
  };
  operational: {
    arrivals: BackOfficeReservation[];
    departures: BackOfficeReservation[];
    inHouse: BackOfficeReservation[];
    requests: BackOfficeReservation[];
    pendingPayments: BackOfficeReservation[];
    unsignedContracts: BackOfficeReservation[];
  };
  reservations: BackOfficeReservation[];
  guests: {
    id: string;
    name: string;
    email: string;
    phone: string;
    stays: number;
    nights: number;
    pets: number;
    lastStay: string | null;
  }[];
  properties: {
    id: string;
    slug: string;
    name: string;
    status: string;
    occupancyRate: number;
    occupiedNights: number;
    directNights: number;
    platformNights: number;
    revenueCents: number;
  }[];
  documents: {
    contracts: { id: string; number: string; status: string; reservationReference: string; updatedAt: string }[];
    invoices: { id: string; number: string; status: string; reservationReference: string; totalCents: number; updatedAt: string }[];
  };
  pilotage: {
    calendarSources: { id: string; property: string; provider: string; status: string; lastSyncedAt: string | null }[];
    recentSyncs: { id: string; provider: string; property: string; status: string; importedCount: number; errorCount: number; startedAt: string }[];
    emailStatus: Record<string, number>;
    paymentStatus: Record<string, number>;
    recentPayments: {
      id: string;
      reservationReference: string;
      guestName: string;
      kind: string;
      status: string;
      amountCents: number;
      refundedCents: number;
      createdAt: string;
      refundable: boolean;
    }[];
    recentErrors: { id: string; area: string; message: string; occurredAt: string }[];
  };
};
