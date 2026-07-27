"use client";

import type { GuestCounts } from "@/booking";

const guestTypes: { key: keyof GuestCounts; label: string; description: string; min: number; max: number }[] = [
  { key: "adults", label: "Adultes", description: "13 ans et plus", min: 1, max: 8 },
  { key: "children", label: "Enfants", description: "De 2 à 12 ans", min: 0, max: 7 },
  { key: "babies", label: "Bébé", description: "Moins de 2 ans", min: 0, max: 2 },
  { key: "pets", label: "Animal", description: "Compagnon à quatre pattes", min: 0, max: 2 },
];

export function GuestSelector({ value, maxGuests, onChange }: { value: GuestCounts; maxGuests: number; onChange: (value: GuestCounts) => void }) {
  const countedGuests = value.adults + value.children;
  const update = (key: keyof GuestCounts, delta: number, min: number, max: number) => {
    onChange({ ...value, [key]: Math.min(max, Math.max(min, value[key] + delta)) });
  };
  return (
    <div className="guest-selector">
      {guestTypes.map((item) => (
        <div key={item.key}>
          <span><strong>{item.label}</strong><small>{item.description}</small></span>
          <div>
            <button type="button" onClick={() => update(item.key, -1, item.min, item.max)} disabled={value[item.key] <= item.min} aria-label={`Retirer un ${item.label.toLowerCase()}`}>−</button>
            <output aria-live="polite">{value[item.key]}</output>
            <button type="button" onClick={() => update(item.key, 1, item.min, item.max)} disabled={value[item.key] >= item.max || ((item.key === "adults" || item.key === "children") && countedGuests >= maxGuests)} aria-label={`Ajouter un ${item.label.toLowerCase()}`}>+</button>
          </div>
        </div>
      ))}
      <p className="guest-selector__capacity" role="status">{countedGuests} voyageur{countedGuests > 1 ? "s" : ""} sur {maxGuests} maximum, hors bébés.</p>
    </div>
  );
}
