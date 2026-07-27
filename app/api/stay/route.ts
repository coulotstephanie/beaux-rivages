import { NextRequest } from "next/server";
import { noStoreJson, rateLimit } from "@/platform/http/security";
import { verifyStayAccessToken } from "@/platform/traveler/access";

export function GET(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? request.nextUrl.searchParams.get("token");
  if (!token || token.length > 8_000) return noStoreJson({ error: "Accès au séjour requis." }, { status: 401 });
  try {
    const stay = verifyStayAccessToken(token);
    const arrivalDetails = stay.arrivalDetails && Date.parse(stay.arrivalDetails.availableFrom) <= Date.now()
      ? stay.arrivalDetails
      : stay.arrivalDetails ? { availableFrom: stay.arrivalDetails.availableFrom } : undefined;
    return noStoreJson({ ...stay, arrivalDetails });
  } catch {
    return noStoreJson({ error: "Lien de séjour invalide ou expiré." }, { status: 401 });
  }
}
