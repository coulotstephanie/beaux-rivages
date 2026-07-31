import { NextRequest } from "next/server";
import { amountDue, purposeToKind, type PaymentPurpose } from "@/platform/payments/contracts";
import { configuredStripeMode, StripePaymentAdapter } from "@/platform/payments/stripe";
import { isDatabaseConfigured } from "@/platform/database/client";
import { SupabaseStripePaymentRepository } from "@/platform/database/payments";
import { noStoreJson, rateLimit, requireSameOrigin } from "@/platform/http/security";
import { verifyStayAccessToken } from "@/platform/traveler/access";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 5);
  if (limited) return limited;
  if (!requireSameOrigin(request))
    return noStoreJson({ error: "Origine refusée." }, { status: 403 });
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object")
    return noStoreJson({ error: "Demande invalide." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const purpose = input.purpose as PaymentPurpose;
  if (!token || !["deposit", "full-payment", "balance"].includes(purpose))
    return noStoreJson({ error: "Accès ou type de paiement invalide." }, { status: 400 });
  try {
    const stripeMode = configuredStripeMode();
    if (!stripeMode) {
      return noStoreJson(
        { error: "Le paiement sécurisé attend encore sa configuration complète." },
        { status: 503 },
      );
    }
    const stay = verifyStayAccessToken(token);
    if (!isDatabaseConfigured())
      return noStoreJson({ error: "Base de données non configurée." }, { status: 503 });
    const repository = new SupabaseStripePaymentRepository();
    const reservation = await repository.payableReservation(stay.reservationId, stay.reference);
    const amountCents = amountDue({
      purpose,
      totalCents: reservation.totalCents,
      depositDueCents: reservation.depositDueCents,
      paidCents: reservation.paidCents,
    });
    if (amountCents <= 0) return noStoreJson({ error: "Aucun montant à régler." }, { status: 400 });
    const payment = await repository.createPending({
      reservationId: stay.reservationId,
      kind: purposeToKind(purpose),
      amountCents,
    });
    let session;
    try {
      session = await new StripePaymentAdapter().createCheckout({
        stay,
        purpose,
        amountCents,
        paymentId: payment.id,
        idempotencyKey: payment.idempotency_key,
      });
      await repository.attachSession(payment.id, session);
    } catch (error) {
      await repository.markCreationFailed(
        payment.id,
        error instanceof Error ? error.message : "Unknown error",
      );
      throw error;
    }
    return noStoreJson({ checkoutUrl: session.url, sessionId: session.id, mode: stripeMode });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "payment.checkout.error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    );
    return noStoreJson(
      { error: "Le paiement n’est pas configuré ou ne peut pas être préparé." },
      { status: 503 },
    );
  }
}
