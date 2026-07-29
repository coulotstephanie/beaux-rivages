import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const playbook = readFileSync(
  "docs/05_OPERATIONS/HospitalityPlaybook.md",
  "utf8",
);

test("le Playbook couvre la méthode d’hospitalité", () => {
  for (const section of [
    "Standard d’accueil premium",
    "Les moments qui comptent",
    "Scénarios de communication",
    "Résoudre une situation délicate",
    "Rituels Beaux Rivages",
    "Les conseils de Stéphanie & Bruno",
    "Transmission aux équipes",
    "Qualité et apprentissage",
  ]) {
    assert.match(playbook, new RegExp(section));
  }
});

test("le Playbook n’invente pas les pratiques personnelles", () => {
  assert.match(playbook, /À valider par Stéphanie & Bruno/);
  assert.match(playbook, /nécessitent encore un atelier avec Stéphanie & Bruno/);
  assert.match(playbook, /ne doivent pas être\s+automatisés comme des règles de production/);
});

test("le Playbook reste séparé des procédures confidentielles", () => {
  assert.match(playbook, /ne contient aucun code d’accès/);
  assert.match(playbook, /manuel confidentiel/);
  assert.doesNotMatch(playbook, /\b\d{4,}\b.*code d’accès/i);
});
