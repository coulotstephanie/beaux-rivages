export type PaymentPurpose = "deposit" | "full-payment" | "balance";
export type PaymentKind = "deposit" | "full" | "balance";
export type PaymentRecord = {
  id: string;
  reservationId: string;
  purpose: PaymentPurpose;
  amount: number;
  currency: "EUR";
  provider: "stripe";
  providerId: string;
  status: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
  updatedAt: string;
};
export interface PaymentRepository {
  save(payment: PaymentRecord): Promise<PaymentRecord>;
  findByProviderId(providerId: string): Promise<PaymentRecord | null>;
}
export interface RefundGateway {
  refund(input: { paymentProviderId: string; amountCents?: number; reason?: string }): Promise<{ refundId: string; status: string }>;
}

export function purposeToKind(purpose: PaymentPurpose): PaymentKind {
  return purpose === "full-payment" ? "full" : purpose;
}

export function amountDue(input: { purpose: PaymentPurpose; totalCents: number; depositDueCents: number; paidCents: number }) {
  const remaining = Math.max(0, input.totalCents - input.paidCents);
  if (input.purpose === "deposit") return Math.min(remaining, Math.max(0, input.depositDueCents - input.paidCents));
  return remaining;
}
