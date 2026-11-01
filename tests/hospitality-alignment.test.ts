import assert from "node:assert/strict";
import test from "node:test";
import { calculateQuote, rateForDate } from "../platform/pricing/service";
import { ratePlanRepository } from "../platform/pricing/repository";
import type { PropertySlug } from "../platform/calendar/config";

for (const [propertySlug, fee, julyRate] of [
  ["nid-d-ete", 85, 220],
  ["chai-des-tortues", 125, 387],
  ["villa-raie-manta", 135, 350],
] as const) {
  test(`${propertySlug}: current fees, optional linen and summer minimum reach the quote`, async () => {
    const input = {
      propertySlug: propertySlug as PropertySlug,
      arrival: "2027-07-10",
      departure: "2027-07-17",
      adults: 2,
      children: 1,
      babies: 1,
      pets: 0,
      options: [] as "linen"[],
      experiences: [],
    };
    const plan = await ratePlanRepository.get(propertySlug);
    assert.equal(rateForDate(plan, input.arrival).rate, julyRate);
    const base = await calculateQuote(input);
    assert.equal(base.cleaningFee, fee);
    assert.equal(base.stayRules.valid, true);
    assert.equal(
      base.optionLines.some((line) => line.id === "linen"),
      false,
    );
    const linen = await calculateQuote({ ...input, options: ["linen"] });
    assert.equal(linen.optionLines.find((line) => line.id === "linen")?.total, 45);
    assert.equal(linen.total - base.total, 45);
    const short = await calculateQuote({ ...input, departure: "2027-07-16" });
    assert.equal(short.stayRules.valid, false);
  });
}
