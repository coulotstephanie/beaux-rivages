const DAY_MS = 86_400_000;

export type FinancialPolicy = {
  depositPercentage: number;
  fullPaymentThresholdDays: number;
  balanceDueDays: number;
};

export const DEFAULT_FINANCIAL_POLICY: FinancialPolicy = {
  depositPercentage: 30,
  fullPaymentThresholdDays: 15,
  balanceDueDays: 14,
};

export function buildPaymentSchedule(
  arrival: string,
  totalCents: number,
  now = new Date(),
  policy: FinancialPolicy = DEFAULT_FINANCIAL_POLICY,
) {
  const arrivalDate = new Date(`${arrival}T12:00:00Z`);
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12));
  const daysBeforeArrival = Math.ceil((arrivalDate.getTime() - today.getTime()) / DAY_MS);
  const fullPaymentRequired = daysBeforeArrival <= policy.fullPaymentThresholdDays;
  const depositPercentage = fullPaymentRequired ? 100 : policy.depositPercentage;
  const depositDueCents = fullPaymentRequired
    ? totalCents
    : Math.round(totalCents * (policy.depositPercentage / 100));
  const balanceDueCents = totalCents - depositDueCents;
  const balanceDate = new Date(arrivalDate);
  balanceDate.setUTCDate(balanceDate.getUTCDate() - policy.balanceDueDays);
  return {
    depositPercentage,
    depositDueCents,
    balanceDueCents,
    balanceDueDate: fullPaymentRequired ? arrival : balanceDate.toISOString().slice(0, 10),
    fullPaymentRequired,
    daysBeforeArrival,
    fullPaymentThresholdDays: policy.fullPaymentThresholdDays,
    balanceDueDays: policy.balanceDueDays,
  };
}
