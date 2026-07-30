import { describe, expect, it } from "vitest";

import { rateOverrideSchema } from "../schemas";

const validOverride = {
  propertySlug: "nid-d-ete",
  name: "Festival local",
  kind: "event",
  start: "2026-08-01",
  end: "2026-08-03",
  nightlyRate: 210,
  minimumNights: 2,
} as const;

describe("rateOverrideSchema", () => {
  it("accepte une période tarifaire complète", () => {
    expect(rateOverrideSchema.safeParse(validOverride).success).toBe(true);
  });

  it("refuse une période inversée", () => {
    expect(
      rateOverrideSchema.safeParse({
        ...validOverride,
        start: "2026-08-04",
      }).success,
    ).toBe(false);
  });

  it("refuse un prix négatif", () => {
    expect(
      rateOverrideSchema.safeParse({
        ...validOverride,
        nightlyRate: -1,
      }).success,
    ).toBe(false);
  });
});
