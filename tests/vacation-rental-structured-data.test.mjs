import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const seo = readFileSync(new URL("../seo.ts", import.meta.url), "utf8");

test("vacation rental schema nests accommodation details as required by Google", () => {
  assert.match(seo, /"@type": "VacationRental"/);
  assert.match(seo, /identifier: `beaux-rivages:\$\{property\.slug\}`/);
  assert.match(
    seo,
    /containsPlace: \{[\s\S]*?"@type": "Accommodation"[\s\S]*?occupancy: \{[\s\S]*?value: capacity/,
  );
  assert.match(seo, /numberOfBedrooms: bedrooms/);
  assert.match(seo, /numberOfBathroomsTotal: bathrooms/);
  assert.match(seo, /additionalType: "EntirePlace"/);
});

test("vacation rental amenities use Google-supported English feature names", () => {
  for (const feature of [
    "beachAccess",
    "childFriendly",
    "crib",
    "heating",
    "kitchen",
    "microwave",
    "ovenStove",
    "petsAllowed",
    "selfCheckinCheckout",
    "tv",
    "wifi",
    "internetType",
    "parkingType",
  ]) {
    assert.match(seo, new RegExp(feature));
  }
  assert.doesNotMatch(seo, /group\.items\.map\(\(item\).*LocationFeatureSpecification/s);
});

test("vacation rental schema keeps precise location unpublished pending approval", () => {
  assert.doesNotMatch(seo, /streetAddress|postalCode|latitude|longitude/);
});
