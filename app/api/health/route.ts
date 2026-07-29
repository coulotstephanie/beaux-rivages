import { NextResponse } from "next/server";

import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkedAt = new Date().toISOString();
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { status: "unavailable", checks: { database: "not_configured" }, checkedAt },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const startedAt = performance.now();
  const { error } = await getDatabaseClient().from("properties").select("id").limit(1);
  const databaseLatencyMs = Math.round(performance.now() - startedAt);
  const healthy = !error;

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      checks: { database: healthy ? "reachable" : "unreachable", databaseLatencyMs },
      checkedAt,
    },
    {
      status: healthy ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
