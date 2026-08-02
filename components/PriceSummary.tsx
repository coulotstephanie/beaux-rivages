"use client";

import { useEffect, useState } from "react";
import type { BookingSelection } from "@/booking";
import type { Property } from "@/data";

export type BookingQuote = {
  nights: number;
  nightlyLines: { date: string; rate: number; season: string }[];
  accommodationBeforeDiscount: number;
  promotion: { label: string; percentage: number; discount: number } | null;
  accommodation: number;
  cleaningFee: number;
  touristTax: number;
  securityDeposit: { amount: number; includedInTotal: boolean };
  optionLines: { id: string; label: string; quantity: number; unitPrice: number; total: number }[];
  experienceLines: { id: string; label: string; total: number }[];
  total: number;
  paymentSchedule: {
    depositPercentage: number;
    depositDue: number;
    balanceDue: number;
    balanceDueDate: string;
    fullPaymentRequired: boolean;
    fullPaymentThresholdDays: number;
    balanceDueDays: number;
  };
  stayRules: { valid: boolean; requiredMinimum: number; maximumNights: number };
};

export function PriceSummary({
  selection,
  property,
  compact = false,
  onQuoteChange,
}: {
  selection: BookingSelection;
  property?: Property;
  compact?: boolean;
  onQuoteChange?: (quote: BookingQuote | null) => void;
}) {
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  useEffect(() => {
    if (!property || !selection.arrival || !selection.departure) {
      setQuote(null);
      onQuoteChange?.(null);
      setStatus("idle");
      return;
    }
    const controller = new AbortController();
    setStatus("loading");
    fetch("/api/pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        propertySlug: property.slug,
        arrival: selection.arrival,
        departure: selection.departure,
        ...selection.guests,
        options: selection.options,
        experiences: selection.experiences,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("quote");
        return response.json() as Promise<BookingQuote>;
      })
      .then((value) => {
        setQuote(value);
        onQuoteChange?.(value);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });
    return () => controller.abort();
  }, [
    property,
    selection.arrival,
    selection.departure,
    selection.guests,
    selection.options,
    selection.experiences,
    onQuoteChange,
  ]);

  return (
    <div className={`price-summary${compact ? " price-summary--compact" : ""}`} aria-live="polite">
      {!compact && <h3>Votre devis</h3>}
      {status === "loading" ? <p>Calcul du meilleur tarif…</p> : null}
      {status === "error" ? (
        <p>
          Le devis ne peut pas être calculé actuellement. Aucun montant ne sera confirmé sans
          vérification.
        </p>
      ) : null}
      {quote ? (
        <>
          <div>
            <span>
              {quote.nights} nuit{quote.nights > 1 ? "s" : ""}
            </span>
            <strong>{quote.accommodationBeforeDiscount.toLocaleString("fr-FR")} €</strong>
          </div>
          {quote.promotion ? (
            <div className="price-summary__discount">
              <span>
                {quote.promotion.label} · −{quote.promotion.percentage} %
              </span>
              <strong>−{quote.promotion.discount.toLocaleString("fr-FR")} €</strong>
            </div>
          ) : null}
          <div>
            <span>Frais de ménage</span>
            <strong>{quote.cleaningFee.toLocaleString("fr-FR")} €</strong>
          </div>
          {quote.touristTax > 0 ? (
            <div>
              <span>
                Taxe de séjour{" "}
                <abbr
                  title="La taxe de séjour est calculée automatiquement selon la réglementation locale en vigueur."
                  aria-label="Information sur la taxe de séjour"
                >
                  ⓘ
                </abbr>
              </span>
              <strong>{quote.touristTax.toLocaleString("fr-FR")} €</strong>
            </div>
          ) : null}
          {quote.optionLines.map((line) => (
            <div key={line.id}>
              <span>
                {line.label}
                {line.quantity > 1 ? ` × ${line.quantity}` : ""}
              </span>
              <strong>{line.total.toLocaleString("fr-FR")} €</strong>
            </div>
          ))}
          {quote.experienceLines.map((line) => (
            <div key={line.id}>
              <span>{line.label}</span>
              <strong>{line.total.toLocaleString("fr-FR")} €</strong>
            </div>
          ))}
          <div className="price-summary__total">
            <span>Total du séjour</span>
            <strong>{quote.total.toLocaleString("fr-FR")} €</strong>
          </div>
          <div>
            <span>
              {quote.paymentSchedule.fullPaymentRequired
                ? "Paiement intégral à la réservation"
                : "Acompte de 30 %"}
            </span>
            <strong>{quote.paymentSchedule.depositDue.toLocaleString("fr-FR")} €</strong>
          </div>
          {!quote.paymentSchedule.fullPaymentRequired ? (
            <div>
              <span>
                Solde au{" "}
                {new Intl.DateTimeFormat("fr-FR").format(
                  new Date(`${quote.paymentSchedule.balanceDueDate}T12:00:00`),
                )}
              </span>
              <strong>{quote.paymentSchedule.balanceDue.toLocaleString("fr-FR")} €</strong>
            </div>
          ) : null}
          <small>
            Caution non encaissée : {quote.securityDeposit.amount.toLocaleString("fr-FR")} €.{" "}
            {quote.stayRules.valid
              ? "Durée conforme aux règles du séjour."
              : `Séjour de ${quote.stayRules.requiredMinimum} à ${quote.stayRules.maximumNights} nuits requis.`}
          </small>
        </>
      ) : status === "idle" ? (
        <p>Choisissez une maison et vos dates pour calculer le tarif exact de chaque nuit.</p>
      ) : null}
      <small>
        Tarif calculé à partir des règles Beaux Rivages. Il devient contractuel après validation
        écrite de la réservation.
      </small>
    </div>
  );
}
