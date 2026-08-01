"use client";

import { useState } from "react";
import type { BookingSelection } from "@/booking";
import type { Property } from "@/data";
import type { BookingQuote } from "./PriceSummary";
import { trackEvent } from "@/platform/analytics/events";

type BookingResult = {
  reference?: string;
  message?: string;
  error?: string;
  paymentMethod?: "bank_transfer" | "holiday_vouchers";
};

export function DirectBookingForm({
  selection,
  property,
  quote,
  sourcesHealthy,
  onSuccess,
}: {
  selection: BookingSelection;
  property: Property;
  quote: BookingQuote;
  sourcesHealthy: boolean;
  onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [result, setResult] = useState<BookingResult>({});

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setResult({});
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertySlug: property.slug,
        arrival: selection.arrival,
        departure: selection.departure,
        ...selection.guests,
        options: selection.options,
        experiences: selection.experiences,
        specialRequests: {
          occasion: selection.attention,
          message: selection.attentionMessage || null,
          allergies: null,
          lateArrival: null,
        },
        guest: {
          firstName: String(data.get("firstName") ?? ""),
          lastName: String(data.get("lastName") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? "") || undefined,
          countryCode: "FR",
        },
        idempotencyKey: crypto.randomUUID(),
        paymentMethod: String(data.get("paymentMethod")),
        termsAccepted: data.get("termsAccepted") === "on",
        cancellationAccepted: data.get("cancellationAccepted") === "on",
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as BookingResult;
    setResult(payload);
    setStatus(response.ok ? "success" : "error");
    if (response.ok) {
      onSuccess?.();
      trackEvent("booking_request_submitted", {
        property_slug: property.slug,
        total: quote.total,
      });
      trackEvent("booking_completed", { property_slug: property.slug });
    }
  }

  if (status === "success") {
    return (
      <section className="direct-booking-success" role="status" aria-live="polite">
        <span aria-hidden="true">✓</span>
        <p className="eyebrow">Demande enregistrée</p>
        <h3>Votre séjour porte la référence {result.reference}.</h3>
        <p>
          Stéphanie ou Bruno vérifie les derniers détails avant la confirmation définitive. Aucun
          paiement n’a été débité.
        </p>
        <p>{result.message}</p>
        <a href={`mailto:coulotstephanie@gmail.com?subject=Réservation ${result.reference}`}>
          Contacter Stéphanie au sujet de cette demande
        </a>
      </section>
    );
  }

  return (
    <form className="direct-booking-form" onSubmit={submit}>
      <div className="direct-booking-form__heading">
        <div>
          <p className="eyebrow">Dernière étape</p>
          <h3>Enregistrer ma demande directe</h3>
        </div>
        <div className={sourcesHealthy ? "availability-proof is-healthy" : "availability-proof"}>
          <span aria-hidden="true" />
          {sourcesHealthy
            ? "Disponibilité contrôlée sur les calendriers connectés"
            : "Réservation temporairement suspendue : calendriers en cours de vérification"}
        </div>
      </div>
      <div className="direct-booking-form__summary">
        <span>{property.title}</span>
        <strong>{quote.total.toLocaleString("fr-FR")} €</strong>
        <small>Prix total du séjour, options et taxe de séjour comprises</small>
      </div>
      <aside className="booking-conditions-summary" aria-labelledby="booking-conditions-title">
        <h4 id="booking-conditions-title">Conditions de réservation</h4>
        {quote.paymentSchedule.fullPaymentRequired ? (
          <p>
            <strong>Paiement intégral lors de la réservation.</strong> Cette demande intervient
            moins de 14 jours avant l’arrivée : aucun acompte n’est proposé.
          </p>
        ) : (
          <p>
            <strong>Acompte de 30 % à la réservation.</strong> Solde à régler 14 jours avant votre
            arrivée.
          </p>
        )}
        <p>
          Annulation gratuite pendant 24 heures après la réservation, hors réservations effectuées
          moins de 14 jours avant l’arrivée. Après ce délai, l’acompte reste acquis. À moins de 14
          jours de l’arrivée, le séjour est intégralement dû.
        </p>
      </aside>
      <div className="direct-booking-form__fields">
        <label>
          Prénom
          <input name="firstName" autoComplete="given-name" required maxLength={100} />
        </label>
        <label>
          Nom
          <input name="lastName" autoComplete="family-name" required maxLength={100} />
        </label>
        <label>
          Adresse e-mail
          <input name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
        <label>
          Téléphone
          <input name="phone" type="tel" autoComplete="tel" minLength={6} maxLength={30} />
        </label>
      </div>
      <label className="direct-booking-form__consent">
        <input name="termsAccepted" type="checkbox" required />
        <span>
          Je reconnais avoir lu et accepté les{" "}
          <a href="/conditions-generales-de-vente" target="_blank" rel="noreferrer">
            Conditions Générales de Vente
          </a>
          .
        </span>
      </label>
      <label className="direct-booking-form__consent">
        <input name="cancellationAccepted" type="checkbox" required />
        <span>
          Je reconnais avoir pris connaissance de la{" "}
          <a href="/politique-annulation" target="_blank" rel="noreferrer">
            politique d’annulation
          </a>
          .
        </span>
      </label>
      <fieldset className="direct-booking-form__payment">
        <legend>Mode de règlement</legend>
        <label>
          <input type="radio" name="paymentMethod" value="bank_transfer" required /> Virement
          bancaire
        </label>
        <label>
          <input type="radio" name="paymentMethod" value="holiday_vouchers" required />{" "}
          Chèques‑Vacances
        </label>
      </fieldset>
      {status === "error" ? (
        <p role="alert">
          {result.error ??
            "La demande n’a pas pu être enregistrée. Vous pouvez réessayer ou contacter Stéphanie."}
        </p>
      ) : null}
      {!sourcesHealthy && (
        <p role="alert">
          La réservation directe reprendra automatiquement dès que les calendriers Airbnb et Booking
          disposeront d’un état fiable.
        </p>
      )}
      <button type="submit" disabled={status === "submitting" || !sourcesHealthy}>
        {status === "submitting" ? "Enregistrement sécurisé…" : "Envoyer ma demande"}
      </button>
      <small>
        Données utilisées uniquement pour traiter votre séjour. Aucun traceur publicitaire n’est
        associé à cette demande.
      </small>
    </form>
  );
}
