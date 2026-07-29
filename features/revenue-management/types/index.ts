export type RateOverrideKind = "manual" | "weekend" | "school_holiday" | "public_holiday" | "event";

export type RevenueKpis = {
  revenueCents: number;
  availableNights: number;
  occupiedNights: number;
  reservations: number;
  adrCents: number;
  revParCents: number;
  occupancyRate: number;
};
