import "server-only";
import { getDatabaseClient } from "@/platform/database/client";
import { ConfigurableEmailProvider } from "@/platform/email/contracts";
import { stayEmailTemplates } from "@/platform/email/templates";

export async function sendPaymentReceipt(input: {
  reservationId: string;
  kind: "deposit" | "balance" | "full";
  paymentId: string;
}) {
  const client = getDatabaseClient();
  const { data: reservation, error } = await client
    .from("reservations")
    .select("reference,property_id,arrival,departure")
    .eq("id", input.reservationId)
    .single();
  if (error) throw new Error(`RESERVATION_READ_FAILED:${error.code}`);
  const [{ data: link }, { data: property }] = await Promise.all([
    client
      .from("reservation_guests")
      .select("guest_id")
      .eq("reservation_id", input.reservationId)
      .eq("is_primary", true)
      .maybeSingle(),
    client.from("properties").select("name").eq("id", reservation.property_id).maybeSingle(),
  ]);
  if (!link) throw new Error("PRIMARY_GUEST_MISSING");
  const { data: guest } = await client
    .from("guests")
    .select("first_name,email")
    .eq("id", link.guest_id)
    .single();
  if (!guest?.email) throw new Error("GUEST_EMAIL_MISSING");
  const emailData = {
    travelerName: guest.first_name,
    propertyName: property?.name ?? "Beaux Rivages",
    arrival: reservation.arrival,
    departure: reservation.departure,
    portalUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.beaux-rivages.com"}/carnet-voyageur`,
  };
  const html =
    input.kind === "deposit"
      ? stayEmailTemplates.depositReceived(emailData)
      : stayEmailTemplates.fullPaymentReceived(emailData);
  return new ConfigurableEmailProvider().send({
    to: guest.email,
    subject:
      input.kind === "deposit"
        ? `Acompte reçu · ${reservation.reference}`
        : `Paiement reçu · ${reservation.reference}`,
    html,
    idempotencyKey: `payment-receipt-${input.paymentId}`,
  });
}
