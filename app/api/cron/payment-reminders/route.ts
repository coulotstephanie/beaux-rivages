import { NextRequest } from "next/server";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";
import { noStoreJson } from "@/platform/http/security";
import { ConfigurableEmailProvider } from "@/platform/email/contracts";
import { stayEmailTemplates } from "@/platform/email/templates";

function parisDate(offsetDays = 0) {
  const date = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)
    return noStoreJson({ error: "Accès refusé." }, { status: 401 });
  if (!isDatabaseConfigured())
    return noStoreJson({ error: "Base de données non configurée." }, { status: 503 });

  const client = getDatabaseClient();
  const today = parisDate();
  const horizon = parisDate(3);
  const { data: reservations, error } = await client
    .from("reservations")
    .select("id,reference,property_id,arrival,departure,total_cents,quote_snapshot")
    .in("status", ["requested", "pending_payment", "confirmed"]);
  if (error) return noStoreJson({ error: "Lecture impossible." }, { status: 500 });

  let queued = 0;
  for (const reservation of reservations ?? []) {
    const snapshot =
      reservation.quote_snapshot &&
      typeof reservation.quote_snapshot === "object" &&
      !Array.isArray(reservation.quote_snapshot)
        ? reservation.quote_snapshot
        : {};
    const dueDate = typeof snapshot.balanceDueDate === "string" ? snapshot.balanceDueDate : null;
    if (!dueDate || dueDate > horizon) continue;
    const { data: payments } = await client
      .from("payments")
      .select("amount_cents,refunded_cents,status")
      .eq("reservation_id", reservation.id)
      .in("status", ["paid", "authorized", "partially_refunded"]);
    const paid = (payments ?? []).reduce(
      (sum, payment) => sum + payment.amount_cents - payment.refunded_cents,
      0,
    );
    if (paid >= reservation.total_cents) continue;
    const { data: reminder, error: insertError } = await client
      .from("payment_reminders")
      .insert({
        reservation_id: reservation.id,
        kind: "balance",
        channel: "email",
        status: "queued",
        scheduled_for: new Date().toISOString(),
        comment: dueDate < today ? "Solde en retard" : "Échéance du solde à venir",
        idempotency_key: `${reservation.id}-balance-email-${today}`,
      })
      .select("id")
      .single();
    if (insertError || !reminder) continue;
    queued += 1;
    try {
      const [{ data: link }, { data: property }] = await Promise.all([
        client
          .from("reservation_guests")
          .select("guest_id")
          .eq("reservation_id", reservation.id)
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
      const html = stayEmailTemplates.balanceReminder({
        travelerName: guest.first_name,
        propertyName: property?.name ?? "Beaux Rivages",
        arrival: reservation.arrival,
        departure: reservation.departure,
        portalUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.beaux-rivages.com"}/carnet-voyageur`,
      });
      await new ConfigurableEmailProvider().send({
        to: guest.email,
        subject: `Échéance de votre solde · ${reservation.reference}`,
        html,
        idempotencyKey: `${reservation.id}-balance-${today}`,
      });
      await client
        .from("payment_reminders")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", reminder.id);
    } catch (sendError) {
      await client
        .from("payment_reminders")
        .update({
          status: "failed",
          comment:
            sendError instanceof Error ? sendError.message.slice(0, 500) : "Envoi impossible",
        })
        .eq("id", reminder.id);
    }
  }
  return noStoreJson({ ok: true, queued, date: today });
}
