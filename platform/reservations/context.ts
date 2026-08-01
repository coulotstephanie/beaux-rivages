export type ReservationServiceKind = "option" | "experience" | "basket";

export type ReservationServiceItem = {
  kind: ReservationServiceKind;
  code: string;
  label: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
};

export type ReservationSpecialRequests = {
  occasion: string | null;
  message: string | null;
  allergies: string | null;
  lateArrival: string | null;
};

export function serviceKind(code: string): ReservationServiceKind {
  if (["aperitif-basket", "basket", "signature-aperitif", "signature-sweet"].includes(code))
    return "basket";
  return "option";
}

export function reservationServiceItems(
  optionLines: { id: string; label: string; quantity: number; unitPrice: number; total: number }[],
  experienceLines: {
    id: string;
    label: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[],
): ReservationServiceItem[] {
  return [
    ...optionLines.map((line) => ({
      kind: serviceKind(line.id),
      code: line.id,
      label: line.label,
      quantity: line.quantity,
      unitPriceCents: Math.round(line.unitPrice * 100),
      totalCents: Math.round(line.total * 100),
    })),
    ...experienceLines.map((line) => ({
      kind: "experience" as const,
      code: line.id,
      label: line.label,
      quantity: line.quantity,
      unitPriceCents: Math.round(line.unitPrice * 100),
      totalCents: Math.round(line.total * 100),
    })),
  ];
}
