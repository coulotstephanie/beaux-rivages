import type { BookingSelection } from "@/booking";

export type ReservationStatus = "draft" | "requested" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "not-required" | "pending" | "authorized" | "paid" | "refunded";
export type Reservation = {
  id: string;
  reference: string;
  travelerId: string;
  selection: BookingSelection;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
};
export interface ReservationRepository {
  getById(id: string): Promise<Reservation | null>;
  listForTraveler(travelerId: string): Promise<Reservation[]>;
  save(reservation: Reservation): Promise<Reservation>;
}
export interface PaymentGateway {
  createCheckout(reservation: Reservation): Promise<{ url: string; externalId: string }>;
}
export type PaymentMethod = "stripe" | "bank-transfer" | "cash" | "holiday-vouchers";
export interface PaymentMethodAdapter {
  readonly method: PaymentMethod;
  readonly enabled: boolean;
  prepare(reservation: Reservation): Promise<{ status: "disabled" | "prepared"; instructions?: string }>;
}
