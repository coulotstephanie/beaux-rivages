export const reservationStatuses = [
  "draft",
  "pending_payment",
  "requested",
  "confirmed",
  "cancelled",
  "completed",
  "declined",
] as const;

export type ReservationStatus = (typeof reservationStatuses)[number];

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
  balanceDueDate: string | null;
  depositPercentage: number;
  fullPaymentRequired: boolean;
  touristTaxCents: number;
  touristTaxDetails: {
    liableGuests: number;
    exemptGuests: number;
    method: string;
    baseRate: number | null;
    additionalRate: number | null;
  };
  legalAcceptance: {
    termsVersion: string;
    termsAcceptedAt: string | null;
    cancellationVersion: string;
    cancellationAcceptedAt: string | null;
    paymentMethod: string;
  };
  options: { code: string; label: string; quantity: number; totalCents: number }[];
  experiences: { code: string; label: string; quantity: number; totalCents: number }[];
  specialRequests: {
    occasion: string | null;
    message: string | null;
    allergies: string | null;
    lateArrival: string | null;
  };
  timeline: {
    eventType: string;
    origin: string;
    occurredAt: string;
  }[];
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
    bookedRevenueCents: number;
    collectedRevenueCents: number;
    expectedDepositsCents: number;
    receivedDepositsCents: number;
    expectedBalancesCents: number;
    receivedBalancesCents: number;
    overduePaymentsCents: number;
    refundsCents: number;
    creditNotesCents: number;
    averageStayNights: number;
    directShare: number;
  };
  finance: {
    methods: { method: string; label: string; enabled: boolean }[];
    payments: {
      id: string;
      reservationId: string;
      reservationReference: string;
      guestName: string;
      kind: string;
      method: string;
      status: string;
      amountCents: number;
      refundedCents: number;
      receivedAt: string | null;
      bankReference: string;
      ibanLabel: string;
      comment: string;
      evidencePath: string;
    }[];
    reminders: {
      id: string;
      reservationReference: string;
      kind: string;
      channel: string;
      status: string;
      createdAt: string;
    }[];
  };
  operational: {
    arrivals: BackOfficeReservation[];
    departures: BackOfficeReservation[];
    inHouse: BackOfficeReservation[];
    requests: BackOfficeReservation[];
    pendingPayments: BackOfficeReservation[];
    unsignedContracts: BackOfficeReservation[];
    upcoming7Days: BackOfficeReservation[];
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
    contracts: {
      id: string;
      number: string;
      status: string;
      reservationReference: string;
      updatedAt: string;
    }[];
    invoices: {
      id: string;
      number: string;
      status: string;
      reservationReference: string;
      totalCents: number;
      updatedAt: string;
    }[];
  };
  operations: {
    housekeeping: {
      id: string;
      propertyId: string;
      propertyName: string;
      reservationReference: string | null;
      scheduledFor: string;
      assignee: string;
      status: string;
      checklist: { id: string; label: string; done: boolean }[];
      notes: string;
    }[];
    maintenance: {
      id: string;
      propertyId: string;
      propertyName: string;
      reservationReference: string | null;
      title: string;
      description: string;
      priority: string;
      status: string;
      assignee: string;
      costCents: number;
      dueAt: string | null;
      createdAt: string;
    }[];
    concierge: {
      id: string;
      reservationId: string;
      reservationReference: string;
      guestName: string;
      kind: string;
      title: string;
      details: string;
      status: string;
      scheduledFor: string | null;
      isSurprise: boolean;
    }[];
    conciergeOrders: {
      id: string;
      reservationReference: string;
      guestName: string;
      status: string;
      locale: string;
      totalCents: number;
      itemCount: number;
      createdAt: string;
    }[];
    specialRequests: {
      id: string;
      reservationReference: string;
      guestName: string;
      occasion: string;
      details: string;
      allergies: string;
      dietaryRequirements: string;
      status: string;
      createdAt: string;
    }[];
    deposits: {
      id: string;
      reservationReference: string;
      guestName: string;
      amountCents: number;
      status: string;
      provider: string;
      updatedAt: string;
    }[];
    notifications: {
      id: string;
      kind: string;
      title: string;
      body: string;
      priority: string;
      entityType: string | null;
      entityId: string | null;
      readAt: string | null;
      createdAt: string;
    }[];
    notes: {
      id: string;
      reservationId: string;
      category: string;
      content: string;
      pinned: boolean;
      createdAt: string;
    }[];
  };
  pilotage: {
    calendarSources: {
      id: string;
      property: string;
      provider: string;
      status: string;
      lastSyncedAt: string | null;
    }[];
    recentSyncs: {
      id: string;
      provider: string;
      property: string;
      status: string;
      importedCount: number;
      errorCount: number;
      startedAt: string;
    }[];
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
