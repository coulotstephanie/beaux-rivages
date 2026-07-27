import { NextRequest } from "next/server";
import type Stripe from "stripe";
import { isDatabaseConfigured } from "@/platform/database/client";
import { SupabaseStripePaymentRepository } from "@/platform/database/payments";
import { StripePaymentAdapter } from "@/platform/payments/stripe";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });
  if (!isDatabaseConfigured()) return new Response("Database unavailable", { status: 503 });
  let event: Stripe.Event;
  try {
    event = new StripePaymentAdapter().constructWebhook(await request.text(), signature);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const repository = new SupabaseStripePaymentRepository();
  let eventRecordId: string | null = null;
  let paymentId: string | null = null;
  try {
    eventRecordId = await repository.claimEvent(event);
    if (!eventRecordId) return Response.json({ received: true, duplicate: true });
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      paymentId = await repository.paymentIdFromSession(session);
      if (!paymentId) throw new Error("PAYMENT_NOT_FOUND");
      if (session.payment_status === "paid") {
        await repository.markPaid(paymentId, typeof session.payment_intent === "string" ? session.payment_intent : null, {
          checkoutSessionId: session.id, paymentStatus: session.payment_status, eventId: event.id,
        });
      }
    } else if (event.type === "checkout.session.expired") {
      paymentId = await repository.markExpired(event.data.object);
    } else if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;
      paymentId = intent.metadata.paymentId ?? null;
      if (!paymentId) throw new Error("PAYMENT_NOT_FOUND");
      await repository.markPaid(paymentId, intent.id, { paymentIntentId: intent.id, eventId: event.id });
    } else if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object;
      paymentId = await repository.markFailedByPaymentIntent(intent.id, intent.last_payment_error?.code, intent.last_payment_error?.message);
    } else if (event.type === "charge.refunded") {
      const charge = event.data.object;
      const intentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
      if (intentId) paymentId = await repository.applyRefund(intentId, charge.amount_refunded);
    } else {
      await repository.completeEvent(eventRecordId, { status: "ignored" });
      return Response.json({ received: true, ignored: true });
    }
    await repository.completeEvent(eventRecordId, { status: "processed", paymentId: paymentId ?? undefined });
    console.info(JSON.stringify({ event: "stripe.webhook.processed", type: event.type, id: event.id, paymentId }));
    return Response.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (eventRecordId) await repository.completeEvent(eventRecordId, { status: "failed", paymentId: paymentId ?? undefined, error: message }).catch(() => undefined);
    console.error(JSON.stringify({ event: "stripe.webhook.failed", type: event.type, id: event.id, message }));
    return new Response("Webhook processing failed", { status: 500 });
  }
}
