import assert from "node:assert/strict";
import test from "node:test";
import { calculateQuote, rateForDate } from "../platform/pricing/service";
import {
  NID_D_ETE_2027_RATE_PERIODS,
  nidDEte2027NightlyRate,
} from "../platform/pricing/nid-d-ete-2027";
import type { PropertyRatePlan } from "../platform/pricing/contracts";

const plan: PropertyRatePlan = {
  propertySlug: "nid-d-ete",
  currency: "EUR",
  baseNightlyRate: 999,
  weekendNightlyRate: 999,
  minimumNights: 2,
  maximumNights: 28,
  cleaningFee: 90,
  securityDeposit: 800,
  touristTax: { enabled: false, mode: "percentage", value: 0 },
  optionPrices: {},
  seasons: [
    {
      id: "overlapping-season",
      label: "Ancienne saison superposée",
      kind: "manual",
      startsOn: "2027-01-01",
      endsOn: "2028-01-01",
      nightlyRate: 445,
    },
  ],
  promotions: [],
  overrides: [{ date: "2027-08-01", nightlyRate: 445 }],
};

function datesIn2027() {
  const result: string[] = [];
  const cursor = new Date(Date.UTC(2027, 0, 1, 12));
  while (cursor.getUTCFullYear() === 2027) {
    result.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return result;
}

function accommodation(arrival: string, departure: string) {
  const cursor = new Date(`${arrival}T12:00:00Z`);
  const end = new Date(`${departure}T12:00:00Z`);
  let total = 0;
  while (cursor < end) {
    const date = cursor.toISOString().slice(0, 10);
    total += rateForDate(plan, date).rate;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return total;
}

test("each of the 365 dates in 2027 maps to exactly one Airbnb period and exact rate", () => {
  const dates = datesIn2027();
  assert.equal(dates.length, 365);
  for (const date of dates) {
    const matchingPeriods = NID_D_ETE_2027_RATE_PERIODS.filter(
      (period) => date >= period.startsOn && date < period.endsOn,
    );
    assert.equal(matchingPeriods.length, 1, `${date} must match exactly one period`);
    assert.equal(nidDEte2027NightlyRate(date), matchingPeriods[0].nightlyRate, date);
    assert.equal(rateForDate(plan, date).rate, matchingPeriods[0].nightlyRate, date);
  }
});

test("legacy imports, fallback seasons and old summer values never override the authoritative grid", () => {
  const legacyPlan: PropertyRatePlan = {
    ...plan,
    seasons: [
      ...plan.seasons,
      ...[285, 330, 375, 420, 445].map((nightlyRate, index) => ({
        id: `import-csv-v2-${nightlyRate}`,
        label: "Import CSV V2",
        kind: "manual" as const,
        startsOn: `2027-0${index + 4}-01`,
        endsOn: "2027-09-01",
        nightlyRate,
      })),
    ],
    promotions: [
      {
        id: "legacy-long-stay",
        label: "Ancienne promotion",
        kind: "long-stay",
        enabled: true,
        percentage: 8,
        minimumNights: 2,
      },
    ],
  };
  const checks = [
    ["2027-05-14", 210],
    ["2027-06-28", 208],
    ["2027-07-01", 208],
    ["2027-07-10", 220],
    ["2027-07-24", 235],
    ["2027-08-01", 250],
  ] as const;
  for (const [date, expected] of checks) {
    assert.equal(rateForDate(legacyPlan, date).rate, expected, date);
  }
});

test("all period boundaries are contiguous and use inclusive/exclusive dates", () => {
  assert.equal(NID_D_ETE_2027_RATE_PERIODS[0].startsOn, "2027-01-01");
  assert.equal(NID_D_ETE_2027_RATE_PERIODS.at(-1)?.endsOn, "2028-01-01");
  for (let index = 1; index < NID_D_ETE_2027_RATE_PERIODS.length; index += 1) {
    assert.equal(
      NID_D_ETE_2027_RATE_PERIODS[index - 1].endsOn,
      NID_D_ETE_2027_RATE_PERIODS[index].startsOn,
    );
  }
});

test("UTC and Europe/Paris calendar construction resolve every 2027 date identically", () => {
  for (const date of datesIn2027()) {
    const utcDate = new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10);
    const parisDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(`${date}T12:00:00Z`));
    assert.equal(parisDate, utcDate, date);
    assert.equal(nidDEte2027NightlyRate(parisDate), nidDEte2027NightlyRate(utcDate), date);
  }
});

test("required 2027 stay examples equal the sum of arrival-inclusive nights", () => {
  const examples = [
    ["2027-08-01", "2027-08-08", 1_750],
    ["2027-08-08", "2027-08-15", 1_750],
    ["2027-08-16", "2027-08-23", 1_540],
    ["2027-09-01", "2027-09-08", 1_246],
    ["2027-05-01", "2027-05-08", 1_240],
    ["2027-05-05", "2027-05-09", 800],
    ["2027-05-15", "2027-05-22", 1_150],
    ["2027-05-22", "2027-05-29", 1_040],
    ["2027-12-17", "2027-12-24", 1_449],
    ["2027-07-28", "2027-08-04", 1_705],
  ] as const;
  for (const [arrival, departure, expected] of examples) {
    assert.equal(accommodation(arrival, departure), expected, `${arrival} → ${departure}`);
  }
});

test("public quote keeps 90 euro cleaning separate and applies no accommodation promotion", async () => {
  const quote = await calculateQuote({
    propertySlug: "nid-d-ete",
    arrival: "2027-08-01",
    departure: "2027-08-08",
    adults: 2,
    children: 0,
    babies: 0,
    pets: 0,
    options: [],
    experiences: [],
  });
  assert.equal(quote.accommodationBeforeDiscount, 1_750);
  assert.equal(quote.promotion, null);
  assert.equal(quote.accommodation, 1_750);
  assert.equal(quote.cleaningFee, 90);
  assert.equal(quote.optionsTotal, 0);
  assert.equal(quote.optionLines.length, 0);
});

test("priority stays keep exact accommodation for two and six adults", async () => {
  const stays = [
    ["2027-01-01", "2027-01-03", 429],
    ["2027-03-08", "2027-03-10", 246],
    ["2027-05-05", "2027-05-09", 800],
    ["2027-05-14", "2027-05-17", 630],
    ["2027-06-04", "2027-06-07", 666],
    ["2027-07-05", "2027-07-12", 1_540],
    ["2027-07-19", "2027-07-26", 1_645],
    ["2027-08-01", "2027-08-08", 1_750],
  ] as const;
  for (const [arrival, departure, expected] of stays) {
    for (const adults of [2, 6]) {
      const quote = await calculateQuote({
        propertySlug: "nid-d-ete",
        arrival,
        departure,
        adults,
        children: 0,
        babies: 0,
        pets: 0,
        options: [],
        experiences: [],
      });
      assert.equal(quote.accommodation, expected, `${arrival}, ${adults} adultes`);
      assert.equal(quote.cleaningFee, 90);
      assert.equal(quote.promotion, null);
      assert.equal(quote.optionsTotal, 0);
      assert.equal(
        quote.total,
        quote.accommodation + quote.cleaningFee + quote.touristTax,
        `${arrival}: ménage et taxe comptés une seule fois`,
      );
    }
  }
});

test("pet and linen remain optional and use the validated units", async () => {
  const quote = await calculateQuote({
    propertySlug: "nid-d-ete",
    arrival: "2027-08-01",
    departure: "2027-08-08",
    adults: 2,
    children: 1,
    babies: 0,
    pets: 2,
    options: ["pet", "linen"],
    experiences: [],
  });
  assert.deepEqual(
    quote.optionLines.map(({ id, quantity, unitPrice, total }) => ({
      id,
      quantity,
      unitPrice,
      total,
    })),
    [
      { id: "pet", quantity: 2, unitPrice: 25, total: 50 },
      { id: "linen", quantity: 3, unitPrice: 20, total: 60 },
    ],
  );
  assert.equal(quote.optionsTotal, 110);
});
