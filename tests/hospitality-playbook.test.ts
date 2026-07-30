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
    "Les standards invisibles",
    "Les attentions Beaux Rivages",
    "Les moments qui comptent",
    "Scénarios de communication",
    "Résoudre une situation délicate",
    "Rituels Beaux Rivages",
    "Les conseils de Stéphanie & Bruno",
    "Transmission aux équipes",
    "Qualité et apprentissage",
    "Notre promesse",
  ]) {
    assert.match(playbook, new RegExp(section));
  }
});

test("le Playbook n’invente pas les pratiques personnelles", () => {
  assert.match(playbook, /À valider par Stéphanie & Bruno/);
  assert.match(playbook, /nécessitent encore un atelier avec Stéphanie & Bruno/);
  assert.match(playbook, /ne doivent pas être\s+automatisés comme des règles de production/);
});

test("le Playbook porte les engagements et le vécu Beaux Rivages", () => {
  assert.match(playbook, /Les dix engagements Beaux Rivages/);
  assert.match(playbook, /Nous n’accueillons pas un numéro de réservation/);
  assert.match(playbook, /Huîtres et Ma Ré/);
  assert.match(playbook, /La Martinière/);
  assert.match(playbook, /date de revalidation/);
});

test("la future Academy reste un blueprint non activé", () => {
  const academy = readFileSync(
    "docs/05_OPERATIONS/AcademyBlueprint.md",
    "utf8",
  );
  assert.match(academy, /aucune Academy opérationnelle/);
  assert.match(academy, /Hospitalité Beaux Rivages/);
  assert.match(academy, /Sécurité et confidentialité/);
  assert.match(academy, /Avant tout développement logiciel/);
});

test("le Playbook reste séparé des procédures confidentielles", () => {
  assert.match(playbook, /ne contient aucun code d’accès/);
  assert.match(playbook, /manuel confidentiel/);
  assert.doesNotMatch(playbook, /\b\d{4,}\b.*code d’accès/i);
});
