import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import type { PropertyRatePlan } from "../platform/pricing/contracts";
import {
  CHAI_DES_TORTUES_AUTHORITATIVE_RATE_PERIODS,
  chaiDesTortuesAuthoritativeNightlyRate,
} from "../platform/pricing/chai-des-tortues-authoritative";
import { calculateQuote, rateForDate } from "../platform/pricing/service";
import {
  isStayInsidePublicBookingWindow,
  publicBookingWindow,
} from "../platform/reservations/booking-window";

const stalePlan: PropertyRatePlan = {
  propertySlug: "chai-des-tortues",
  currency: "EUR",
  baseNightlyRate: 800,
  weekendNightlyRate: 800,
  minimumNights: 2,
  maximumNights: 28,
  cleaningFee: 95,
  securityDeposit: 0,
  touristTax: { enabled: false, mode: "percentage", value: 0 },
  optionPrices: { pet: 25, linen: 20 },
  seasons: [
    {
      id: "import-csv-v2",
      label: "Import CSV V2",
      kind: "manual",
      startsOn: "2027-01-01",
      endsOn: "2028-01-01",
      nightlyRate: 480,
      minimumNights: 7,
    },
  ],
  overrides: [{ date: "2027-08-01", nightlyRate: 700, minimumNights: 7 }],
  promotions: [
    {
      id: "legacy-long-stay",
      label: "Ancienne promotion",
      enabled: true,
      kind: "long-stay",
      percentage: 8,
      minimumNights: 7,
    },
  ],
};

function datesInYear(year: number) {
  const dates: string[] = [];
  const cursor = new Date(Date.UTC(year, 0, 1, 12));
  while (cursor.getUTCFullYear() === year) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

test("les 365 dates de 2027 correspondent chacune à un unique tarif Chai", () => {
  const dates = datesInYear(2027);
  assert.equal(dates.length, 365);
  for (const date of dates) {
    const matches = CHAI_DES_TORTUES_AUTHORITATIVE_RATE_PERIODS.filter(
      (period) => date >= period.startsOn && date < period.endsOn,
    );
    assert.equal(matches.length, 1, `${date}: période unique attendue`);
    assert.equal(chaiDesTortuesAuthoritativeNightlyRate(date), matches[0].nightlyRate, date);
    assert.equal(rateForDate(stalePlan, date).rate, matches[0].nightlyRate, date);
  }
});

test("les périodes 2027 sont contiguës avec des bornes inclusives/exclusives", () => {
  assert.equal(CHAI_DES_TORTUES_AUTHORITATIVE_RATE_PERIODS[0].startsOn, "2027-01-01");
  assert.equal(CHAI_DES_TORTUES_AUTHORITATIVE_RATE_PERIODS.at(-1)?.endsOn, "2028-01-01");
  for (let index = 1; index < CHAI_DES_TORTUES_AUTHORITATIVE_RATE_PERIODS.length; index += 1)
    assert.equal(
      CHAI_DES_TORTUES_AUTHORITATIVE_RATE_PERIODS[index - 1].endsOn,
      CHAI_DES_TORTUES_AUTHORITATIVE_RATE_PERIODS[index].startsOn,
    );
});

test("les transitions prioritaires Airbnb sont exactes", () => {
  const checks = [
    ["2027-01-01", 247],
    ["2027-03-26", 237],
    ["2027-05-05", 342],
    ["2027-05-14", 299],
    ["2027-06-28", 272],
    ["2027-07-10", 387],
    ["2027-07-24", 442],
    ["2027-08-01", 467],
    ["2027-08-14", 414],
    ["2027-08-22", 355],
    ["2027-11-19", 325],
    ["2027-12-17", 325],
  ] as const;
  for (const [date, expected] of checks)
    assert.equal(chaiDesTortuesAuthoritativeNightlyRate(date), expected, date);
});

test("Import CSV V2, saisons, overrides et promotions ne remplacent jamais la grille Chai", () => {
  for (const date of datesInYear(2027)) {
    const result = rateForDate(stalePlan, date);
    assert.notEqual(result.rate, 480, `${date}: ancien tarif Import CSV V2`);
    assert.notEqual(result.season, "Import CSV V2", date);
  }
});

test("UTC et Europe/Paris résolvent chaque date 2027 de façon identique", () => {
  for (const date of datesInYear(2027)) {
    const paris = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(`${date}T12:00:00Z`));
    assert.equal(paris, date);
    assert.equal(
      chaiDesTortuesAuthoritativeNightlyRate(paris),
      chaiDesTortuesAuthoritativeNightlyRate(date),
    );
  }
});

test("le devis du 1er au 8 août sépare hébergement, ménage et taxe sans remise", async () => {
  const expected = new Map([
    [2, { tax: 63.14, total: 3427.14 }],
    [6, { tax: 179.76, total: 3543.76 }],
  ]);
  for (const adults of [2, 6]) {
    const quote = await calculateQuote({
      propertySlug: "chai-des-tortues",
      arrival: "2027-08-01",
      departure: "2027-08-08",
      adults,
      children: 0,
      babies: 0,
      pets: 0,
      options: [],
      experiences: [],
    });
    assert.deepEqual(quote.nightlyLines.map((line) => line.rate), Array(7).fill(467));
    assert.equal(quote.accommodationBeforeDiscount, 3269);
    assert.equal(quote.promotion, null);
    assert.equal(quote.accommodation, 3269);
    assert.equal(quote.cleaningFee, 95);
    assert.equal(quote.touristTax, expected.get(adults)?.tax);
    assert.equal(quote.optionsTotal, 0);
    assert.deepEqual(quote.securityDeposit, { amount: 0, includedInTotal: false });
    assert.equal(quote.total, expected.get(adults)?.total);
  }
});

test("animaux et linge restent facultatifs et ne sont ajoutés qu'une fois", async () => {
  const quote = await calculateQuote({
    propertySlug: "chai-des-tortues",
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
    quote.optionLines.map(({ id, quantity, unitPrice, total }) => ({ id, quantity, unitPrice, total })),
    [
      { id: "pet", quantity: 2, unitPrice: 25, total: 50 },
      { id: "linen", quantity: 3, unitPrice: 20, total: 60 },
    ],
  );
  assert.equal(quote.total, quote.accommodation + 95 + quote.touristTax + 110);
});

test("les durées minimales existantes sont conservées et signalées par le devis", async () => {
  const short = await calculateQuote({
    propertySlug: "chai-des-tortues",
    arrival: "2027-08-01",
    departure: "2027-08-03",
    adults: 2,
    children: 0,
    babies: 0,
    pets: 0,
    options: [],
    experiences: [],
  });
  assert.equal(short.stayRules.valid, false);
  assert.ok(short.stayRules.requiredMinimum >= 2);
});

test("la fenêtre glissante applique la borne supérieure exclusive", () => {
  assert.deepEqual(publicBookingWindow("2026-08-16"), {
    startsOn: "2026-08-16",
    endsOnExclusive: "2027-08-16",
  });
  assert.equal(isStayInsidePublicBookingWindow("2027-08-15", "2027-08-16", "2026-08-16"), true);
  assert.equal(isStayInsidePublicBookingWindow("2027-08-16", "2027-08-17", "2026-08-16"), false);
});

test("les GET publics restent sans écriture et les calendriers ferment en cas de doute", async () => {
  const availability = await readFile("app/api/availability/route.ts", "utf8");
  const publicCalendar = await readFile("app/api/calendar/route.ts", "utf8");
  const service = await readFile("platform/calendar/service.ts", "utf8");
  assert.match(availability, /calendar\.reliable\s*&&\s*capacityFits/);
  assert.doesNotMatch(availability, /persist\s*:\s*true/);
  assert.doesNotMatch(publicCalendar, /persist\s*:\s*true/);
  assert.match(service, /persist && isDatabaseConfigured\(\)/);
});

test("le Chai utilise exclusivement les deux variables iCal Airbnb et Booking", async () => {
  const config = await readFile("platform/calendar/config.ts", "utf8");
  assert.equal(config.match(/propertySlug:\s*"chai-des-tortues"/g)?.length, 2);
  assert.match(config, /ICAL_CHAI_DES_TORTUES_AIRBNB_URL/);
  assert.match(config, /ICAL_CHAI_DES_TORTUES_BOOKING_URL/);
  assert.doesNotMatch(config, /ICAL_CHAI_DES_TORTUES_(ABRITEL|GOOGLE)_URL/);
});
