import { describe, expect, it } from "vitest";
import { searchCarnetEntries } from "../services";
import type { CarnetEntry } from "../types";

const entry = (overrides: Partial<CarnetEntry>): CarnetEntry => ({
  id: crypto.randomUUID(),
  slug: "marche-rivedoux",
  category: "market",
  destination: "ile_de_re",
  title: "Marché de Rivedoux",
  summary: "Produits frais",
  body: "À découvrir le matin.",
  address: "Rivedoux-Plage",
  coordinates: null,
  officialUrl: "",
  googleMapsUrl: "",
  phone: "",
  imagePath: "",
  imageAlt: "",
  galleryPaths: [],
  videoUrl: "",
  openingHours: {},
  openingPeriod: "",
  recommendationLevel: 5,
  highlights: ["stephanie_favorite"],
  hostTip: "Venir tôt",
  tags: ["famille", "local"],
  featured: true,
  status: "published",
  version: 1,
  metaTitle: "",
  metaDescription: "",
  openGraphImagePath: "",
  ...overrides,
});

describe("unified Carnet search", () => {
  const entries = [
    entry({}),
    entry({
      slug: "plage",
      title: "Plage des Saumonards",
      category: "beach",
      destination: "ile_oleron",
      tags: ["coucher de soleil"],
      hostTip: "Observer Fort Boyard",
    }),
  ];

  it("searches accents, descriptions, tags and host recommendations", () => {
    expect(searchCarnetEntries(entries, { query: "marche" })).toHaveLength(1);
    expect(searchCarnetEntries(entries, { query: "coucher de soleil" })).toHaveLength(1);
    expect(searchCarnetEntries(entries, { query: "venir tot" })).toHaveLength(1);
  });

  it("combines category and destination filters", () => {
    expect(
      searchCarnetEntries(entries, { category: "beach", destination: "ile_oleron" }),
    ).toHaveLength(1);
    expect(
      searchCarnetEntries(entries, { category: "beach", destination: "ile_de_re" }),
    ).toHaveLength(0);
  });
});
