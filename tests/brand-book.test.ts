import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("le Brand Book conserve la promesse et les règles de voix", () => {
  const brand = readFileSync("docs/BRAND_BOOK.md", "utf8");
  for (const principle of [
    "Trois maisons. Deux îles. Une même passion de l’hospitalité.",
    "chaleureux",
    "jamais commercial",
    "Le conseil de Stéphanie & Bruno",
    "Nous reviendrons",
  ]) {
    assert.match(brand, new RegExp(principle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});

test("les parcours voyageurs parlent d’expériences et d’attentions", () => {
  const composer = readFileSync("components/StayComposer.tsx", "utf8");
  const portal = readFileSync("components/StayPortal.tsx", "utf8");
  const arrival = readFileSync("components/ArrivalChecklist.tsx", "utf8");
  assert.match(composer, /Estimation de vos attentions/);
  assert.match(portal, /Vos expériences/);
  assert.match(portal, /Aucune attention ajoutée/);
  assert.match(arrival, /Choisir le linge et vos attentions/);
  assert.doesNotMatch(composer, /Estimation des options/);
  assert.doesNotMatch(portal, />Vos options</);
});

test("la traçabilité distingue les corrections éditoriales des contrats", () => {
  const traceability = readFileSync("docs/BRAND_TRACEABILITY.md", "utf8");
  assert.match(traceability, /identifiants techniques et contrats API restent inchangés/);
  assert.match(traceability, /contrôle éditorial/);
  assert.match(traceability, /tokens nommés/);
});
