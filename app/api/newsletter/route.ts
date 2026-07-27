import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";
import { ConfigurableNewsletterProvider } from "@/platform/newsletter/provider";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 4, 10 * 60_000);
  if (limited) return limited;
  if (!requireSameOrigin(request)) return noStoreJson({ error: "Origine refusée." }, { status: 403 });
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return noStoreJson({ error: "Demande invalide." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const email = String(input.email ?? "").trim().toLowerCase();
  if (!emailPattern.test(email) || input.consent !== true) return noStoreJson({ error: "Email valide et consentement explicite requis." }, { status: 400 });
  try {
    const result = await new ConfigurableNewsletterProvider().requestDoubleOptIn({ email, locale: "fr", source: String(input.source ?? "website").slice(0, 50), consentedAt: new Date().toISOString() });
    console.info(JSON.stringify({ event: "newsletter.optin.requested", emailHash: createHash("sha256").update(email).digest("hex").slice(0, 12) }));
    return noStoreJson(result, { status: 202 });
  } catch {
    return noStoreJson({ error: "La newsletter n’est pas encore activée." }, { status: 503 });
  }
}
