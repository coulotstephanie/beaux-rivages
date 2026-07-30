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

test("la stratégie multi-tenant interdit toute activation sans isolation", () => {
  const strategy = readFileSync("docs/MULTI_TENANCY_STRATEGY.md", "utf8");
  for (const foundation of [
    "tenants",
    "brands",
    "accommodations",
    "tenant_memberships",
    "current_tenant_id",
    "RLS tenant-aware",
    "tests anti-fuite",
  ]) {
    assert.match(strategy, new RegExp(foundation, "i"));
  }
  assert.match(strategy, /préparée mais non activée/);
  assert.match(strategy, /aucune valeur `tenant_id` acceptée directement/);
});

test("les permissions cibles sont déclaratives et conservent la compatibilité", () => {
  const permissions = readFileSync("docs/PERMISSIONS_CATALOG.md", "utf8");
  for (const permission of [
    "reservation.read",
    "payment.refund",
    "crm.export",
    "maintenance.assign",
    "channel.manage",
    "analytics.view",
    "staff.manage",
  ]) {
    assert.match(permissions, new RegExp(permission.replace(".", "\\.")));
  }
  assert.match(permissions, /traduire les trois rôles actuels sans modifier leurs droits/);
});

test("la roadmap officielle conserve les dix versions et les blocages V1", () => {
  const roadmap = readFileSync("docs/PRODUCT_BOOK_09_ROADMAP.md", "utf8");
  const traceability = readFileSync("docs/ROADMAP_TRACEABILITY.md", "utf8");
  for (let version = 1; version <= 10; version += 1) {
    assert.match(roadmap, new RegExp(`Version ${version}`));
  }
  for (const priority of ["P0", "P1", "P2", "P3"]) {
    assert.match(roadmap, new RegExp(priority));
  }
  assert.match(traceability, /Blocages de sortie V1/);
  assert.match(traceability, /Stripe TEST/);
  assert.match(traceability, /fournisseur d’e-mails transactionnels/);
  assert.match(traceability, /sauvegarde et exercice de restauration/);
});
