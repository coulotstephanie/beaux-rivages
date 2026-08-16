import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { calculateQuote, rateForDate } from "../platform/pricing/service";
import type { PropertyRatePlan } from "../platform/pricing/contracts";
import {
  VILLA_RAIE_MANTA_AUTHORITATIVE_RATE_PERIODS,
  villaRaieMantaAuthoritativeNightlyRate,
} from "../platform/pricing/villa-raie-manta-authoritative";
import {
  isStayInsidePublicBookingWindow,
  publicBookingWindow,
} from "../platform/reservations/booking-window";

const stalePlan: PropertyRatePlan = {
  propertySlug: "villa-raie-manta",
  currency: "EUR",
  baseNightlyRate: 999,
  weekendNightlyRate: 999,
  minimumNights: 2,
  maximumNights: 28,
  cleaningFee: 130,
  securityDeposit: 0,
  touristTax: { enabled: false, mode: "percentage", value: 0 },
  optionPrices: { pet: 25, linen: 20 },
  seasons: [
    {
      id: "import-csv-v2",
      label: "Import CSV V2",
      kind: "manual",
      startsOn: "2026-08-01",
      endsOn: "2028-01-01",
      nightlyRate: 645,
      minimumNights: 7,
    },
  ],
  overrides: [{ date: "2027-08-01", nightlyRate: 999, minimumNights: 7 }],
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

test("les 365 dates de 2027 correspondent chacune à un unique tarif Villa", () => {
  const dates = datesInYear(2027);
  assert.equal(dates.length, 365);
  for (const date of dates) {
    const matches = VILLA_RAIE_MANTA_AUTHORITATIVE_RATE_PERIODS.filter(
      (period) => date >= period.startsOn && date < period.endsOn,
    );
    assert.equal(matches.length, 1, `${date}: période unique attendue`);
    assert.equal(villaRaieMantaAuthoritativeNightlyRate(date), matches[0].nightlyRate, date);
    assert.equal(rateForDate(stalePlan, date).rate, matches[0].nightlyRate, date);
  }
});

test("les périodes sont contiguës sur 2027 et leurs bornes sont inclusives/exclusives", () => {
  const periods = VILLA_RAIE_MANTA_AUTHORITATIVE_RATE_PERIODS.filter(
    (period) => period.endsOn > "2027-01-01" && period.startsOn < "2028-01-01",
  );
  assert.equal(periods[0].startsOn, "2027-01-01");
  assert.equal(periods.at(-1)?.endsOn, "2028-01-01");
  for (let index = 1; index < periods.length; index += 1)
    assert.equal(periods[index - 1].endsOn, periods[index].startsOn);
});

test("les corrections 700 euros et les périodes prioritaires sont exactes", () => {
  const checks = [
    ["2026-09-01", 200],
    ["2026-09-03", 200],
    ["2026-12-06", 150],
    ["2027-02-13", 335],
    ["2027-03-26", 350],
    ["2027-05-01", 355],
    ["2027-07-01", 296],
    ["2027-07-14", 326],
    ["2027-07-15", 414],
    ["2027-08-01", 474],
    ["2027-08-20", 474],
    ["2027-08-21", 414],
    ["2027-11-14", 180],
    ["2027-11-19", 260],
    ["2027-11-21", 180],
    ["2027-11-26", 260],
    ["2027-11-28", 180],
    ["2027-12-03", 210],
    ["2027-12-05", 180],
    ["2027-12-10", 210],
    ["2027-12-12", 180],
    ["2027-12-17", 296],
  ] as const;
  for (const [date, expected] of checks)
    assert.equal(villaRaieMantaAuthoritativeNightlyRate(date), expected, date);
  assert.equal(
    VILLA_RAIE_MANTA_AUTHORITATIVE_RATE_PERIODS.some((p) => p.nightlyRate === 700),
    false,
  );
});

test("Import CSV V2, saisons, overrides et promotions ne remplacent jamais la grille Villa", () => {
  for (const date of ["2027-02-13", "2027-05-08", "2027-07-20", "2027-08-01"])
    assert.notEqual(rateForDate(stalePlan, date).rate, 645, date);
});

test("UTC et Europe/Paris résolvent chaque date 2027 de façon identique", () => {
  for (const date of datesInYear(2027)) {
    const instant = new Date(`${date}T12:00:00Z`);
    const paris = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(instant);
    assert.equal(paris, date);
    assert.equal(
      villaRaieMantaAuthoritativeNightlyRate(paris),
      villaRaieMantaAuthoritativeNightlyRate(date),
    );
  }
});

test("le devis du 1er au 8 août 2027 conserve frais, taxe et options séparés", async () => {
  for (const adults of [2, 8]) {
    const quote = await calculateQuote({
      propertySlug: "villa-raie-manta",
      arrival: "2027-08-01",
      departure: "2027-08-08",
      adults,
      children: 0,
      babies: 0,
      pets: 0,
      options: [],
      experiences: [],
    });
    assert.deepEqual(
      quote.nightlyLines.map((line) => line.rate),
      Array(7).fill(474),
    );
    assert.equal(quote.accommodationBeforeDiscount, 3_318);
    assert.equal(quote.promotion, null);
    assert.equal(quote.accommodation, 3_318);
    assert.equal(quote.cleaningFee, 130);
    assert.equal(quote.optionsTotal, 0);
    assert.deepEqual(quote.securityDeposit, { amount: 0, includedInTotal: false });
    assert.equal(quote.total, quote.accommodation + quote.cleaningFee + quote.touristTax);
  }
});

test("animaux et linge restent facultatifs et utilisent les unités validées", async () => {
  const quote = await calculateQuote({
    propertySlug: "villa-raie-manta",
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
});

test("la fenêtre publique de douze mois applique sa borne supérieure exclusive", () => {
  assert.deepEqual(publicBookingWindow("2026-08-16"), {
    startsOn: "2026-08-16",
    endsOnExclusive: "2027-08-16",
  });
  assert.equal(isStayInsidePublicBookingWindow("2027-08-15", "2027-08-16", "2026-08-16"), true);
  assert.equal(isStayInsidePublicBookingWindow("2027-08-16", "2027-08-17", "2026-08-16"), false);
});

test("les lectures publiques restent sans écriture et ferment lorsque les sources sont non fiables", async () => {
  const availability = await readFile("app/api/availability/route.ts", "utf8");
  const publicCalendar = await readFile("app/api/calendar/route.ts", "utf8");
  const service = await readFile("platform/calendar/service.ts", "utf8");
  assert.match(availability, /calendar\.reliable\s*&&\s*capacityFits/);
  assert.doesNotMatch(availability, /persist\s*:\s*true/);
  assert.doesNotMatch(publicCalendar, /persist\s*:\s*true/);
  assert.match(service, /persist && isDatabaseConfigured\(\)/);
});

test("Villa utilise exclusivement les deux variables iCal Airbnb et Booking", async () => {
  const config = await readFile("platform/calendar/config.ts", "utf8");
  assert.equal(config.match(/propertySlug:\s*"villa-raie-manta"/g)?.length, 2);
  assert.match(config, /ICAL_VILLA_RAIE_MANTA_AIRBNB_URL/);
  assert.match(config, /ICAL_VILLA_RAIE_MANTA_BOOKING_URL/);
  assert.doesNotMatch(config, /ICAL_VILLA_RAIE_MANTA_(ABRITEL|GOOGLE)_URL/);
});
