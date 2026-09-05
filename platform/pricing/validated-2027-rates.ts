import type { PropertySlug } from "@/platform/calendar/config";
import { nidDEte2027NightlyRate } from "./nid-d-ete-2027";

type RatePeriod = {
  startsOn: string;
  endsOn: string;
  nightlyRate: number;
};

type MinimumStayPeriod = {
  startsOn: string;
  endsOn: string;
  minimumNights: number;
};

const CHAI_DES_TORTUES_2027_RATE_PERIODS: readonly RatePeriod[] = [
  { startsOn: "2027-01-01", endsOn: "2027-01-02", nightlyRate: 240 },
  { startsOn: "2027-01-02", endsOn: "2027-01-11", nightlyRate: 195 },
  { startsOn: "2027-01-11", endsOn: "2027-02-01", nightlyRate: 135 },
  { startsOn: "2027-02-01", endsOn: "2027-03-09", nightlyRate: 175 },
  { startsOn: "2027-03-09", endsOn: "2027-03-22", nightlyRate: 155 },
  { startsOn: "2027-03-22", endsOn: "2027-04-01", nightlyRate: 205 },
  { startsOn: "2027-04-01", endsOn: "2027-05-04", nightlyRate: 220 },
  { startsOn: "2027-05-04", endsOn: "2027-05-05", nightlyRate: 195 },
  { startsOn: "2027-05-05", endsOn: "2027-05-09", nightlyRate: 315 },
  { startsOn: "2027-05-09", endsOn: "2027-05-14", nightlyRate: 195 },
  { startsOn: "2027-05-14", endsOn: "2027-05-17", nightlyRate: 285 },
  { startsOn: "2027-05-17", endsOn: "2027-05-21", nightlyRate: 195 },
  { startsOn: "2027-05-21", endsOn: "2027-05-23", nightlyRate: 225 },
  { startsOn: "2027-05-23", endsOn: "2027-05-28", nightlyRate: 195 },
  { startsOn: "2027-05-28", endsOn: "2027-05-29", nightlyRate: 225 },
  { startsOn: "2027-05-29", endsOn: "2027-05-30", nightlyRate: 235 },
  { startsOn: "2027-05-30", endsOn: "2027-06-04", nightlyRate: 215 },
  { startsOn: "2027-06-04", endsOn: "2027-06-06", nightlyRate: 235 },
  { startsOn: "2027-06-06", endsOn: "2027-06-07", nightlyRate: 215 },
  { startsOn: "2027-06-07", endsOn: "2027-06-28", nightlyRate: 200 },
  { startsOn: "2027-06-28", endsOn: "2027-07-24", nightlyRate: 325 },
  { startsOn: "2027-07-24", endsOn: "2027-08-16", nightlyRate: 350 },
  { startsOn: "2027-08-16", endsOn: "2027-08-23", nightlyRate: 335 },
  { startsOn: "2027-08-23", endsOn: "2027-09-01", nightlyRate: 250 },
  { startsOn: "2027-09-01", endsOn: "2027-10-01", nightlyRate: 180 },
  { startsOn: "2027-10-01", endsOn: "2027-10-16", nightlyRate: 150 },
  { startsOn: "2027-10-16", endsOn: "2027-11-01", nightlyRate: 180 },
  { startsOn: "2027-11-01", endsOn: "2027-11-10", nightlyRate: 140 },
  { startsOn: "2027-11-10", endsOn: "2027-11-14", nightlyRate: 180 },
  { startsOn: "2027-11-14", endsOn: "2027-12-18", nightlyRate: 130 },
  { startsOn: "2027-12-18", endsOn: "2027-12-24", nightlyRate: 180 },
  { startsOn: "2027-12-24", endsOn: "2027-12-31", nightlyRate: 220 },
  { startsOn: "2027-12-31", endsOn: "2028-01-01", nightlyRate: 250 },
];

const CHAI_DES_TORTUES_2027_WEEKEND_RATE_PERIODS: readonly RatePeriod[] = [
  { startsOn: "2027-01-11", endsOn: "2027-02-01", nightlyRate: 155 },
  { startsOn: "2027-02-01", endsOn: "2027-03-09", nightlyRate: 195 },
  { startsOn: "2027-03-09", endsOn: "2027-03-22", nightlyRate: 175 },
  { startsOn: "2027-03-22", endsOn: "2027-04-01", nightlyRate: 230 },
  { startsOn: "2027-04-01", endsOn: "2027-05-04", nightlyRate: 245 },
  { startsOn: "2027-05-17", endsOn: "2027-05-23", nightlyRate: 225 },
  { startsOn: "2027-05-23", endsOn: "2027-05-29", nightlyRate: 225 },
  { startsOn: "2027-05-30", endsOn: "2027-06-07", nightlyRate: 235 },
  { startsOn: "2027-06-07", endsOn: "2027-06-28", nightlyRate: 230 },
];

const VILLA_RAIE_MANTA_2027_RATE_PERIODS: readonly RatePeriod[] = [
  { startsOn: "2027-01-04", endsOn: "2027-04-03", nightlyRate: 140 },
  { startsOn: "2027-04-03", endsOn: "2027-07-01", nightlyRate: 190 },
  { startsOn: "2027-07-01", endsOn: "2027-07-10", nightlyRate: 420 },
  { startsOn: "2027-07-10", endsOn: "2027-07-24", nightlyRate: 480 },
  { startsOn: "2027-07-24", endsOn: "2027-08-21", nightlyRate: 520 },
  { startsOn: "2027-08-21", endsOn: "2027-09-01", nightlyRate: 390 },
  { startsOn: "2027-09-01", endsOn: "2027-10-01", nightlyRate: 200 },
  { startsOn: "2027-10-01", endsOn: "2027-10-16", nightlyRate: 180 },
  { startsOn: "2027-10-16", endsOn: "2027-11-01", nightlyRate: 220 },
  { startsOn: "2027-11-01", endsOn: "2027-11-10", nightlyRate: 170 },
  { startsOn: "2027-11-10", endsOn: "2027-11-14", nightlyRate: 220 },
  { startsOn: "2027-11-14", endsOn: "2027-12-18", nightlyRate: 160 },
  { startsOn: "2027-12-18", endsOn: "2027-12-24", nightlyRate: 250 },
  { startsOn: "2027-12-24", endsOn: "2027-12-31", nightlyRate: 300 },
  { startsOn: "2027-12-31", endsOn: "2028-01-01", nightlyRate: 350 },
];

const CHAI_DES_TORTUES_2027_MINIMUM_STAYS: readonly MinimumStayPeriod[] = [
  { startsOn: "2027-01-01", endsOn: "2027-01-11", minimumNights: 4 },
  { startsOn: "2027-01-11", endsOn: "2027-02-01", minimumNights: 2 },
  { startsOn: "2027-02-01", endsOn: "2027-05-03", minimumNights: 4 },
  { startsOn: "2027-05-03", endsOn: "2027-05-05", minimumNights: 2 },
  { startsOn: "2027-05-05", endsOn: "2027-05-14", minimumNights: 4 },
  { startsOn: "2027-05-14", endsOn: "2027-05-17", minimumNights: 3 },
  { startsOn: "2027-05-17", endsOn: "2027-06-07", minimumNights: 4 },
  { startsOn: "2027-06-07", endsOn: "2027-06-28", minimumNights: 2 },
  { startsOn: "2027-06-28", endsOn: "2027-08-23", minimumNights: 7 },
  { startsOn: "2027-08-23", endsOn: "2027-09-01", minimumNights: 4 },
];

const VILLA_RAIE_MANTA_2027_MINIMUM_STAYS: readonly MinimumStayPeriod[] = [
  { startsOn: "2027-01-04", endsOn: "2027-04-03", minimumNights: 2 },
  { startsOn: "2027-04-03", endsOn: "2027-07-01", minimumNights: 3 },
  { startsOn: "2027-07-01", endsOn: "2027-09-01", minimumNights: 7 },
];

function findRate(periods: readonly RatePeriod[], date: string) {
  return periods.find((period) => date >= period.startsOn && date < period.endsOn)?.nightlyRate;
}

function findMinimumStay(periods: readonly MinimumStayPeriod[], date: string) {
  return periods.find((period) => date >= period.startsOn && date < period.endsOn)?.minimumNights;
}

function isFridayOrSaturday(date: string) {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return day === 5 || day === 6;
}

function chaiDesTortues2027NightlyRate(date: string) {
  if (isFridayOrSaturday(date)) {
    const weekendRate = findRate(CHAI_DES_TORTUES_2027_WEEKEND_RATE_PERIODS, date);
    if (weekendRate !== undefined) return weekendRate;
  }
  return findRate(CHAI_DES_TORTUES_2027_RATE_PERIODS, date);
}

/**
 * Rates explicitly validated with Stéphanie and harmonized with the channel
 * calendars. They take precedence over stale imported seasons and yield data.
 */
export function validated2027NightlyRate(
  propertySlug: PropertySlug,
  date: string,
): number | undefined {
  if (propertySlug === "nid-d-ete") return nidDEte2027NightlyRate(date);
  if (propertySlug === "chai-des-tortues") return chaiDesTortues2027NightlyRate(date);
  if (propertySlug === "villa-raie-manta")
    return findRate(VILLA_RAIE_MANTA_2027_RATE_PERIODS, date);
  return undefined;
}

export function validated2027MinimumNights(
  propertySlug: PropertySlug,
  date: string,
): number | undefined {
  if (propertySlug === "chai-des-tortues")
    return findMinimumStay(CHAI_DES_TORTUES_2027_MINIMUM_STAYS, date);
  if (propertySlug === "villa-raie-manta")
    return findMinimumStay(VILLA_RAIE_MANTA_2027_MINIMUM_STAYS, date);
  return undefined;
}
