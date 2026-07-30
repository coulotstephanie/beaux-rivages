import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const routes = ["", "ma-journee", "taches", "activite", "supervision", "calendriers", "tarifs", "voyageurs", "communications", "contenus", "parametres"];
const components = [
  "PremiumDashboard",
  "ProfessionalCalendar",
  "PricingStudio",
  "GuestCrm",
  "CommunicationCenter",
  "InternalCms",
  "SettingsCenter",
  "MyDay",
  "OperationsTasks",
  "OperationsTimeline",
  "CommandCenter",
];

test("les onze écrans du Back Office 1.1 sont disponibles", () => {
  for (const route of routes) {
    assert.equal(existsSync(`app/administration/${route ? `${route}/` : ""}page.tsx`), true);
  }
});

test("les composants métier sont exportés depuis une façade unique", () => {
  const exports = readFileSync("features/back-office/index.ts", "utf8");
  for (const component of components) assert.match(exports, new RegExp(`export \\{ ${component} \\}`));
});

test("l’expérience premium prévoit thème, recherche et raccourcis", () => {
  const shell = readFileSync("features/back-office/components/BackOfficeShell.tsx", "utf8");
  assert.match(shell, /br-back-office-theme/);
  assert.match(shell, /metaKey \|\| event\.ctrlKey/);
  assert.match(shell, /Recherche globale/);
  assert.match(shell, /Notifications importantes/);
});

test("les intégrations sensibles restent explicitement non connectées", () => {
  const settings = readFileSync("features/back-office/components/SettingsCenter.tsx", "utf8");
  const communications = readFileSync("features/back-office/components/CommunicationCenter.tsx", "utf8");
  assert.match(settings, /Aucun fournisseur connecté/);
  assert.match(settings, /Les secrets ne sont jamais affichés/);
  assert.doesNotMatch(settings + communications, /createClient|STRIPE_SECRET|SUPABASE_SERVICE_ROLE/);
});

test("communication et paramètres couvrent envois et permissions", () => {
  const communication = readFileSync("features/back-office/components/CommunicationCenter.tsx", "utf8");
  const settings = readFileSync("features/back-office/components/SettingsCenter.tsx", "utf8");
  assert.match(communication, /Envoi individuel/);
  assert.match(communication, /Envoi groupé/);
  assert.match(settings, /Permissions par rôle/);
  for (const permission of ["Réservations", "Tarifs", "Voyageurs", "Communications", "CMS", "Paramètres"]) assert.match(settings, new RegExp(permission));
});
