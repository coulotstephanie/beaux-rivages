import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const baseUrl = process.env.LOT1_BASE_URL ?? "http://127.0.0.1:3100";
const allLocales = ["fr", "en", "de", "es", "nl"];
const locales = process.env.LOT1_LOCALES
  ? process.env.LOT1_LOCALES.split(",").filter((locale) => allLocales.includes(locale))
  : allLocales;
const allPages = [
  { name: "home", path: "/", images: 11 },
  { name: "chai", path: "/maisons/chai-des-tortues", images: 49 },
  { name: "villa", path: "/maisons/villa-raie-manta", images: 57 },
  { name: "nid", path: "/maisons/nid-d-ete", images: 58 },
];
const requestedPages = process.env.LOT1_PAGES?.split(",");
const pages = requestedPages ? allPages.filter((page) => requestedPages.includes(page.name)) : allPages;
const invariants = new Set([
  "Beaux Rivages",
  "Le Chai des Tortues",
  "Villa Raie Manta",
  "Le Nid d’Été",
  "Stéphanie & Bruno",
  "Île de Ré",
  "Île d’Oléron",
  "Fort Boyard",
  "Le Chai des Tortues, Rivedoux-Plage | Beaux Rivages",
  "Villa Raie Manta, Rivedoux-Plage | Beaux Rivages",
  "Le Nid d’Été, Boyardville | Beaux Rivages",
  "Le Chai des Tortues · Rivedoux-Plage · Île de Ré",
  "Villa Raie Manta · Rivedoux-Plage · Île de Ré",
  "Le Nid d’Été · Boyardville · Île d’Oléron",
  "Français",
  "English",
  "Deutsch",
  "Español",
  "Nederlands",
  "«",
  "»",
]);

const catalogs = Object.fromEntries(
  await Promise.all(
    allLocales
      .filter((locale) => locale !== "fr")
      .map(async (locale) => [
        locale,
        JSON.parse(await readFile(new URL(`../i18n/translations/${locale}.json`, import.meta.url))),
      ]),
  ),
);

function localizedPath(locale, path) {
  if (locale === "fr") return path;
  return `/${locale}${path === "/" ? "" : path}`;
}

function productionUrl(locale, path) {
  return `https://www.beaux-rivages.com${localizedPath(locale, path) === "/" ? "" : localizedPath(locale, path)}`;
}

function initialDocument(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
}

function linkTags(document) {
  return document.match(/<link\b[^>]*>/gi) ?? [];
}

function hasLink(document, attributes) {
  return linkTags(document).some((tag) =>
    Object.entries(attributes).every(([name, value]) => {
      const match = tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
      return match?.[1] === value;
    }),
  );
}

for (const locale of locales) {
  for (const page of pages) {
    const path = localizedPath(locale, page.path);
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 200, `${locale}/${page.name}: HTTP ${response.status}`);
    const html = await response.text();
    const document = initialDocument(html);
    assert.match(document, new RegExp(`<html lang=["']${locale}["']`), `${locale}/${page.name}: lang`);
    assert.equal((document.match(/<img\b/g) ?? []).length, page.images, `${locale}/${page.name}: images`);
    assert.ok(
      hasLink(document, { rel: "canonical", href: productionUrl(locale, page.path) }),
      `${locale}/${page.name}: canonical`,
    );
    for (const alternate of allLocales) {
      assert.ok(
        hasLink(document, { rel: "alternate", hrefLang: alternate, href: productionUrl(alternate, page.path) }),
        `${locale}/${page.name}: hreflang ${alternate}`,
      );
    }
    assert.ok(
      hasLink(document, { rel: "alternate", hrefLang: "x-default", href: productionUrl("fr", page.path) }),
      `${locale}/${page.name}: x-default`,
    );

    if (locale !== "fr") {
      const residual = Object.entries(catalogs[locale])
        .filter(([source, translation]) => source !== translation && !invariants.has(source))
        .map(([source]) => source)
        .filter((source) => document.includes(`>${source}<`) || document.includes(`="${source}"`));
      assert.deepEqual(residual, [], `${locale}/${page.name}: français résiduel: ${residual.join(" | ")}`);
    }
    console.log(`✓ ${locale.padEnd(2)} ${page.name.padEnd(5)} HTTP 200 · ${page.images} images`);
  }
}

console.log("Lot 1 runtime audit passed.");
