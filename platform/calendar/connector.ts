import type { CalendarBlock, CalendarConnector, CalendarSource } from "./contracts";
import { parseICalendar } from "./ical";

const allowedHosts = new Set([
  "www.airbnb.fr",
  "airbnb.fr",
  "ical.booking.com",
  "www.vrbo.com",
  "www.abritel.fr",
  "calendar.google.com",
]);
const maximumBytes = 1_500_000;

function validateSourceUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" || !allowedHosts.has(url.hostname)) {
    throw new Error("Calendar host is not allowed.");
  }
  return url;
}

export class ICalendarConnector implements CalendarConnector {
  async fetch(source: CalendarSource): Promise<CalendarBlock[]> {
    const url = validateSourceUrl(source.url);
    const response = await fetch(url, {
      headers: { accept: "text/calendar, text/plain;q=0.9" },
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Calendar provider returned ${response.status}.`);
    const length = Number(response.headers.get("content-length") ?? 0);
    if (length > maximumBytes) throw new Error("Calendar feed is too large.");
    const body = await response.text();
    if (new TextEncoder().encode(body).byteLength > maximumBytes) throw new Error("Calendar feed is too large.");
    if (!body.includes("BEGIN:VCALENDAR")) throw new Error("Calendar feed is invalid.");
    return parseICalendar(body, source);
  }
}
