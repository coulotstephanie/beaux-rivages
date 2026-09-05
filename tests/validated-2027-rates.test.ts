import assert from "node:assert/strict";
import test from "node:test";
import { validated2027NightlyRate } from "../platform/pricing/validated-2027-rates";

const expected = {
  "chai-des-tortues": [
    ["2027-09-01", 180],
    ["2027-10-01", 150],
    ["2027-10-16", 180],
    ["2027-11-01", 140],
    ["2027-11-10", 180],
    ["2027-11-14", 130],
    ["2027-12-18", 180],
    ["2027-12-24", 220],
    ["2027-12-31", 250],
  ],
  "villa-raie-manta": [
    ["2027-09-01", 200],
    ["2027-10-01", 180],
    ["2027-10-16", 220],
    ["2027-11-01", 170],
    ["2027-11-10", 220],
    ["2027-11-14", 160],
    ["2027-12-18", 250],
    ["2027-12-24", 300],
    ["2027-12-31", 350],
  ],
} as const;

test("validated autumn and winter rates match every channel boundary", () => {
  for (const [propertySlug, checks] of Object.entries(expected)) {
    for (const [date, nightlyRate] of checks) {
      assert.equal(
        validated2027NightlyRate(
          propertySlug as "chai-des-tortues" | "villa-raie-manta",
          date,
        ),
        nightlyRate,
        `${propertySlug} ${date}`,
      );
    }
  }
});

test("validated rates cover every night from September through December", () => {
  for (const propertySlug of ["chai-des-tortues", "villa-raie-manta"] as const) {
    const cursor = new Date("2027-09-01T12:00:00Z");
    const end = new Date("2028-01-01T12:00:00Z");
    while (cursor < end) {
      const date = cursor.toISOString().slice(0, 10);
      assert.notEqual(validated2027NightlyRate(propertySlug, date), undefined, date);
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  }
});
