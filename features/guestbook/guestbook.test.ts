import { describe, expect, it } from "vitest";
import { calculateGuestBookStats } from "./stats";
import { guestBookEntrySchema } from "./schema";
import { initialGuestBookEntries } from "./seed";

describe("Livre d’Or", () => {
  it("valide les dates précises et mensuelles sans inventer de jour", () => {
    expect(
      guestBookEntrySchema.safeParse({ ...initialGuestBookEntries[0], date: "2026-03" }).success,
    ).toBe(true);
    expect(
      guestBookEntrySchema.safeParse({ ...initialGuestBookEntries[0], date: "2026-03-20" }).success,
    ).toBe(true);
    expect(
      guestBookEntrySchema.safeParse({ ...initialGuestBookEntries[0], date: "mars 2026" }).success,
    ).toBe(false);
  });

  it("calcule les langues, thèmes et mots sans exposer de donnée privée", () => {
    const stats = calculateGuestBookStats(initialGuestBookEntries);
    expect(stats.total).toBe(8);
    expect(stats.languages).toEqual(
      expect.arrayContaining([
        { value: "fr", count: 7 },
        { value: "en", count: 1 },
      ]),
    );
    expect(stats.themes[0]).toEqual({ value: "Retour", count: 4 });
  });

  it("ne publie que des transcriptions validées dans les données initiales", () => {
    expect(initialGuestBookEntries.every((entry) => entry.status === "published")).toBe(true);
    expect(initialGuestBookEntries.filter((entry) => entry.featured)).toHaveLength(5);
  });
});
