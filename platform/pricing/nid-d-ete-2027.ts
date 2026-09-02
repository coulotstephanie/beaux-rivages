export type NidDEte2027RatePeriod = {
  startsOn: string;
  endsOn: string;
  nightlyRate: number;
};

// Arrival dates are inclusive and departure dates are exclusive throughout the
// pricing engine. These periods follow the same convention to avoid overlaps.
export const NID_D_ETE_2027_RATE_PERIODS: readonly NidDEte2027RatePeriod[] = [
  { startsOn: "2027-01-01", endsOn: "2027-01-02", nightlyRate: 237 },
  { startsOn: "2027-01-02", endsOn: "2027-01-11", nightlyRate: 192 },
  { startsOn: "2027-01-11", endsOn: "2027-01-15", nightlyRate: 103 },
  { startsOn: "2027-01-15", endsOn: "2027-01-17", nightlyRate: 123 },
  { startsOn: "2027-01-17", endsOn: "2027-01-22", nightlyRate: 103 },
  { startsOn: "2027-01-22", endsOn: "2027-01-24", nightlyRate: 123 },
  { startsOn: "2027-01-24", endsOn: "2027-01-29", nightlyRate: 103 },
  { startsOn: "2027-01-29", endsOn: "2027-01-31", nightlyRate: 123 },
  { startsOn: "2027-01-31", endsOn: "2027-02-01", nightlyRate: 103 },
  { startsOn: "2027-02-01", endsOn: "2027-03-08", nightlyRate: 192 },
  { startsOn: "2027-03-08", endsOn: "2027-03-12", nightlyRate: 123 },
  { startsOn: "2027-03-12", endsOn: "2027-03-14", nightlyRate: 143 },
  { startsOn: "2027-03-14", endsOn: "2027-03-19", nightlyRate: 123 },
  { startsOn: "2027-03-19", endsOn: "2027-03-21", nightlyRate: 143 },
  { startsOn: "2027-03-21", endsOn: "2027-03-26", nightlyRate: 123 },
  { startsOn: "2027-03-26", endsOn: "2027-03-28", nightlyRate: 227 },
  { startsOn: "2027-03-28", endsOn: "2027-04-01", nightlyRate: 202 },
  { startsOn: "2027-04-01", endsOn: "2027-04-02", nightlyRate: 212 },
  { startsOn: "2027-04-02", endsOn: "2027-04-04", nightlyRate: 237 },
  { startsOn: "2027-04-04", endsOn: "2027-04-09", nightlyRate: 212 },
  { startsOn: "2027-04-09", endsOn: "2027-04-11", nightlyRate: 237 },
  { startsOn: "2027-04-11", endsOn: "2027-04-16", nightlyRate: 212 },
  { startsOn: "2027-04-16", endsOn: "2027-04-18", nightlyRate: 237 },
  { startsOn: "2027-04-18", endsOn: "2027-04-23", nightlyRate: 212 },
  { startsOn: "2027-04-23", endsOn: "2027-04-25", nightlyRate: 237 },
  { startsOn: "2027-04-25", endsOn: "2027-04-30", nightlyRate: 212 },
  { startsOn: "2027-04-30", endsOn: "2027-05-01", nightlyRate: 237 },
  { startsOn: "2027-05-01", endsOn: "2027-05-03", nightlyRate: 180 },
  { startsOn: "2027-05-03", endsOn: "2027-05-09", nightlyRate: 180 },
  { startsOn: "2027-05-09", endsOn: "2027-05-10", nightlyRate: 140 },
  { startsOn: "2027-05-10", endsOn: "2027-05-14", nightlyRate: 140 },
  { startsOn: "2027-05-14", endsOn: "2027-05-17", nightlyRate: 210 },
  { startsOn: "2027-05-17", endsOn: "2027-05-21", nightlyRate: 140 },
  { startsOn: "2027-05-21", endsOn: "2027-05-23", nightlyRate: 170 },
  { startsOn: "2027-05-23", endsOn: "2027-05-28", nightlyRate: 140 },
  { startsOn: "2027-05-28", endsOn: "2027-05-29", nightlyRate: 170 },
  { startsOn: "2027-05-29", endsOn: "2027-05-30", nightlyRate: 190 },
  { startsOn: "2027-05-30", endsOn: "2027-06-01", nightlyRate: 160 },
  { startsOn: "2027-06-01", endsOn: "2027-06-04", nightlyRate: 202 },
  { startsOn: "2027-06-04", endsOn: "2027-06-06", nightlyRate: 232 },
  { startsOn: "2027-06-06", endsOn: "2027-06-07", nightlyRate: 202 },
  { startsOn: "2027-06-07", endsOn: "2027-06-11", nightlyRate: 178 },
  { startsOn: "2027-06-11", endsOn: "2027-06-13", nightlyRate: 208 },
  { startsOn: "2027-06-13", endsOn: "2027-06-18", nightlyRate: 178 },
  { startsOn: "2027-06-18", endsOn: "2027-06-20", nightlyRate: 208 },
  { startsOn: "2027-06-20", endsOn: "2027-06-25", nightlyRate: 178 },
  { startsOn: "2027-06-25", endsOn: "2027-07-05", nightlyRate: 208 },
  { startsOn: "2027-07-05", endsOn: "2027-07-19", nightlyRate: 220 },
  { startsOn: "2027-07-19", endsOn: "2027-07-31", nightlyRate: 235 },
  { startsOn: "2027-07-31", endsOn: "2027-08-16", nightlyRate: 250 },
  { startsOn: "2027-08-16", endsOn: "2027-08-25", nightlyRate: 220 },
  { startsOn: "2027-08-25", endsOn: "2027-09-01", nightlyRate: 170 },
  { startsOn: "2027-09-01", endsOn: "2027-09-03", nightlyRate: 140 },
  { startsOn: "2027-09-03", endsOn: "2027-09-05", nightlyRate: 150 },
  { startsOn: "2027-09-05", endsOn: "2027-09-10", nightlyRate: 140 },
  { startsOn: "2027-09-10", endsOn: "2027-09-12", nightlyRate: 150 },
  { startsOn: "2027-09-12", endsOn: "2027-09-13", nightlyRate: 140 },
  { startsOn: "2027-09-13", endsOn: "2027-09-17", nightlyRate: 130 },
  { startsOn: "2027-09-17", endsOn: "2027-09-19", nightlyRate: 140 },
  { startsOn: "2027-09-19", endsOn: "2027-09-24", nightlyRate: 130 },
  { startsOn: "2027-09-24", endsOn: "2027-09-26", nightlyRate: 140 },
  { startsOn: "2027-09-26", endsOn: "2027-09-28", nightlyRate: 130 },
  { startsOn: "2027-09-28", endsOn: "2027-10-01", nightlyRate: 115 },
  { startsOn: "2027-10-01", endsOn: "2027-12-17", nightlyRate: 178 },
  { startsOn: "2027-12-17", endsOn: "2028-01-01", nightlyRate: 207 },
];

export function nidDEte2027NightlyRate(date: string): number | undefined {
  if (date < "2027-01-01" || date >= "2028-01-01") return undefined;
  return NID_D_ETE_2027_RATE_PERIODS.find(
    (period) => date >= period.startsOn && date < period.endsOn,
  )?.nightlyRate;
}
