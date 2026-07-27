import type { CalendarBlock, CalendarSource } from "./contracts";

const unfold = (value: string) => value.replace(/\r?\n[ \t]/g, "");
const isoDate = (value: string) => {
  const match = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})Z?)?$/);
  if (!match) throw new Error(`Unsupported iCal date: ${value}`);
  const [, year, month, day, hour = "00", minute = "00", second = "00"] = match;
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`).toISOString();
};

export function parseICalendar(input: string, source: CalendarSource): CalendarBlock[] {
  const events = unfold(input).split("BEGIN:VEVENT").slice(1).map((part) => part.split("END:VEVENT")[0]);
  return events.map((event, index) => {
    const read = (key: string) => event.match(new RegExp(`(?:^|\\n)${key}(?:;[^:]*)?:([^\\r\\n]+)`))?.[1]?.trim();
    const start = read("DTSTART");
    const end = read("DTEND");
    if (!start || !end) throw new Error(`iCal event ${index + 1} has no DTSTART or DTEND`);
    const rawStatus = read("STATUS")?.toLowerCase();
    return {
      uid: read("UID") ?? `${source.id}-${index}`,
      propertySlug: source.propertySlug,
      sourceId: source.id,
      startsAt: isoDate(start),
      endsAt: isoDate(end),
      summary: read("SUMMARY"),
      status: rawStatus === "cancelled" || rawStatus === "tentative" ? rawStatus : "confirmed",
    };
  });
}

export function mergeCalendarBlocks(blocks: CalendarBlock[]) {
  return [...new Map(blocks.map((block) => [`${block.sourceId}:${block.uid}`, block])).values()]
    .filter((block) => block.status !== "cancelled")
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
