import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  isStayInsidePublicBookingWindow,
  publicBookingWindow,
} from "../platform/reservations/booking-window";

test("the public booking window is exactly twelve months with an exclusive upper bound", () => {
  assert.deepEqual(publicBookingWindow("2026-08-16"), {
    startsOn: "2026-08-16",
    endsOnExclusive: "2027-08-16",
  });
  assert.equal(isStayInsidePublicBookingWindow("2026-08-16", "2027-08-16", "2026-08-16"), true);
  assert.equal(isStayInsidePublicBookingWindow("2027-08-16", "2027-08-17", "2026-08-16"), false);
  assert.equal(isStayInsidePublicBookingWindow("2026-08-15", "2026-08-17", "2026-08-16"), false);
});

test("pricing, availability, quote and final reservation enforce the shared window", async () => {
  const routes = [
    "app/api/pricing/route.ts",
    "app/api/availability/route.ts",
    "app/api/quote/route.ts",
    "app/api/reservation/route.ts",
  ];
  for (const route of routes) {
    const source = await readFile(route, "utf8");
    assert.match(source, /isStayInsidePublicBookingWindow/);
    assert.match(source, /OUTSIDE_BOOKING_WINDOW/);
  }
});

test("public calendar and quote reads do not request persistent synchronization", async () => {
  const publicCalendar = await readFile("app/api/calendar/route.ts", "utf8");
  const availability = await readFile("app/api/availability/route.ts", "utf8");
  const quote = await readFile("app/api/quote/route.ts", "utf8");
  const calendarService = await readFile("platform/calendar/service.ts", "utf8");
  assert.doesNotMatch(publicCalendar, /persist\s*:\s*true/);
  assert.doesNotMatch(availability, /persist\s*:\s*true/);
  assert.doesNotMatch(quote, /persist\s*:\s*true/);
  assert.match(calendarService, /const persisted =\s+persist && isDatabaseConfigured\(\)/);
});
