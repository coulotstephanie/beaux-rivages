import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("le Product Book référence tous les workflows et événements standards", () => {
  const productBook = readFileSync("docs/PRODUCT_BOOK_07_WORKFLOWS.md", "utf8");
  for (const workflow of [
    "Réservation",
    "Paiement",
    "Contrat",
    "Guest Journey",
    "Housekeeping",
    "Maintenance",
    "CRM",
    "Revenue Management",
    "Concierge",
    "Départ",
    "Fidélisation",
    "Annulation",
    "Incident",
    "Intelligence artificielle",
  ]) {
    assert.match(productBook, new RegExp(workflow));
  }
  for (const event of [
    "ReservationCreated",
    "ReservationConfirmed",
    "PaymentSucceeded",
    "PaymentFailed",
    "ContractSigned",
    "GuestCheckedIn",
    "GuestCheckedOut",
    "CleaningStarted",
    "CleaningCompleted",
    "MaintenanceCreated",
    "MaintenanceClosed",
    "ReviewReceived",
    "LoyaltyUpdated",
  ]) {
    assert.match(productBook, new RegExp(event));
  }
});

test("chaque workflow possède un état de traçabilité explicite", () => {
  const traceability = readFileSync("docs/WORKFLOW_TRACEABILITY.md", "utf8");
  assert.equal((traceability.match(/\| (?:Partiel|Incomplet|Préparé)/g) ?? []).length, 14);
  assert.match(traceability, /platform\/workflows\//);
  assert.match(traceability, /outbox/);
  assert.match(traceability, /idempotence/);
});
