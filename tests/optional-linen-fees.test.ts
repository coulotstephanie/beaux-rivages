import assert from "node:assert/strict";
import test from "node:test";
import { calculateQuote } from "../platform/pricing/service";

for (const [propertySlug, cleaningFee] of [
  ["chai-des-tortues", 120],
  ["villa-raie-manta", 135],
  ["nid-d-ete", 85],
] as const) {
  test(`${propertySlug}: linen stays optional and costs 15 per guest per stay`, async () => {
    const input = {
      propertySlug,
      arrival: "2027-11-15",
      departure: "2027-11-19",
      adults: 2,
      children: 2,
      babies: 1,
      pets: 0,
      experiences: [],
    };
    const without = await calculateQuote({ ...input, options: [] });
    const withLinen = await calculateQuote({ ...input, options: ["linen"] });
    assert.equal(without.cleaningFee, cleaningFee);
    assert.equal(
      without.optionLines.some((line) => line.id === "linen"),
      false,
    );
    assert.equal(withLinen.optionLines.find((line) => line.id === "linen")?.unitPrice, 15);
    assert.equal(withLinen.optionLines.find((line) => line.id === "linen")?.quantity, 4);
    assert.equal(withLinen.total - without.total, 60);
  });
}
