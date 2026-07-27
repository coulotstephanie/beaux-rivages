import { NextRequest } from "next/server";
import type { PaymentPurpose } from "@/platform/payments/contracts";
import { StripePaymentAdapter } from "@/platform/payments/stripe";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";
import { verifyStayAccessToken } from "@/platform/traveler/access";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 5);
  if (limited) return limited;
  if (!requireSameOrigin(request)) return noStoreJson({ error: "Origine refusée." }, { status: 403 });
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return noStoreJson({ error: "Demande invalide." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const purpose = input.purpose as PaymentPurpose;
  if (!token || !["deposit", "full-payment", "balance"].includes(purpose)) return noStoreJson({ error: "Accès ou type de paiement invalide." }, { status: 400 });
  try {
    const stay = verifyStayAccessToken(token);
    const depositPercentage = Math.min(100, Math.max(1, Number(process.env.BOOKING_DEPOSIT_PERCENTAGE ?? 30)));
    const total = stay.contractDetails?.total ?? stay.depositPaid + stay.balanceRemaining;
    const amount = purpose === "deposit" ? Math.round(total * depositPercentage) / 100 : purpose === "balance" ? stay.balanceRemaining : total;
    if (amount <= 0) return noStoreJson({ error: "Aucun montant à régler." }, { status: 400 });
    const session = await new StripePaymentAdapter().createCheckout({ stay, purpose, amount });
    return noStoreJson({ checkoutUrl: session.url, sessionId: session.id, mode: process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ? "test" : "disabled" });
  } catch (error) {
    console.error(JSON.stringify({ event: "payment.checkout.error", message: error instanceof Error ? error.message : "Unknown error" }));
    return noStoreJson({ error: "Le paiement de test n’est pas configuré ou ne peut pas être préparé." }, { status: 503 });
  }
}
