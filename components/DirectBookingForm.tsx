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
        guest: {
          firstName: String(data.get("firstName") ?? ""),
          lastName: String(data.get("lastName") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? "") || undefined,
          countryCode: "FR",
        },
        idempotencyKey: crypto.randomUUID(),
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
            : "Disponibilité à confirmer personnellement"}
        </div>
      </div>
      <div className="direct-booking-form__summary">
        <span>{property.title}</span>
        <strong>{quote.total.toLocaleString("fr-FR")} €</strong>
        <small>Prix total du séjour, options et taxe de séjour comprises</small>
      </div>
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
        <input name="consent" type="checkbox" required />
        <span>
          J’ai vérifié les dates, les voyageurs, les options et le prix. Je comprends qu’il s’agit
          d’une demande sans débit immédiat et que les conditions contractuelles me seront
          présentées avant tout engagement.
        </span>
      </label>
      {status === "error" ? (
        <p role="alert">
          {result.error ??
            "La demande n’a pas pu être enregistrée. Vous pouvez réessayer ou contacter Stéphanie."}
        </p>
      ) : null}
      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Enregistrement sécurisé…" : "Envoyer ma demande"}
      </button>
      <small>
        Données utilisées uniquement pour traiter votre séjour. Aucun traceur publicitaire n’est
        associé à cette demande.
      </small>
    </form>
  );
}
