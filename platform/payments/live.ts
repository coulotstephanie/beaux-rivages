import "server-only";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";
import type { StayAccessPayload } from "@/platform/traveler/contracts";

export async function withLiveFinancials(stay: StayAccessPayload): Promise<StayAccessPayload> {
  if (!isDatabaseConfigured()) return stay;
  const { data, error } = await getDatabaseClient()
    .from("payments")
    .select("amount_cents,refunded_cents,status")
    .eq("reservation_id", stay.reservationId)
    .in("status", ["paid", "authorized", "partially_refunded"]);
  if (error) throw new Error(`PAYMENT_READ_FAILED:${error.code}`);
  const paidCents = (data ?? []).reduce(
    (sum, payment) => sum + payment.amount_cents - payment.refunded_cents,
    0,
  );
  const totalCents = Math.round(
    (stay.contractDetails?.total ?? stay.depositPaid + stay.balanceRemaining) * 100,
  );
  const depositDueCents = Math.round((stay.contractDetails?.depositDue ?? stay.depositPaid) * 100);
  return {
    ...stay,
    depositPaid: Math.min(depositDueCents, paidCents) / 100,
    balanceRemaining: Math.max(0, totalCents - paidCents) / 100,
    contractDetails: stay.contractDetails
      ? {
          ...stay.contractDetails,
          balanceDue: Math.max(0, totalCents - paidCents) / 100,
        }
      : undefined,
  };
}
