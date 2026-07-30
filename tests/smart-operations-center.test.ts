import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("Ma journée couvre chaque action opérationnelle demandée", () => {
  const page = read("features/back-office/components/MyDay.tsx");
  for (const item of ["Arrivées", "Départs", "Ménage", "Contrats", "Paiements", "Voyageurs", "Contrôle", "Anniversaire", "Météo", "Marées", "Alerte importante"]) {
    assert.match(page, new RegExp(item));
  }
  assert.match(page, /href:/);
});

test("le gestionnaire expose tous les types, statuts et priorités", () => {
  const tasks = read("features/back-office/components/OperationsTasks.tsx");
  for (const type of ["Ménage", "Maintenance", "Courses", "Appel client", "Relance", "Préparation Pack Signature", "Contrôle qualité"]) assert.match(tasks, new RegExp(type));
  for (const status of ["À faire", "En cours", "Terminé"]) assert.match(tasks, new RegExp(status));
  for (const priority of ["Basse", "Normale", "Haute", "Urgente"]) assert.match(tasks, new RegExp(priority));
});

test("les huit modèles de checklist sont présents et interactifs", () => {
  const tasks = read("features/back-office/components/OperationsTasks.tsx");
  for (const checklist of ["Arrivée", "Départ", "Ménage", "Contrôle qualité", "Hivernage", "Ouverture saison", "Décoration Noël", "Décoration Halloween"]) assert.match(tasks, new RegExp(checklist));
  assert.match(tasks, /type="checkbox"/);
  assert.match(tasks, /Modifier le modèle/);
});

test("timeline, recherche et notifications couvrent les sources prévues", () => {
  const timeline = read("features/back-office/components/OperationsTimeline.tsx");
  const shell = read("features/back-office/components/BackOfficeShell.tsx");
  for (const kind of ["Paiements", "Emails", "Réservations", "SMS", "Contrats", "Interventions", "Notes", "Modifications"]) assert.match(timeline, new RegExp(kind));
  for (const result of ["Voyageur", "Réservation", "Article du Carnet", "Document signé"]) assert.match(shell, new RegExp(result));
  for (const notification of ["Paiement à relancer", "Nouvelle réservation", "Erreur de synchronisation"]) assert.match(shell, new RegExp(notification));
});

test("le Command Center supervise les huit indicateurs métier", () => {
  const command = read("features/back-office/components/CommandCenter.tsx");
  for (const metric of ["Occupation", "Revenus du mois", "Arrivées", "Départs", "Incidents", "Tâches", "Communications", "Paiements"]) assert.match(command, new RegExp(metric));
});
