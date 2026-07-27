import { NextRequest } from "next/server";
import { StripePaymentAdapter } from "@/platform/payments/stripe";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });
  try {
    const event = new StripePaymentAdapter().constructWebhook(await request.text(), signature);
    console.info(JSON.stringify({ event: "stripe.webhook.received", type: event.type, id: event.id }));
    // Le futur PaymentRepository rendra cette opération idempotente et mettra à jour
    // l’acompte, le solde ou le remboursement de la réservation.
    return Response.json({ received: true });
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }
}
