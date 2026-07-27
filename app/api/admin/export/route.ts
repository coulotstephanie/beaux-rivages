import { NextRequest } from "next/server";
import { isDatabaseConfigured } from "@/platform/database/client";
import { SupabaseAdminRepository } from "@/platform/database/operations";
import { rateLimit, requireAdmin } from "@/platform/http/security";

const allowedEntities = ["reservations", "payments", "audit_logs"] as const;

function csvCell(value: unknown) {
  const raw = value == null ? "" : String(value);
  const protectedValue = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return `"${protectedValue.replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 4, 60_000);
  if (limited) return limited;
  if (!requireAdmin(request)) return new Response("Authentification requise.", { status: 401 });
  if (!isDatabaseConfigured()) return new Response("Base de données non configurée.", { status: 503 });

  const requestedEntity = request.nextUrl.searchParams.get("entity");
  if (!allowedEntities.includes(requestedEntity as typeof allowedEntities[number])) {
    return new Response("Export inconnu.", { status: 400 });
  }
  const entity = requestedEntity as typeof allowedEntities[number];
  const rows = await new SupabaseAdminRepository().exportRows(entity);
  const headers = rows[0] ? Object.keys(rows[0]) : [];
  const csv = [
    headers.map(csvCell).join(","),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")),
  ].join("\r\n");
  return new Response(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="beaux-rivages-${entity}.csv"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
