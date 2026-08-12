import assert from "node:assert/strict";
import test from "node:test";
import { lot1ByLocale, lot1Entries, lot1Translate } from "../i18n/lot1";
import { lot1Locales } from "../i18n/lot1/types";

test("les cinq catalogues Lot 1 possèdent exactement les mêmes clés", () => {
  const expected = Object.keys(lot1Entries).sort();
  for (const locale of lot1Locales)
    assert.deepEqual(Object.keys(lot1ByLocale[locale]).sort(), expected);
});

test("aucune traduction du Lot 1 n’est vide et les variables restent synchronisées", () => {
  for (const [key, entry] of Object.entries(lot1Entries)) {
    const frVariables = [...entry.fr.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]).sort();
    for (const locale of lot1Locales) {
      assert.ok(entry[locale].trim(), `${locale}.${key} est vide`);
      assert.deepEqual(
        [...entry[locale].matchAll(/\{([^}]+)\}/g)].map((match) => match[1]).sort(),
        frVariables,
        `${locale}.${key} a des variables différentes`,
      );
    }
  }
});

test("les citations traduites signalent discrètement leur langue source", () => {
  for (const [key, entry] of Object.entries(lot1Entries)) {
    if (!key.includes(".review.") && !key.includes(".guestbook.")) continue;
    if (entry.decision === "already-correct") continue;
    assert.match(entry.en, /\(translated from French\)$/);
    assert.match(entry.de, /\(aus dem Französischen übersetzt\)$/);
    assert.match(entry.es, /\(traducido del francés\)$/);
    assert.match(entry.nl, /\(vertaald uit het Frans\)$/);
  }
});

test("les contenus dynamiques interpolent les faits sans les modifier", () => {
  assert.equal(
    lot1Translate("en", "reviews.trustedTravelers", { count: 67 }),
    "More than 67 guests have already trusted us with their stay in this house.",
  );
  assert.equal(
    lot1Translate("nl", "reviews.bookingScore", { score: "9,2", count: 15 }),
    "9,2/10 · 15 beoordelingen op Booking.com",
  );
});
