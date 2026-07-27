import { NextRequest } from "next/server";
import { z } from "zod";
import { isDatabaseConfigured } from "@/platform/database/client";
import { SupabaseAuditRepository } from "@/platform/database/operations";
import { SupabaseStripePaymentRepository } from "@/platform/database/payments";
import { noStoreJson, rateLimit, requireAdmin, requireSameOrigin } from "@/platform/http/security";
import { StripePaymentAdapter } from "@/platform/payments/stripe";

const refundSchema = z.object({
  paymentId: z.string().uuid(),
  amountCents: z.number().int().positive().max(10_000_000).optional(),
  reason: z.string().trim().min(3).max(200),
}).strict();

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 5, 60_000);
  if (limited) return limited;
  if (!requireSameOrigin(request)) return noStoreJson({ error: "Origine non autorisée." }, { status: 403 });
  if (!requireAdmin(request)) return noStoreJson({ error: "Authentification requise." }, { status: 401 });
  if (!isDatabaseConfigured()) return noStoreJson({ error: "Base de données non configurée." }, { status: 503 });
  if (!process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")) return noStoreJson({ error: "Stripe TEST non configuré." }, { status: 503 });
  const parsed = refundSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return noStoreJson({ error: "Demande de remboursement invalide." }, { status: 400 });
  try {
    const repository = new SupabaseStripePaymentRepository();
    const payment = await repository.refundablePayment(parsed.data.paymentId);
    const remaining = payment.amount_cents - payment.refunded_cents;
    const amountCents = parsed.data.amountCents ?? remaining;
    if (amountCents > remaining) return noStoreJson({ error: "Le remboursement dépasse le montant restant." }, { status: 400 });
    const refund = await new StripePaymentAdapter().refund({
      paymentProviderId: payment.provider_payment_id!, amountCents, reason: parsed.data.reason,
    });
    await new SupabaseAuditRepository().record({
      action: "admin.payment.refund_requested", entityType: "payment", entityId: payment.id,
      metadata: { amountCents, refundId: refund.refundId, environment: "test" },
    });
    return noStoreJson({ ok: true, refundId: refund.refundId, status: refund.status, mode: "test" });
  } catch (error) {
    console.error(JSON.stringify({ event: "stripe.refund.failed", message: error instanceof Error ? error.message : "Unknown" }));
    return noStoreJson({ error: "Le remboursement TEST n’a pas pu être créé." }, { status: 502 });
  }
}
