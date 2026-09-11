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

test("la marque Beaux Rivages est distinguée géographiquement", () => {
  const source = readFileSync("app/layout.tsx", "utf8");
  assert.match(source, /Beaux Rivages — Île de Ré et Île d’Oléron/);
  assert.match(source, /"@type": "Brand"/);
  assert.match(source, /Rivedoux-Plage/);
  assert.match(source, /Saint-Georges-d’Oléron/);
});

test("les titres des maisons ciblent leur destination et leur proximité plage", async () => {
  const { createPropertySeo } = await import("../seo");
  const { properties } = await import("../data");
  const titles = Object.fromEntries(
    properties.map((property) => [property.slug, createPropertySeo(property).title]),
  );

  assert.equal(
    titles["chai-des-tortues"],
    "Location Île de Ré | Le Chai des Tortues · Plage 250 m",
  );
  assert.equal(
    titles["villa-raie-manta"],
    "Location Île de Ré | Villa Raie Manta · Vue mer · 8 pers.",
  );
  assert.equal(\n    titles["nid-d-ete"],\n    "Location Île d’Oléron | Le Nid d’Été · Plage · Fort Boyard",\n  );
});
