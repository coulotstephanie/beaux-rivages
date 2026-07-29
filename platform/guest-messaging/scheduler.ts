import type { MessageScheduleInput } from "./contracts";

export function validateMessageSchedule(input: MessageScheduleInput) {
  if (["cancelled", "declined"].includes(input.reservationStatus)) throw new Error("RESERVATION_INACTIVE");
  if (input.type === "booking_confirmation" && input.reservationStatus !== "confirmed") throw new Error("RESERVATION_NOT_CONFIRMED");
  if (input.type === "booking_confirmation" && !input.paymentValidated) throw new Error("PAYMENT_NOT_VALIDATED");
  if (input.type === "arrival" && !input.accessSecretsAvailable) throw new Error("ARRIVAL_SECRETS_REQUIRED");
  if (input.type === "departure" && input.scheduledDate >= input.data.departureDate) throw new Error("DEPARTURE_MESSAGE_TOO_LATE");
  return {
    idempotencyKey: `${input.data.reservationId}:${input.type}:${input.data.locale}:${input.scheduledDate}`,
    scheduledAt: input.scheduledDate,
    status: "scheduled" as const,
  };
}
