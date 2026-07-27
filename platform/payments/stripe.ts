import Stripe from "stripe";
import type { StayAccessPayload } from "@/platform/traveler/contracts";
import type { PaymentPurpose, RefundGateway } from "./contracts";

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured.");
  if (key.startsWith("sk_live_") && process.env.STRIPE_ALLOW_LIVE !== "true") throw new Error("Live Stripe payments are disabled.");
  return new Stripe(key);
}

export class StripePaymentAdapter implements RefundGateway {
  async createCheckout(input: { stay: StayAccessPayload; purpose: PaymentPurpose; amount: number }) {
    const stripe = stripeClient();
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.beaux-rivages.com";
    return stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: input.stay.contractDetails?.email,
      line_items: [{ quantity: 1, price_data: { currency: "eur", unit_amount: Math.round(input.amount * 100), product_data: { name: `${input.purpose} · ${input.stay.propertyName}`, description: `Réservation ${input.stay.reference}` } } }],
      metadata: { reservationId: input.stay.reservationId, reference: input.stay.reference, purpose: input.purpose },
      success_url: `${site}/carnet-voyageur?payment=success`,
      cancel_url: `${site}/carnet-voyageur?payment=cancelled`,
    });
  }
  async refund(input: { paymentProviderId: string; amount?: number; reason?: string }) {
    const refund = await stripeClient().refunds.create({
      payment_intent: input.paymentProviderId,
      amount: input.amount ? Math.round(input.amount * 100) : undefined,
      metadata: input.reason ? { reason: input.reason.slice(0, 200) } : undefined,
    });
    return { refundId: refund.id, status: refund.status ?? "pending" };
  }
  constructWebhook(payload: string | Buffer, signature: string) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new Error("Stripe webhook is not configured.");
    return stripeClient().webhooks.constructEvent(payload, signature, secret);
  }
}
