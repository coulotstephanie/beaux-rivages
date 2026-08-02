import { describe, expect, it, vi } from "vitest";
import type {
  AvailabilityRepository,
  ReservationPricingRepository,
  ReservationQuote,
} from "../repositories";
import { ReservationEngineService } from "../services/reservation-engine.service";
import type { ReservationSearchRequest } from "../types";

const request: ReservationSearchRequest = {
  propertySlug: "chai-des-tortues",
  arrival: "2026-10-12",
  departure: "2026-10-19",
  adults: 2,
  children: 0,
  babies: 0,
  pets: 0,
  options: [],
  experiences: [],
};

const quote = {
  nights: 7,
  stayRules: {
    valid: true,
    requiredMinimum: 2,
    maximumNights: 28,
    arrivalIsAllowed: true,
    optimizeCalendarGaps: true,
  },
} as ReservationQuote;

function createEngine(blocks: { startsOn: string; endsOn: string }[]) {
  const availabilityRepository: AvailabilityRepository = {
    get: vi.fn().mockResolvedValue({
      propertySlug: request.propertySlug,
      generatedAt: "2026-07-29T12:00:00.000Z",
      sourcesHealthy: true,
      blocks,
    }),
  };
  const pricingRepository: ReservationPricingRepository = {
    quote: vi.fn().mockResolvedValue(quote),
  };
  return {
    engine: new ReservationEngineService(availabilityRepository, pricingRepository),
    availabilityRepository,
    pricingRepository,
  };
}

describe("ReservationEngineService", () => {
  it("returns the seasonal quote when the requested range is free", async () => {
    const { engine, availabilityRepository, pricingRepository } = createEngine([
      { startsOn: "2026-10-20", endsOn: "2026-10-24" },
    ]);

    await expect(engine.search(request)).resolves.toMatchObject({
      available: true,
      sourcesHealthy: true,
      quote: { nights: 7 },
    });
    expect(availabilityRepository.get).toHaveBeenCalledWith("chai-des-tortues");
    expect(pricingRepository.quote).toHaveBeenCalledWith(request);
  });

  it("rejects a range crossing an unavailable period", async () => {
    const { engine } = createEngine([{ startsOn: "2026-10-14", endsOn: "2026-10-16" }]);

    await expect(engine.search(request)).resolves.toMatchObject({
      available: false,
    });
  });

  it("allows a new arrival on the previous departure date", async () => {
    const { engine } = createEngine([{ startsOn: "2026-10-05", endsOn: "2026-10-12" }]);

    await expect(engine.search(request)).resolves.toMatchObject({
      available: true,
    });
  });

  it("allows a shorter stay when it exactly fills a reliable calendar gap", async () => {
    const shortRequest = { ...request, departure: "2026-10-14" };
    const { engine } = createEngine([
      { startsOn: "2026-10-05", endsOn: "2026-10-12" },
      { startsOn: "2026-10-14", endsOn: "2026-10-18" },
    ]);

    await expect(engine.search(shortRequest)).resolves.toMatchObject({
      available: true,
      quote: { stayRules: { valid: true, requiredMinimum: 1, gapOptimized: true } },
    });
  });
});
