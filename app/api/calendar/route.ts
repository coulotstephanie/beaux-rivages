import { NextRequest } from "next/server";
import { getPropertyAvailability } from "@/platform/calendar/service";
import { isPropertySlug } from "@/platform/calendar/config";
import { noStoreJson, rateLimit } from "@/platform/http/security";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request);
  if (limited) return limited;
  const property = request.nextUrl.searchParams.get("property");
  if (!isPropertySlug(property)) return noStoreJson({ error: "Logement inconnu." }, { status: 400 });
  return noStoreJson(await getPropertyAvailability(property));
}
