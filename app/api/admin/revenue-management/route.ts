import { NextRequest } from "next/server";
import { authorizeStaff } from "@/platform/auth/server";
import { isDatabaseConfigured } from "@/platform/database/client";
import { noStoreJson, rateLimit } from "@/platform/http/security";
import { RevenueAnalyticsRepository } from "@/features/revenue-management/repositories";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 30);
  if (limited) return limited;
  if (!(await authorizeStaff(request))) {
    return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return noStoreJson({ error: "Base non configurée." }, { status: 503 });
  }
  const year = Number(request.nextUrl.searchParams.get("year") ?? new Date().getFullYear());
  if (!Number.isInteger(year) || year < 2025 || year > 2032) {
    return noStoreJson({ error: "Année invalide." }, { status: 400 });
  }
  try {
    return noStoreJson({
      year,
      properties: await new RevenueAnalyticsRepository().annual(year),
    });
  } catch (error) {
    return noStoreJson(
      {
        error: "Indicateurs indisponibles.",
        code: error instanceof Error ? error.message.split(":")[0] : "UNKNOWN",
      },
      { status: 500 },
    );
  }
}
