import { NextRequest } from "next/server";
import { noStoreJson, rateLimit, requireAdmin } from "@/platform/http/security";
import { getIntegrationStatuses } from "@/platform/integrations/status";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  if (!requireAdmin(request)) return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  return noStoreJson({ integrations: getIntegrationStatuses() });
}
