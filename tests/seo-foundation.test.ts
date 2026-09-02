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


test("les titres des maisons ciblent leur destination et leur proximité plage", async () => {
  const { createPropertySeo } = await import("../seo");
  const { properties } = await import("../data");
  const titles = Object.fromEntries(
    properties.map((property) => [property.slug, createPropertySeo(property).title]),
  );

  assert.equal(
    titles["chai-des-tortues"],
    "Le Chai des Tortues | Location Île de Ré à 250 m de la plage",
  );
  assert.equal(
    titles["villa-raie-manta"],
    "Villa Raie Manta | Villa vue mer Île de Ré, plage à pied",
  );
  assert.equal(
    titles["nid-d-ete"],
    "Le Nid d’Été | Location Île d’Oléron, plage à 20 m",
  );
});
