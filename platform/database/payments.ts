import "server-only";
import type Stripe from "stripe";
import type { Json } from "./database.types";
import { getDatabaseClient } from "./client";
import type { PaymentKind } from "@/platform/payments/contracts";

export class SupabaseStripePaymentRepository {
  private client = getDatabaseClient();

  async payableReservation(reservationId: string, reference: string) {
    const { data: reservation, error } = await this.client.from("reservations")
      .select("id,reference,status,total_cents,deposit_due_cents,currency")
      .eq("id", reservationId).eq("reference", reference).single();
    if (error) throw new Error(`PAYABLE_RESERVATION_FAILED:${error.code}`);
    if (["cancelled", "declined", "completed"].includes(reservation.status)) throw new Error("RESERVATION_NOT_PAYABLE");
    const { data: payments, error: paymentError } = await this.client.from("payments")
      .select("amount_cents,refunded_cents,status")
      .eq("reservation_id", reservation.id);
    if (paymentError) throw new Error(`PAYMENT_TOTAL_FAILED:${paymentError.code}`);
    const paidCents = (payments ?? []).filter((payment) => ["paid", "authorized", "partially_refunded", "refunded"].includes(payment.status))
      .reduce((sum, payment) => sum + payment.amount_cents - payment.refunded_cents, 0);
    return {
      id: reservation.id, reference: reservation.reference, totalCents: reservation.total_cents,
      depositDueCents: reservation.deposit_due_cents, paidCents, currency: reservation.currency,
    };
  }

  async createPending(input: { reservationId: string; kind: PaymentKind; amountCents: number }) {
    const { data, error } = await this.client.from("payments").insert({
      reservation_id: input.reservationId, provider: "stripe", kind: input.kind,
      status: "pending", currency: "EUR", amount_cents: input.amountCents,
      idempotency_key: crypto.randomUUID(), provider_payload: { environment: "test" },
    }).select("id,idempotency_key").single();
    if (error) throw new Error(`PAYMENT_CREATE_FAILED:${error.code}`);
    return data;
  }

  async attachSession(paymentId: string, session: Stripe.Checkout.Session) {
    const { error } = await this.client.from("payments").update({
      provider_session_id: session.id,
      provider_payment_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
      provider_payload: { checkoutSessionId: session.id, checkoutUrlCreated: true },
    }).eq("id", paymentId);
    if (error) throw new Error(`PAYMENT_SESSION_FAILED:${error.code}`);
  }

  async markCreationFailed(paymentId: string, message: string) {
    const { error } = await this.client.from("payments").update({
      status: "failed", failure_code: "checkout_creation_failed", failure_message: message.slice(0, 500),
    }).eq("id", paymentId);
    if (error) throw new Error(`PAYMENT_FAILURE_WRITE_FAILED:${error.code}`);
  }

  async claimEvent(event: Stripe.Event) {
    const { data, error } = await this.client.rpc("claim_payment_event", {
      event_provider: "stripe", event_id: event.id, event_name: event.type,
      event_payload: { id: event.id, type: event.type, livemode: event.livemode, created: event.created },
    });
    if (error) throw new Error(`PAYMENT_EVENT_CLAIM_FAILED:${error.code}`);
    return data;
  }

  async completeEvent(eventRecordId: string, input: { status: "processed" | "failed" | "ignored"; paymentId?: string; error?: string }) {
    const { error } = await this.client.from("payment_events").update({
      status: input.status, payment_id: input.paymentId, error_message: input.error?.slice(0, 500),
      processed_at: new Date().toISOString(),
    }).eq("id", eventRecordId);
    if (error) throw new Error(`PAYMENT_EVENT_COMPLETE_FAILED:${error.code}`);
  }

  async paymentIdFromSession(session: Stripe.Checkout.Session) {
    const metadataId = session.metadata?.paymentId;
    if (metadataId) return metadataId;
    const { data, error } = await this.client.from("payments").select("id").eq("provider_session_id", session.id).maybeSingle();
    if (error) throw new Error(`PAYMENT_SESSION_LOOKUP_FAILED:${error.code}`);
    return data?.id ?? null;
  }

  async markPaid(paymentId: string, providerPaymentId: string | null, payload: Record<string, unknown>) {
    const { data: payment, error } = await this.client.from("payments").update({
      status: "paid", provider_payment_id: providerPaymentId, paid_at: new Date().toISOString(),
      failure_code: null, failure_message: null, provider_payload: payload as Json,
    }).eq("id", paymentId).select("id,reservation_id").single();
    if (error) throw new Error(`PAYMENT_PAID_FAILED:${error.code}`);
    await this.refreshReservation(payment.reservation_id);
    return payment.id;
  }

  async markFailedByPaymentIntent(providerPaymentId: string, code?: string, message?: string) {
    const { data, error } = await this.client.from("payments").update({
      status: "failed", failure_code: code?.slice(0, 100), failure_message: message?.slice(0, 500),
    }).eq("provider_payment_id", providerPaymentId).select("id").maybeSingle();
    if (error) throw new Error(`PAYMENT_FAILED_FAILED:${error.code}`);
    return data?.id ?? null;
  }

  async markExpired(session: Stripe.Checkout.Session) {
    const paymentId = await this.paymentIdFromSession(session);
    if (!paymentId) return null;
    const { error } = await this.client.from("payments").update({
      status: "cancelled", failure_code: "checkout_expired", failure_message: "La session de paiement a expiré.",
    }).eq("id", paymentId);
    if (error) throw new Error(`PAYMENT_EXPIRED_FAILED:${error.code}`);
    return paymentId;
  }

  async applyRefund(providerPaymentId: string, refundedCents: number) {
    const { data: current, error: readError } = await this.client.from("payments")
      .select("id,reservation_id,amount_cents").eq("provider_payment_id", providerPaymentId).maybeSingle();
    if (readError) throw new Error(`REFUND_PAYMENT_READ_FAILED:${readError.code}`);
    if (!current) return null;
    const bounded = Math.min(current.amount_cents, Math.max(0, refundedCents));
    const { error } = await this.client.from("payments").update({
      refunded_cents: bounded, status: bounded >= current.amount_cents ? "refunded" : "partially_refunded",
    }).eq("id", current.id);
    if (error) throw new Error(`REFUND_PAYMENT_WRITE_FAILED:${error.code}`);
    await this.refreshReservation(current.reservation_id);
    return current.id;
  }

  async refundablePayment(paymentId: string) {
    const { data, error } = await this.client.from("payments")
      .select("id,provider_payment_id,amount_cents,refunded_cents,status")
      .eq("id", paymentId).single();
    if (error) throw new Error(`REFUNDABLE_PAYMENT_FAILED:${error.code}`);
    if (!data.provider_payment_id || !["paid", "partially_refunded"].includes(data.status)) throw new Error("PAYMENT_NOT_REFUNDABLE");
    return data;
  }

  private async refreshReservation(reservationId: string) {
    const { data: reservation, error: reservationError } = await this.client.from("reservations")
      .select("id,status,total_cents,deposit_due_cents").eq("id", reservationId).single();
    if (reservationError) throw new Error(`RESERVATION_PAYMENT_REFRESH_FAILED:${reservationError.code}`);
    if (["cancelled", "declined", "completed"].includes(reservation.status)) return;
    const { data: payments, error } = await this.client.from("payments")
      .select("amount_cents,refunded_cents,status").eq("reservation_id", reservationId);
    if (error) throw new Error(`RESERVATION_PAYMENT_TOTAL_FAILED:${error.code}`);
    const netPaid = (payments ?? []).filter((payment) => ["paid", "partially_refunded", "refunded"].includes(payment.status))
      .reduce((sum, payment) => sum + payment.amount_cents - payment.refunded_cents, 0);
    const status = netPaid >= reservation.deposit_due_cents ? "confirmed" : "pending_payment";
    const { error: updateError } = await this.client.from("reservations").update({
      status, confirmed_at: status === "confirmed" ? new Date().toISOString() : null,
    }).eq("id", reservationId);
    if (updateError) throw new Error(`RESERVATION_PAYMENT_STATUS_FAILED:${updateError.code}`);
  }
}
