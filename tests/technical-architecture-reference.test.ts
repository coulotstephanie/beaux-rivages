import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("le Product Book 08 conserve les principes et la définition de Done", () => {
  const reference = readFileSync(
    "docs/PRODUCT_BOOK_08_TECHNICAL_ARCHITECTURE.md",
    "utf8",
  );
  for (const principle of [
    "Clean Architecture",
    "Domain Driven Design",
    "SOLID",
    "Feature First",
    "Supabase Auth",
    "80 %",
    "Définition de Done",
  ]) {
    assert.match(reference, new RegExp(principle));
  }
});

test("la convergence technique documente les écarts sans réécriture globale", () => {
  const traceability = readFileSync(
    "docs/TECHNICAL_ARCHITECTURE_TRACEABILITY.md",
    "utf8",
  );
  for (const gap of [
    "Monorepo",
    "Tailwind CSS",
    "React Hook Form",
    "TanStack Query",
    "API `/api/v1`",
    "Couverture",
    "Observabilité",
  ]) {
    assert.match(traceability, new RegExp(gap));
  }
  assert.match(traceability, /aucun déplacement global/);
  assert.match(traceability, /aucune rupture des URL publiques/);
});

test("le catalogue événementiel couvre tous les domaines officiels", () => {
  const catalog = readFileSync("docs/EVENT_CATALOG.md", "utf8");
  for (const event of [
    "ReservationCreated",
    "ReservationCancelled",
    "PaymentSucceeded",
    "ContractSigned",
    "GuestJourneyStarted",
    "GuestSegmentChanged",
    "CleaningCompleted",
    "MaintenanceTicketCreated",
    "PackSignaturePurchased",
    "DailyReportGenerated",
  ]) {
    assert.match(catalog, new RegExp(event));
  }
  assert.match(catalog, /idempotencyKey/);
  assert.match(catalog, /correlationId/);
  assert.match(catalog, /outbox transactionnelle/);
});
