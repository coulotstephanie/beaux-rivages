import assert from "node:assert/strict";
import test from "node:test";
import { airbnbCalendarNightlyRate } from "../platform/pricing/airbnb-calendar-rates";

test("the Airbnb calendar rates are mirrored for the Chai and Villa", () => {
  assert.equal(airbnbCalendarNightlyRate("chai-des-tortues", "2027-05-06"), 342);
  assert.equal(airbnbCalendarNightlyRate("chai-des-tortues", "2027-08-05"), 467);
  assert.equal(airbnbCalendarNightlyRate("chai-des-tortues", "2027-09-15"), 180);
  assert.equal(airbnbCalendarNightlyRate("villa-raie-manta", "2027-02-13"), 335);
  assert.equal(airbnbCalendarNightlyRate("villa-raie-manta", "2027-07-27"), 512);
  assert.equal(airbnbCalendarNightlyRate("villa-raie-manta", "2027-09-15"), 200);
});

test("unavailable Airbnb dates keep the existing Beaux Rivages fallback", () => {
  assert.equal(airbnbCalendarNightlyRate("chai-des-tortues", "2027-07-01"), undefined);
  assert.equal(airbnbCalendarNightlyRate("villa-raie-manta", "2027-08-01"), undefined);
  assert.equal(airbnbCalendarNightlyRate("nid-d-ete", "2027-09-01"), undefined);
});
