import { describe, expect, it } from "vitest";
import { carnetEntrySchema } from "../schemas";

const valid = {
  slug: "marche-rivedoux",
  category: "market",
  destination: "ile_de_re",
  title: "Marché de Rivedoux",
  summary: "Les producteurs du village.",
};

describe("Carnet CMS validation", () => {
  it("accepts a minimal draft", () => {
    expect(carnetEntrySchema.safeParse(valid).success).toBe(true);
  });

  it("requires a complete GPS pair", () => {
    expect(carnetEntrySchema.safeParse({ ...valid, latitude: 46.15 }).success).toBe(false);
  });

  it("validates editorial highlight values", () => {
    expect(carnetEntrySchema.safeParse({ ...valid, highlights: ["unknown"] }).success).toBe(false);
  });
});
