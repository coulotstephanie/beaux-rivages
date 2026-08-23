import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { languageAlternates, localizedUrl } from "../seo";

test("les trois langues publiées et x-default ont une URL stable", () => {
  assert.equal(
    localizedUrl("/maisons/nid-d-ete", "de"),
    "https://www.beaux-rivages.com/de/maisons/nid-d-ete",
  );
  assert.deepEqual(Object.keys(languageAlternates("/maisons/nid-d-ete")), [
    "fr",
    "en",
    "de",
    "x-default",
  ]);
});

test("robots protège les espaces privés", () => {
  const source = readFileSync("app/robots.ts", "utf8");
  assert.match(source, /"\/administration"/);
  assert.match(source, /"\/api\/"/);
  assert.match(source, /sitemap: "https:\/\/www\.beaux-rivages\.com\/sitemap\.xml"/);
});

test("le sitemap publie les alternates sans date de fraîcheur artificielle", () => {
  const source = readFileSync("app/sitemap.ts", "utf8");
  assert.match(source, /"x-default"/);
  assert.doesNotMatch(source, /lastModified/);
});
