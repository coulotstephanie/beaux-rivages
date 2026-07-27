"use client";

import Image from "next/image";
import type { Property } from "@/data";
import { bookingPropertyDetails } from "@/booking";

export function PropertySelector({ properties, value, onChange }: { properties: Property[]; value: string | null; onChange: (slug: string) => void }) {
  return (
    <fieldset className="booking-fieldset">
      <legend className="sr-only">Choisissez une maison</legend>
      <div className="booking-property-selector">
        {properties.map((property) => {
          const details = bookingPropertyDetails[property.slug];
          const selected = value === property.slug;
          return (
            <label key={property.slug} className={selected ? "is-selected" : ""}>
              <input type="radio" name="property" value={property.slug} checked={selected} onChange={() => onChange(property.slug)} />
              <span className="booking-property-selector__image">
                <Image src={property.hero} alt={`Vue de ${property.title}`} fill quality={85} loading="lazy" sizes="(max-width: 800px) 100vw, (max-width: 1200px) 30vw, 280px" />
                <span>{selected ? "Sélectionnée" : "Choisir"}</span>
              </span>
              <span className="booking-property-selector__copy">
                <strong>{property.title}</strong>
                <small>{property.capacity}</small>
                <span>{details.beachDistance}</span>
                <em>{details.atmosphere}</em>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
