import type { RevenueKpis } from "../types";

export function calculateRevenueKpis(input: {
  revenueCents: number;
  occupiedNights: number;
  availableNights: number;
  reservations: number;
}): RevenueKpis {
  const occupiedNights = Math.max(0, input.occupiedNights);
  const availableNights = Math.max(0, input.availableNights);
  const revenueCents = Math.max(0, input.revenueCents);
  return {
    ...input,
    revenueCents,
    occupiedNights,
    availableNights,
    adrCents: occupiedNights ? Math.round(revenueCents / occupiedNights) : 0,
    revParCents: availableNights ? Math.round(revenueCents / availableNights) : 0,
    occupancyRate: availableNights
      ? Math.round((occupiedNights / availableNights) * 10_000) / 100
      : 0,
  };
}
