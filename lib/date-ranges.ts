export type DateRange = {
  startsOn: string;
  endsOn: string;
};

/**
 * A stay occupies nights, represented as a half-open interval [arrival, departure).
 * The departure date is therefore available as the next stay's arrival date.
 */
export function dateRangesOverlap(first: DateRange, second: DateRange) {
  return first.startsOn < second.endsOn && first.endsOn > second.startsOn;
}

export function isDateOccupied(blocks: DateRange[], date: string) {
  return blocks.some((block) => date >= block.startsOn && date < block.endsOn);
}

export function isDateRangeAvailable(blocks: DateRange[], arrival: string, departure: string) {
  return !blocks.some((block) =>
    dateRangesOverlap({ startsOn: arrival, endsOn: departure }, block),
  );
}
