import { describe, expect, it } from "vitest";

import { rateOverrideBatchSchema, rateOverrideSchema } from "../schemas";

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

describe("rateOverrideBatchSchema", () => {
  it("accepte plusieurs dates non consécutives avec des prix distincts", () => {
    expect(
      rateOverrideBatchSchema.safeParse({
        propertySlug: "nid-d-ete",
        name: "Samedis de juillet",
        kind: "weekend",
        entries: [
          { date: "2026-07-04", nightlyRate: 260 },
          { date: "2026-07-11", nightlyRate: 275 },
        ],
      }).success,
    ).toBe(true);
  });

  it("identifie explicitement un lot provenant d'un import CSV", () => {
    expect(
      rateOverrideBatchSchema.safeParse({
        propertySlug: "villa-raie-manta",
        name: "Import CSV",
        kind: "manual",
        importMode: "csv",
        entries: [{ date: "2026-11-09", nightlyRate: 190, minimumNights: 2 }],
      }).success,
    ).toBe(true);
  });

  it("refuse une sélection vide ou supérieure à une année", () => {
    const base = { propertySlug: "nid-d-ete", name: "Sélection", kind: "manual" } as const;
    expect(rateOverrideBatchSchema.safeParse({ ...base, entries: [] }).success).toBe(false);
    expect(
      rateOverrideBatchSchema.safeParse({
        ...base,
        entries: Array.from({ length: 367 }, (_, day) => ({
          date: `2026-01-${String((day % 28) + 1).padStart(2, "0")}`,
          nightlyRate: 200,
        })),
      }).success,
    ).toBe(false);
  });
});
