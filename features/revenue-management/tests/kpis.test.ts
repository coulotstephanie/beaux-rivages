import { describe, expect, it } from "vitest";

import { calculateRevenueKpis } from "../services";

describe("calculateRevenueKpis", () => {
  it("calcule ADR, RevPAR et occupation", () => {
    expect(
      calculateRevenueKpis({
        revenueCents: 120_000,
        occupiedNights: 10,
        availableNights: 20,
        reservations: 3,
      }),
    ).toMatchObject({
      adrCents: 12_000,
      revParCents: 6_000,
      occupancyRate: 50,
    });
  });

  it("retourne des ratios nuls lorsque la période est vide", () => {
    expect(
      calculateRevenueKpis({
        revenueCents: 0,
        occupiedNights: 0,
        availableNights: 0,
        reservations: 0,
      }),
    ).toMatchObject({
      adrCents: 0,
      revParCents: 0,
      occupancyRate: 0,
    });
  });
});
