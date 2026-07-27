import type { BookingSelection } from "@/booking";
import { bookingExperiences, getNights, stayOptions } from "@/booking";
import type { Property } from "@/data";
import { PriceSummary } from "./PriceSummary";

function formatDate(value: string | null) {
  return value ? new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "À choisir";
}

export function BookingSidebar({ selection, property }: { selection: BookingSelection; property?: Property }) {
  const travelers = selection.guests.adults + selection.guests.children;
  return (
    <aside className="booking-sidebar">
      <p className="eyebrow">Votre séjour</p>
      <h2>{property?.title ?? "Votre maison"}</h2>
      <dl>
        <div><dt>Dates</dt><dd>{formatDate(selection.arrival)} → {formatDate(selection.departure)}</dd></div>
        <div><dt>Séjour</dt><dd>{getNights(selection.arrival, selection.departure) || "—"} nuit(s)</dd></div>
        <div><dt>Voyageurs</dt><dd>{travelers} voyageur(s){selection.guests.babies ? ` · ${selection.guests.babies} bébé` : ""}</dd></div>
        <div><dt>Animal</dt><dd>{selection.guests.pets || "Aucun"}</dd></div>
      </dl>
      {selection.options.length > 0 && (
        <div className="booking-sidebar__options">
          <span>Prestations sélectionnées</span>
          <ul>{selection.options.map((id) => <li key={id}>{stayOptions.find((item) => item.id === id)?.label}</li>)}</ul>
        </div>
      )}
      {selection.experiences.length > 0 && (
        <div className="booking-sidebar__options">
          <span>Expériences sélectionnées</span>
          <ul>{selection.experiences.map((id) => <li key={id}>{bookingExperiences.find((item) => item.id === id)?.label}</li>)}</ul>
        </div>
      )}
      <PriceSummary selection={selection} property={property} compact />
    </aside>
  );
}
