const DAY_MS = 86_400_000;

export function buildPaymentSchedule(arrival: string, totalCents: number, now = new Date()) {
  const arrivalDate = new Date(`${arrival}T12:00:00Z`);
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12));
  const daysBeforeArrival = Math.ceil((arrivalDate.getTime() - today.getTime()) / DAY_MS);
  const fullPaymentRequired = daysBeforeArrival < 14;
  const depositPercentage: 30 | 100 = fullPaymentRequired ? 100 : 30;
  const depositDueCents = fullPaymentRequired ? totalCents : Math.round(totalCents * 0.3);
  const balanceDueCents = totalCents - depositDueCents;
  const balanceDate = new Date(arrivalDate);
  balanceDate.setUTCDate(balanceDate.getUTCDate() - 14);
  return {
    depositPercentage,
    depositDueCents,
    balanceDueCents,
    balanceDueDate: fullPaymentRequired ? arrival : balanceDate.toISOString().slice(0, 10),
    fullPaymentRequired,
    daysBeforeArrival,
  };
}
