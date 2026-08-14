import type { CalendarBlock, CalendarProvider } from "./contracts";
import type { PropertySlug } from "./config";

type CalendarCorrection = {
  propertySlug: PropertySlug;
  provider: CalendarProvider;
  startsOn: string;
  endsOn: string;
  reason: string;
};

// Validated against the house reference calendars on 2026-08-14.
// This imported Airbnb block belongs to Le Nid d’Été (Laura Hurter), not to the Chai.
export const calendarCorrections: readonly CalendarCorrection[] = [
  {
    propertySlug: "chai-des-tortues",
    provider: "airbnb",
    startsOn: "2026-08-28",
    endsOn: "2026-09-01",
    reason: "Cross-property block imported into the Chai Airbnb feed",
  },
];

export function isExcludedCalendarInterval(input: {
  propertySlug: PropertySlug;
  provider: CalendarProvider;
  startsOn: string;
  endsOn: string;
}) {
  return calendarCorrections.some(
    (correction) =>
      correction.propertySlug === input.propertySlug &&
      correction.provider === input.provider &&
      correction.startsOn === input.startsOn.slice(0, 10) &&
      correction.endsOn === input.endsOn.slice(0, 10),
  );
}

export function filterLiveCalendarBlocks(
  propertySlug: PropertySlug,
  provider: CalendarProvider,
  blocks: CalendarBlock[],
) {
  return blocks.filter(
    (block) =>
      !isExcludedCalendarInterval({
        propertySlug,
        provider,
        startsOn: block.startsAt,
        endsOn: block.endsAt,
      }),
  );
}
