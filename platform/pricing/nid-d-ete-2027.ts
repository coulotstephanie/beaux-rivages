export type NidDEte2027RatePeriod = {
  startsOn: string;
  endsOn: string;
  nightlyRate: number;
};

// Arrival dates are inclusive and departure dates are exclusive throughout the
// pricing engine. This is the direct-booking grid: it stays below platform
// pricing while preserving the property's seasonal value.
export const NID_D_ETE_2027_RATE_PERIODS: readonly NidDEte2027RatePeriod[] = [
  { startsOn: "2027-01-01", endsOn: "2027-01-02", nightlyRate: 170 },
  { startsOn: "2027-01-02", endsOn: "2027-01-11", nightlyRate: 135 },
  { startsOn: "2027-01-11", endsOn: "2027-01-15", nightlyRate: 95 },
  { startsOn: "2027-01-15", endsOn: "2027-01-17", nightlyRate: 110 },
  { startsOn: "2027-01-17", endsOn: "2027-01-22", nightlyRate: 95 },
  { startsOn: "2027-01-22", endsOn: "2027-01-24", nightlyRate: 110 },
  { startsOn: "2027-01-24", endsOn: "2027-01-29", nightlyRate: 95 },
  { startsOn: "2027-01-29", endsOn: "2027-01-31", nightlyRate: 110 },
  { startsOn: "2027-01-31", endsOn: "2027-02-01", nightlyRate: 95 },
  { startsOn: "2027-02-01", endsOn: "2027-03-08", nightlyRate: 125 },
  { startsOn: "2027-03-08", endsOn: "2027-03-12", nightlyRate: 105 },
  { startsOn: "2027-03-12", endsOn: "2027-03-14", nightlyRate: 120 },
  { startsOn: "2027-03-14", endsOn: "2027-03-19", nightlyRate: 105 },
  { startsOn: "2027-03-19", endsOn: "2027-03-21", nightlyRate: 120 },
  { startsOn: "2027-03-21", endsOn: "2027-03-26", nightlyRate: 105 },
  { startsOn: "2027-03-26", endsOn: "2027-04-01", nightlyRate: 165 },
  { startsOn: "2027-04-01", endsOn: "2027-04-02", nightlyRate: 150 },
  { startsOn: "2027-04-02", endsOn: "2027-04-04", nightlyRate: 170 },
  { startsOn: "2027-04-04", endsOn: "2027-04-09", nightlyRate: 150 },
  { startsOn: "2027-04-09", endsOn: "2027-04-11", nightlyRate: 170 },
  { startsOn: "2027-04-11", endsOn: "2027-04-16", nightlyRate: 150 },
  { startsOn: "2027-04-16", endsOn: "2027-04-18", nightlyRate: 170 },
  { startsOn: "2027-04-18", endsOn: "2027-04-23", nightlyRate: 150 },
  { startsOn: "2027-04-23", endsOn: "2027-04-25", nightlyRate: 170 },
  { startsOn: "2027-04-25", endsOn: "2027-04-30", nightlyRate: 150 },
  { startsOn: "2027-04-30", endsOn: "2027-05-03", nightlyRate: 180 },
  { startsOn: "2027-05-03", endsOn: "2027-05-05", nightlyRate: 145 },
  { startsOn: "2027-05-05", endsOn: "2027-05-09", nightlyRate: 220 },
  { startsOn: "2027-05-09", endsOn: "2027-05-14", nightlyRate: 145 },
  { startsOn: "2027-05-14", endsOn: "2027-05-17", nightlyRate: 195 },
  { startsOn: "2027-05-17", endsOn: "2027-05-21", nightlyRate: 145 },
  { startsOn: "2027-05-21", endsOn: "2027-05-23", nightlyRate: 165 },
  { startsOn: "2027-05-23", endsOn: "2027-05-28", nightlyRate: 145 },
  { startsOn: "2027-05-28", endsOn: "2027-05-30", nightlyRate: 180 },
  { startsOn: "2027-05-30", endsOn: "2027-06-04", nightlyRate: 155 },
  { startsOn: "2027-06-04", endsOn: "2027-06-07", nightlyRate: 175 },
  { startsOn: "2027-06-07", endsOn: "2027-06-11", nightlyRate: 145 },
  { startsOn: "2027-06-11", endsOn: "2027-06-13", nightlyRate: 165 },
  { startsOn: "2027-06-13", endsOn: "2027-06-18", nightlyRate: 145 },
  { startsOn: "2027-06-18", endsOn: "2027-06-20", nightlyRate: 165 },
  { startsOn: "2027-06-20", endsOn: "2027-06-25", nightlyRate: 145 },
  { startsOn: "2027-06-25", endsOn: "2027-07-05", nightlyRate: 175 },
  { startsOn: "2027-07-05", endsOn: "2027-07-19", nightlyRate: 195 },
  { startsOn: "2027-07-19", endsOn: "2027-07-31", nightlyRate: 210 },
  { startsOn: "2027-07-31", endsOn: "2027-08-16", nightlyRate: 225 },
  { startsOn: "2027-08-16", endsOn: "2027-09-01", nightlyRate: 195 },
  { startsOn: "2027-09-01", endsOn: "2027-10-01", nightlyRate: 145 },
  { startsOn: "2027-10-01", endsOn: "2027-12-17", nightlyRate: 110 },
  { startsOn: "2027-12-17", endsOn: "2028-01-01", nightlyRate: 160 },
];

export function nidDEte2027NightlyRate(date: string): number | undefined {
  if (date < "2027-01-01" || date >= "2028-01-01") return undefined;
  return NID_D_ETE_2027_RATE_PERIODS.find(
    (period) => date >= period.startsOn && date < period.endsOn,
  )?.nightlyRate;
}
