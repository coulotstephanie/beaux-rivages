import { describe, expect, it, vi } from "vitest";

import { bookingExperiences, stayOptions } from "@/booking";
import rates from "@/content/rates.json";
import type { PropertySlug } from "@/platform/calendar/config";
import type { PropertyRatePlan } from "@/platform/pricing/contracts";
import { ratePlanRepository } from "@/platform/pricing/repository";
import { calculateQuote } from "@/platform/pricing/service";

const plans = rates.plans as PropertyRatePlan[];
const properties: PropertySlug[] = ["chai-des-tortues", "villa-raie-manta", "nid-d-ete"];

describe("devis P0 avec options et expériences", () => {
  it.each(properties)("calcule toutes les combinaisons critiques pour %s", async (propertySlug) => {
    const plan = plans.find((candidate) => candidate.propertySlug === propertySlug);
    expect(plan).toBeDefined();
    vi.spyOn(ratePlanRepository, "get").mockResolvedValue(structuredClone(plan!));

    const combinations = [
      { options: [], experiences: [] },
      { options: ["signature"], experiences: [] },
      { options: ["signature", "signature-aperitif"], experiences: [] },
      { options: ["signature", "signature-sweet"], experiences: [] },
      { options: ["aperitif-basket"], experiences: [] },
      { options: ["basket"], experiences: [] },
      {
        options: stayOptions.map((option) => option.id),
        experiences: bookingExperiences.map((experience) => experience.id),
      },
    ] as const;

    for (let travelers = 1; travelers <= 8; travelers += 1) {
      for (const combination of combinations) {
        const quote = await calculateQuote({
          propertySlug,
          arrival: "2027-06-07",
          departure: "2027-06-14",
          adults: travelers,
          children: 0,
          babies: 0,
          pets: (combination.options as readonly string[]).includes("pet") ? 1 : 0,
          options: [...combination.options],
          experiences: [...combination.experiences],
        });

        expect(Number.isFinite(quote.total)).toBe(true);
        expect(quote.total).toBeGreaterThan(0);
        expect(quote.optionsTotal).toBe(
          quote.optionLines.reduce((total, line) => total + line.total, 0),
        );
        expect(quote.experiencesTotal).toBe(
          quote.experienceLines.reduce((total, line) => total + line.total, 0),
        );
        expect(quote.total).toBe(
          quote.accommodation +
            quote.cleaningFee +
            quote.touristTax +
            quote.optionsTotal +
            quote.experiencesTotal,
        );
      }
    }
  });
});
