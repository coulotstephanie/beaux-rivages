import type { BookingSelection } from "@/booking";
import { bookingExperiences, getBookingEstimate, stayOptions } from "@/booking";
import type { Property } from "@/data";

export function PriceSummary({ selection, property, compact = false }: { selection: BookingSelection; property?: Property; compact?: boolean }) {
  const estimate = getBookingEstimate(selection, property);
  const payingGuests = Math.max(1, selection.guests.adults + selection.guests.children);
  return (
    <div className={`price-summary${compact ? " price-summary--compact" : ""}`}>
      {!compact && <h3>Prix estimatif</h3>}
      {estimate.nights > 0 && property ? (
        <>
          <div><span>{estimate.nights} nuit{estimate.nights > 1 ? "s" : ""} × {estimate.nightlyRate} €</span><strong>{estimate.accommodation.toLocaleString("fr-FR")} €</strong></div>
          {selection.options.map((id) => {
            const option = stayOptions.find((item) => item.id === id);
            if (!option) return null;
            const price = option.price * (option.unit === "par voyageur" ? payingGuests : 1);
            return <div key={id}><span>{option.label}</span><strong>{price.toLocaleString("fr-FR")} €</strong></div>;
          })}
          {selection.experiences.map((id) => {
            const experience = bookingExperiences.find((item) => item.id === id);
            if (!experience) return null;
            return <div key={id}><span>{experience.label}</span><strong>{experience.price.toLocaleString("fr-FR")} €</strong></div>;
          })}
          {estimate.experiencesTotal > 0 && <div><span>Total des expériences</span><strong>{estimate.experiencesTotal.toLocaleString("fr-FR")} €</strong></div>}
          {estimate.optionsTotal > 0 && <div><span>Total des prestations</span><strong>{estimate.optionsTotal.toLocaleString("fr-FR")} €</strong></div>}
          <div className="price-summary__total"><span>Estimation totale</span><strong>{estimate.total.toLocaleString("fr-FR")} €</strong></div>
        </>
      ) : (
        <p>Choisissez une maison et vos dates pour afficher une première estimation.</p>
      )}
      <small>Estimation non contractuelle. Le tarif et les disponibilités seront confirmés personnellement par Stéphanie.</small>
    </div>
  );
}
