import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("les user stories stratégiques sont reliées aux fonctionnalités", () => {
  const stories = readFileSync("docs/01_PRODUCT/UserStories.md", "utf8");
  for (const story of [
    "US-0010",
    "US-0025",
    "US-0032",
    "US-0050",
    "US-0100",
    "US-0200",
  ]) {
    assert.match(stories, new RegExp(story));
  }
  assert.match(stories, /FEATURE-0350/);
  assert.match(stories, /validation humaine est obligatoire/);
});

test("les critères Paiement utilisent l’identifiant stable FEATURE-0002", () => {
  const criteria = readFileSync("docs/ACCEPTANCE_CRITERIA.md", "utf8");
  assert.match(criteria, /## FEATURE-0002 — Paiement/);
  assert.match(criteria, /FEATURE-0005` désigne Housekeeping/);
  for (const risk of [
    "Double paiement concurrent",
    "Reprise après coupure",
    "Paiement expiré",
    "Signature Stripe vérifiée",
    "Stripe Live",
  ]) {
    assert.match(criteria, new RegExp(risk));
  }
});

test("les checklists distinguent les preuves des travaux restants", () => {
  const criteria = readFileSync("docs/ACCEPTANCE_CRITERIA.md", "utf8");
  assert.match(criteria, /- \[x\] Paiement accepté/);
  assert.match(criteria, /- \[ \] Tests E2E navigateur/);
  assert.match(criteria, /- \[ \] Validation humaine obligatoire testée/);
});

