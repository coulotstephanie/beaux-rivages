import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { languageAlternates, localizedUrl } from "../seo";

test("les cinq langues et x-default ont une URL stable", () => {
  assert.equal(
    localizedUrl("/maisons/nid-d-ete", "nl"),
    "https://www.beaux-rivages.com/nl/maisons/nid-d-ete",
  );
  assert.deepEqual(Object.keys(languageAlternates("/maisons/nid-d-ete")), [
    "fr",
    "en",
    "de",
    "es",
    "nl",
    "x-default",
  ]);
});

test("robots protège les espaces privés", () => {
  const source = readFileSync("app/robots.ts", "utf8");
  assert.match(source, /"\/administration"/);
  assert.match(source, /"\/api\/"/);
  assert.match(source, /sitemap: "https:\/\/www\.beaux-rivages\.com\/sitemap\.xml"/);
});

test("le sitemap publie les alternates et une date de mise à jour", () => {
  const source = readFileSync("app/sitemap.ts", "utf8");
  assert.match(source, /"x-default"/);
  assert.match(source, /lastModified/);
});
