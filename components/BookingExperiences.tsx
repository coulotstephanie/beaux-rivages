"use client";

import Link from "next/link";
import {
  bookingExperiences,
  getBookingSuggestions,
  type BookingExperienceId,
  type BookingSelection,
} from "@/booking";

export function BookingExperiences({
  selection,
  onChange,
}: {
  selection: BookingSelection;
  onChange: (value: BookingExperienceId[]) => void;
}) {
  const suggestions = getBookingSuggestions(selection);
  const toggle = (id: BookingExperienceId) =>
    onChange(
      selection.experiences.includes(id)
        ? selection.experiences.filter((item) => item !== id)
        : [...selection.experiences, id],
    );

  return (
    <section className="booking-experiences" aria-labelledby="booking-experiences-title">
      <div className="booking-section-heading">
        <p className="eyebrow">À vivre pendant le séjour</p>
        <h3 id="booking-experiences-title">Choisissez vos expériences</h3>
      </div>
      {suggestions.length > 0 && (
        <div className="booking-suggestions" aria-label="Suggestions personnalisées">
          <strong>Les suggestions de Stéphanie & Bruno</strong>
          <p>Selon votre maison et les voyageurs, ces expériences pourraient vous plaire.</p>
          <div>
            {suggestions.map((id) => {
              const experience = bookingExperiences.find((item) => item.id === id);
              return experience ? (
                <button type="button" key={id} onClick={() => toggle(id)}>
                  + {experience.label}
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}
      <div className="booking-experiences__grid">
        {bookingExperiences.map((experience) => {
          const selected = selection.experiences.includes(experience.id);
          const especiallySuited =
            !experience.propertySlugs ||
            !selection.propertySlug ||
            experience.propertySlugs.includes(selection.propertySlug);
          return (
            <label key={experience.id} className={selected ? "is-selected" : ""}>
              <input type="checkbox" checked={selected} onChange={() => toggle(experience.id)} />
              <span className="booking-experiences__top">
                <small>{experience.duration}</small>
                <span aria-hidden="true">{selected ? "✓" : "+"}</span>
              </span>
              <strong>{experience.label}</strong>
              <span>{experience.description}</span>
              <small>
                À partir de {experience.price} €
                {especiallySuited ? "" : " · autre maison conseillée"}
              </small>
            </label>
          );
        })}
      </div>
      <div className="booking-bespoke-grid" aria-label="Expériences sur mesure">
        <article>
          <small>Organisation sur mesure</small>
          <strong>💍 Demande en mariage</strong>
          <span>
            Décoration, fleurs, gourmandises, photographe et choix du lieu selon votre projet.
          </span>
          <Link href="/demande-en-mariage">Demander un devis →</Link>
        </article>
        <article>
          <small>Organisation sur mesure</small>
          <strong>🎂 Anniversaire</strong>
          <span>
            Décoration, gâteau, fleurs, gourmandises et attentions entièrement personnalisées.
          </span>
          <Link href="/anniversaire">Demander un devis →</Link>
        </article>
      </div>
    </section>
  );
}
