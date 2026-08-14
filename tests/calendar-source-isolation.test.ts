import assert from "node:assert/strict";
import test from "node:test";
import {
  filterLiveCalendarBlocks,
  isExcludedCalendarInterval,
} from "../platform/calendar/corrections";
import type { CalendarBlock } from "../platform/calendar/contracts";

const lauraHurterBlock: CalendarBlock = {
  uid: "cross-property-laura-hurter",
  propertySlug: "chai-des-tortues",
  sourceId: "chai-des-tortues-airbnb",
  startsAt: "2026-08-28T00:00:00.000Z",
  endsAt: "2026-09-01T00:00:00.000Z",
  status: "confirmed",
};

test("removes only the validated cross-property interval from the Chai Airbnb source", () => {
  assert.deepEqual(filterLiveCalendarBlocks("chai-des-tortues", "airbnb", [lauraHurterBlock]), []);
  assert.deepEqual(filterLiveCalendarBlocks("nid-d-ete", "airbnb", [lauraHurterBlock]), [
    lauraHurterBlock,
  ]);
  assert.deepEqual(filterLiveCalendarBlocks("chai-des-tortues", "booking", [lauraHurterBlock]), [
    lauraHurterBlock,
  ]);
});

test("keeps adjacent validated Chai reservations unchanged", () => {
  const reservation = {
    ...lauraHurterBlock,
    uid: "angeline-burlet",
    startsAt: "2026-08-22T00:00:00.000Z",
    endsAt: "2026-08-28T00:00:00.000Z",
  };
  assert.deepEqual(filterLiveCalendarBlocks("chai-des-tortues", "airbnb", [reservation]), [
    reservation,
  ]);
});

test("filters the same stale interval from the Chai Supabase fallback only", () => {
  assert.equal(
    isExcludedCalendarInterval({
      propertySlug: "chai-des-tortues",
      provider: "airbnb",
      startsOn: "2026-08-28",
      endsOn: "2026-09-01",
    }),
    true,
  );
  assert.equal(
    isExcludedCalendarInterval({
      propertySlug: "nid-d-ete",
      provider: "airbnb",
      startsOn: "2026-08-28",
      endsOn: "2026-09-01",
    }),
    false,
  );
});
