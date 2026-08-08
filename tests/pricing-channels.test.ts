import assert from "node:assert/strict";
import test from "node:test";
import {
  applyBookingPromotions,
  calculateChannelComparison,
  isInsideRollingWindow,
  minimumNightsForDate,
  requiredMinimumNights,
  rollingWindow,
  type ChannelRule,
  type DatedChannelRules,
} from "../platform/pricing/channels";
import { frenchPublicCalendar } from "../platform/calendar/french-reference-calendar";

const airbnb: DatedChannelRules = {
  effectiveFrom: "2026-10-13",
  before: {
    channel: "airbnb",
    commissionPercentage: 3,
    commissionAppliesToCleaning: true,
    markupStrategy: "percentage",
    markupValue: 3,
  },
  after: {
    channel: "airbnb",
    commissionPercentage: 18.6,
    commissionAppliesToCleaning: true,
    markupStrategy: "net-parity",
    markupValue: 0,
  },
};
const booking: ChannelRule = {
  channel: "booking",
  commissionPercentage: 15,
  commissionAppliesToCleaning: true,
  markupStrategy: "net-parity",
  markupValue: 0,
};

test("le prix maître recalcule Airbnb et Booking sans incorporer le ménage aux nuitées", () => {
  const result = calculateChannelComparison({
    date: "2026-10-13",
    nights: 2,
    masterNightlyRate: 470,
    cleaningFee: 155,
    airbnb,
    booking,
    bookingPromotions: [],
  });
  assert.equal(result.direct.nightlyRate, 470);
  assert.equal(result.direct.cleaningFee, 155);
  assert.equal(result.direct.guestTotal, 1095);
  assert.equal(result.airbnb.nightlyRate, 577.4);
  assert.equal(result.booking.nightlyRate, 552.94);
  assert.equal(result.airbnb.estimatedNetRevenue, 1066.17);
  assert.equal(result.airbnb.cleaningFee, 155);
});

test("la règle Airbnb change à la date configurable", () => {
  const before = calculateChannelComparison({
    date: "2026-10-12",
    nights: 1,
    masterNightlyRate: 100,
    cleaningFee: 75,
    airbnb,
    booking,
    bookingPromotions: [],
  });
  const after = calculateChannelComparison({
    date: "2026-10-13",
    nights: 1,
    masterNightlyRate: 100,
    cleaningFee: 75,
    airbnb,
    booking,
    bookingPromotions: [],
  });
  assert.equal(before.airbnb.commissionPercentage, 3);
  assert.equal(after.airbnb.commissionPercentage, 18.6);
  assert.notEqual(before.airbnb.nightlyRate, after.airbnb.nightlyRate);
});

test("une surcharge manuelle de canal remplace puis permet de retrouver le calcul automatique", () => {
  const base = {
    date: "2026-11-01",
    nights: 1,
    masterNightlyRate: 200,
    cleaningFee: 130,
    airbnb,
    booking,
    bookingPromotions: [],
  };
  const automatic = calculateChannelComparison(base);
  const manual = calculateChannelComparison({ ...base, manualNightlyOverrides: { airbnb: 299 } });
  assert.equal(manual.airbnb.nightlyRate, 299);
  assert.equal(manual.airbnb.manualOverride, true);
  assert.equal(automatic.airbnb.manualOverride, false);
  assert.notEqual(manual.airbnb.nightlyRate, automatic.airbnb.nightlyRate);
});

test("les promotions Booking cumulables s'appliquent séquentiellement et respectent la priorité", () => {
  const result = applyBookingPromotions(
    1000,
    [
      {
        id: "mobile",
        label: "Mobile",
        kind: "mobile",
        enabled: true,
        percentage: 10,
        startsOn: null,
        endsOn: null,
        stackable: true,
        priority: 100,
      },
      {
        id: "genius",
        label: "Genius",
        kind: "genius-2",
        enabled: true,
        percentage: 20,
        startsOn: null,
        endsOn: null,
        stackable: true,
        priority: 200,
      },
    ],
    "2026-08-01",
  );
  assert.equal(result.finalAmount, 720);
  assert.equal(result.discount, 280);
  assert.deepEqual(
    result.applied.map((item) => item.id),
    ["genius", "mobile"],
  );
});

test("une promotion Booking non cumulable bloque les suivantes", () => {
  const result = applyBookingPromotions(
    1000,
    [
      {
        id: "genius",
        label: "Genius",
        kind: "genius-1",
        enabled: true,
        percentage: 10,
        startsOn: null,
        endsOn: null,
        stackable: false,
        priority: 300,
      },
      {
        id: "mobile",
        label: "Mobile",
        kind: "mobile",
        enabled: true,
        percentage: 10,
        startsOn: null,
        endsOn: null,
        stackable: true,
        priority: 100,
      },
    ],
    "2026-08-01",
  );
  assert.deepEqual(
    result.applied.map((item) => item.id),
    ["genius"],
  );
  assert.equal(result.finalAmount, 900);
});

test("les minimums validés et la fenêtre de douze mois sont déterministes", () => {
  assert.equal(requiredMinimumNights({ date: "2026-07-15", csvMinimum: 2 }), 7);
  assert.equal(
    requiredMinimumNights({ date: "2026-04-15", csvMinimum: 2, schoolHoliday: true }),
    4,
  );
  assert.equal(requiredMinimumNights({ date: "2026-05-08", csvMinimum: 2, bridgeNights: 3 }), 3);
  assert.equal(requiredMinimumNights({ date: "2026-06-01", csvMinimum: 5 }), 5);
  assert.equal(isInsideRollingWindow("2027-08-07", "2026-08-08"), true);
  assert.equal(isInsideRollingWindow("2027-08-08", "2026-08-08"), false);
});

test("les règles prioritaires remplacent réellement le minimum CSV", () => {
  const holidays = [
    {
      date: "2026-12-24",
      kind: "school_holiday" as const,
      label: "Noël · Zone A",
      minimumNights: 4,
    },
    {
      date: "2027-02-20",
      kind: "school_holiday" as const,
      label: "Hiver · Zone B",
      minimumNights: 4,
    },
    {
      date: "2027-03-01",
      kind: "school_holiday" as const,
      label: "Hiver · Zone C",
      minimumNights: 4,
    },
  ];
  assert.equal(minimumNightsForDate("2026-12-24", 2, holidays), 4);
  assert.equal(minimumNightsForDate("2027-02-20", 2, holidays), 4);
  assert.equal(minimumNightsForDate("2027-03-01", 2, holidays), 4);
  assert.equal(minimumNightsForDate("2027-07-15", 2, holidays), 7);
  assert.equal(minimumNightsForDate("2027-06-15", 3, holidays), 3);
});

test("le pont de l’Ascension 2027 impose ses quatre nuits réelles", () => {
  const calendar = frenchPublicCalendar(2027);
  for (const date of ["2027-05-06", "2027-05-07", "2027-05-08", "2027-05-09"])
    assert.equal(minimumNightsForDate(date, 2, calendar), 4);
});

test("la borne des douze mois expose le dernier jour autorisé et exclut le suivant", () => {
  const window = rollingWindow("2026-08-08");
  assert.deepEqual(window, { start: "2026-08-08", end: "2027-08-07", endExclusive: "2027-08-08" });
  assert.equal(isInsideRollingWindow(window.end, window.start), true);
  assert.equal(isInsideRollingWindow(window.endExclusive, window.start), false);
});
