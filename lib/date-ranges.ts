export type DateRange = {
  startsOn: string;
  endsOn: string;
};

export function isDateRangeAvailable(blocks: DateRange[], arrival: string, departure: string) {
  return !blocks.some((block) => arrival < block.endsOn && departure > block.startsOn);
}
