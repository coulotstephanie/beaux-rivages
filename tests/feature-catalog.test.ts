import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const catalog = readFileSync("docs/FEATURE_CATALOG.md", "utf8");

test("le Feature Catalog conserve des identifiants uniques", () => {
  const ids = [...catalog.matchAll(/\| (FEATURE-\d{4}) \|/g)].map((match) => match[1]);
  assert.ok(ids.length >= 40);
  assert.equal(new Set(ids).size, ids.length);
});

test("les fonctions stratégiques conservent leurs identifiants", () => {
  for (const [id, label] of [
    ["FEATURE-0001", "Réservation"],
    ["FEATURE-0002", "Paiement"],
    ["FEATURE-0003", "Contrat"],
    ["FEATURE-0004", "Guest Journey"],
    ["FEATURE-0005", "Housekeeping"],
    ["FEATURE-0006", "Maintenance"],
    ["FEATURE-0007", "Revenue Management"],
    ["FEATURE-0008", "Yield Management"],
    ["FEATURE-0009", "CRM Voyageurs"],
    ["FEATURE-0010", "Dashboard"],
    ["FEATURE-0350", "Assistant IA Voyageur"],
    ["FEATURE-0351", "Assistant IA Hôte"],
    ["FEATURE-0352", "Marketplace"],
    ["FEATURE-0353", "Application Mobile"],
  ]) {
    assert.match(catalog, new RegExp(`\\| ${id} \\| ${label} \\|`));
  }
});

test("le catalogue distingue production, fondations et projets", () => {
  assert.match(catalog, /\| FEATURE-0029 \| Site public premium \| P0 \| Production \|/);
  assert.match(catalog, /\| FEATURE-0001 \| Réservation \| P0 \| Foundation \|/);
  assert.match(catalog, /\| FEATURE-0350 \| Assistant IA Voyageur \| P2 \| Planned \|/);
  assert.match(catalog, /L’état décrit la réalité observable/);
});

