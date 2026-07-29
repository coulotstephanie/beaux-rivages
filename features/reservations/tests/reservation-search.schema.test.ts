import { describe, expect, it } from "vitest";
import { reservationSearchSchema } from "../schemas";

const validInput = {
  propertySlug: "nid-d-ete",
  arrival: "2026-09-12",
  departure: "2026-09-16",
  adults: 2,
  children: 1,
  babies: 0,
  pets: 0,
  options: [],
  experiences: [],
};

describe("reservationSearchSchema", () => {
  it("accepts a complete reservation search", () => {
    expect(reservationSearchSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects reversed dates", () => {
    const result = reservationSearchSchema.safeParse({
      ...validInput,
      departure: "2026-09-10",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an unknown property or experience", () => {
    expect(
      reservationSearchSchema.safeParse({
        ...validInput,
        propertySlug: "maison-inconnue",
      }).success,
    ).toBe(false);
    expect(
      reservationSearchSchema.safeParse({
        ...validInput,
        experiences: ["experience-inconnue"],
      }).success,
    ).toBe(false);
  });
});
