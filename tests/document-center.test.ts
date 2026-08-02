import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the document vault versions supported documents from canonical reservation data", async () => {
  const migration = await readFile(
    "supabase/migrations/20260806100000_document_center.sql",
    "utf8",
  );
  const repository = await readFile("platform/documents/repository.ts", "utf8");
  for (const value of [
    "document_records",
    "document_templates",
    "document_signature_requests",
    "document_deliveries",
    "document_audit_log",
  ])
    assert.match(migration, new RegExp(value));
  assert.match(repository, /reservation_items/);
  assert.match(repository, /reservation_special_requests/);
  assert.match(repository, /payments/);
  assert.match(repository, /content_hash/);
});

test("paid payments create a receipt and legacy documents are imported", async () => {
  const migration = await readFile(
    "supabase/migrations/20260806100000_document_center.sql",
    "utf8",
  );
  assert.match(migration, /create_payment_receipt_document/);
  assert.match(migration, /payment_create_receipt/);
  assert.match(migration, /reservation_documents source/);
  assert.match(migration, /from public\.invoices invoice/);
});

test("signature is provider neutral and destructive actions are audited", async () => {
  const schema = await readFile("platform/documents/schemas.ts", "utf8");
  const repository = await readFile("platform/documents/repository.ts", "utf8");
  const migration = await readFile(
    "supabase/migrations/20260806100000_document_center.sql",
    "utf8",
  );
  assert.match(schema, /prepare_signature/);
  assert.match(migration, /provider text not null default 'none'/);
  assert.match(schema, /reason:z\.string\(\)\.min\(3\)/);
  assert.match(repository, /document_audit_log/);
});

test("the premium center connects admin, CRM, calendar and search securely", async () => {
  const route = await readFile("app/api/admin/documents/route.ts", "utf8");
  const dashboard = await readFile("components/AdminDashboard.tsx", "utf8");
  const crm = await readFile("platform/crm/repository.ts", "utf8");
  const calendar = await readFile("components/admin/AdminCalendarBoard.tsx", "utf8");
  const search = await readFile("app/api/admin/search/route.ts", "utf8");
  assert.match(route, /authorizeStaff/);
  assert.match(route, /requireSameOrigin/);
  assert.match(dashboard, /DocumentCenterAdmin/);
  assert.match(crm, /document_records/);
  assert.match(calendar, /view=documents/);
  assert.match(search, /document_records/);
});
