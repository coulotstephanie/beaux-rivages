"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const options = [
  ["linen", "Linge & lits préparés", 20, "par personne", "option"],
  ["signature", "Pack Signature", 145, "à partir de · selon le nombre de voyageurs", "option"],
  ["personal-arrival", "Arrivée personnalisée", 35, "sur demande", "option"],
  ["romance", "Attention romantique", 75, "sur demande", "experience"],
  ["anniversaire", "Anniversaire", 85, "sur demande", "experience"],
  ["aperitif-basket", "Panier Apéritif Beaux Rivages", 45, "produits artisanaux locaux", "option"],
  ["basket", "Panier Douceur Beaux Rivages", 45, "gourmandises artisanales", "option"],
  ["pet", "Accueil animal", 25, "par animal", "option"],
  ["late-checkout", "Départ tardif", 55, "selon disponibilité", "option"],
] as const;

export function StayComposer() {
  const [selected, setSelected] = useState<string[]>(["signature"]);
  const total = useMemo(
    () => options.filter(([id]) => selected.includes(id)).reduce((sum, item) => sum + item[2], 0),
    [selected],
  );
  const bookingHref = useMemo(() => {
    const params = new URLSearchParams();
    const optionIds = options
      .filter(([id, , , , kind]) => kind === "option" && selected.includes(id))
      .map(([id]) => id);
    const experienceIds = options
      .filter(([id, , , , kind]) => kind === "experience" && selected.includes(id))
      .map(([id]) => id);
    if (optionIds.length) params.set("options", optionIds.join(","));
    if (experienceIds.length) params.set("experiences", experienceIds.join(","));
    return `/reserver?${params.toString()}`;
  }, [selected]);
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  return (
    <div className="stay-composer">
      <div className="stay-composer__options">
        {options.map(([id, label, price, note]) => (
          <button
            type="button"
            key={id}
            onClick={() => toggle(id)}
            className={selected.includes(id) ? "is-selected" : ""}
            aria-pressed={selected.includes(id)}
          >
            <span>{selected.includes(id) ? "✓" : "+"}</span>
            <strong>{label}</strong>
            <small>
              à partir de {price} € · {note}
            </small>
          </button>
        ))}
      </div>
      <aside className="stay-composer__summary">
        <p className="eyebrow light">Votre composition</p>
        <h2>Un séjour à votre image.</h2>
        {selected.length ? (
          <ul>
            {options
              .filter(([id]) => selected.includes(id))
              .map(([id, label, price]) => (
                <li key={id}>
                  <span>{label}</span>
                  <strong>{price} €</strong>
                </li>
              ))}
          </ul>
        ) : (
          <p>Sélectionnez les attentions qui comptent pour vous.</p>
        )}
        <div className="stay-composer__total">
          <span>Estimation de vos attentions</span>
          <strong>{total} €</strong>
        </div>
        <small>
          Montant indicatif, confirmé selon la maison, le nombre de voyageurs et les disponibilités.
        </small>
        <Link className="primary-button" href={bookingHref}>
          Ajouter à ma demande
        </Link>
      </aside>
    </div>
  );
}
