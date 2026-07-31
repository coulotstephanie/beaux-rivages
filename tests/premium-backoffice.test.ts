import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { adminOperationSchema } from "../platform/database/schemas";

test("les actions opérationnelles du Back Office sont validées strictement", () => {
  assert.equal(
    adminOperationSchema.safeParse({
      action: "create_maintenance",
      propertyId: "a94e2cc2-c2b5-4eeb-b0e5-729b4cc0c75f",
      title: "Contrôler le barbecue",
      priority: "high",
    }).success,
    true,
  );
  assert.equal(
    adminOperationSchema.safeParse({
      action: "update_housekeeping",
      taskId: "a94e2cc2-c2b5-4eeb-b0e5-729b4cc0c75f",
      status: "completed",
      checklist: [{ id: "wifi", label: "Contrôle Wi-Fi", done: true, unexpected: true }],
    }).success,
    false,
  );
});

test("la migration protège toutes les données opérationnelles", () => {
  const sql = readFileSync("supabase/migrations/20260729124500_premium_back_office.sql", "utf8");
  for (const table of [
    "security_deposits",
    "housekeeping_tasks",
    "maintenance_incidents",
    "concierge_requests",
    "back_office_notifications",
    "reservation_notes",
  ]) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`));
    assert.match(sql, new RegExp(`'${table}'`));
  }
  assert.match(sql, /current_app_role\(\)/);
});

test("l’API impose authentification, origine et audit", () => {
  const route = readFileSync("app/api/admin/operations/route.ts", "utf8");
  assert.match(route, /authorizeStaff\(request/);
  assert.match(route, /\["admin", "concierge"\]/);
  assert.match(route, /requireSameOrigin\(request\)/);
  assert.match(route, /SupabaseAuditRepository/);
});

test("le calendrier du Back Office affiche les périodes iCal des trois maisons", () => {
  const board = readFileSync("components/admin/AdminCalendarBoard.tsx", "utf8");
  assert.match(board, /api\/calendar\?property=/);
  assert.match(board, /Période indisponible/);
  assert.match(board, /Airbnb · Booking · Réservation directe/);
  assert.match(board, /action: "block_dates"/);
  assert.match(board, /Bloquer des dates/);
  assert.match(board, /Blocage manuel/);
});

test("les réservations annulées disparaissent des listes actives", () => {
  const dashboard = readFileSync("components/AdminDashboard.tsx", "utf8");
  const repository = readFileSync("platform/database/back-office.ts", "utf8");
  assert.match(dashboard, /!\["cancelled", "declined"\]\.includes\(reservation\.status\)/);
  assert.match(repository, /from\("occupancy_blocks"\)/);
  assert.match(repository, /\.eq\("reservation_id", input\.reservationId\)/);
});

test("les réservations refusées disparaissent également du calendrier", () => {
  const board = readFileSync("components/admin/AdminCalendarBoard.tsx", "utf8");
  assert.match(board, /\["cancelled", "declined"\]\.includes\(row\.status\)/);
});
