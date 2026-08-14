import type { BookingSelection } from "@/booking";
import { bookingExperiences, getNights, stayOptions } from "@/booking";
import type { Property } from "@/data";
import { PriceSummary } from "./PriceSummary";
import type { BookingQuote } from "./PriceSummary";

function formatDate(value: string | null) {
  return value
    ? new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    : "À choisir";
}

export function BookingSidebar({
  selection,
  property,
  onQuoteChange,
  demoMode = false,
}: {
  selection: BookingSelection;
  property?: Property;
  onQuoteChange?: (quote: BookingQuote | null) => void;
  demoMode?: boolean;
}) {
  const displayedSelection = demoMode
    ? { ...selection, arrival: "2026-08-28", departure: "2026-09-02" }
    : selection;
  const travelers = displayedSelection.guests.adults + displayedSelection.guests.children;
  return (
    <aside className="booking-sidebar">
      <p className="eyebrow">Votre séjour</p>
      <h2>{property?.title ?? "Votre maison"}</h2>
      <dl>
        <div>
          <dt>Dates</dt>
          <dd>
            {formatDate(displayedSelection.arrival)} → {formatDate(displayedSelection.departure)}
          </dd>
        </div>
        <div>
          <dt>Séjour</dt>
          <dd>
            {getNights(displayedSelection.arrival, displayedSelection.departure) || "—"} nuit(s)
          </dd>
        </div>
        <div>
          <dt>Voyageurs</dt>
          <dd>
            {travelers} voyageur(s)
            {displayedSelection.guests.babies ? ` · ${displayedSelection.guests.babies} bébé` : ""}
          </dd>
        </div>
        <div>
          <dt>Animal</dt>
          <dd>{displayedSelection.guests.pets || "Aucun"}</dd>
        </div>
      </dl>
      {selection.options.length > 0 && (
        <div className="booking-sidebar__options">
          <span>Prestations sélectionnées</span>
          <ul>
            {selection.options.map((id) => (
              <li key={id}>{stayOptions.find((item) => item.id === id)?.label}</li>
            ))}
          </ul>
        </div>
      )}
      {selection.experiences.length > 0 && (
        <div className="booking-sidebar__options">
          <span>Expériences sélectionnées</span>
          <ul>
            {selection.experiences.map((id) => (
              <li key={id}>{bookingExperiences.find((item) => item.id === id)?.label}</li>
            ))}
          </ul>
        </div>
      )}
      {demoMode ? (
        <div className="booking-sidebar__demo-price">
          <span>Aperçu fictif</span>
          <strong>1 000 €</strong>
          <small>5 nuits · aucun tarif réel consulté</small>
        </div>
      ) : (
        <PriceSummary
          selection={selection}
          property={property}
          compact
          onQuoteChange={onQuoteChange}
        />
      )}
    </aside>
  );
}
