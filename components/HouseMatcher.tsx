"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { properties } from "@/data";

const criteria = [
  { id: "couple", label: "En couple", scores: [3, 3, 2] },
  { id: "family", label: "En famille", scores: [3, 4, 4] },
  { id: "remote", label: "Télétravail", scores: [4, 4, 3] },
  { id: "group", label: "Grand groupe", scores: [2, 5, 3] },
  { id: "romance", label: "Séjour romantique", scores: [4, 5, 3] },
  { id: "weekend", label: "Week-end", scores: [5, 4, 3] },
  { id: "bike", label: "Vélo", scores: [5, 4, 3] },
  { id: "seaside", label: "Bord de mer", scores: [4, 5, 5] },
  { id: "beach", label: "Accès plage", scores: [4, 4, 5] },
  { id: "view", label: "Vue mer", scores: [2, 5, 4] },
] as const;

export function HouseMatcher() {
  const [selected, setSelected] = useState<string[]>([]);
  const ranking = useMemo(() => properties.map((property, index) => ({
    property,
    score: selected.reduce((sum, id) => sum + (criteria.find((item) => item.id === id)?.scores[index] ?? 0), 0),
  })).sort((a, b) => b.score - a.score), [selected]);
  const winner = ranking[0];

  const toggle = (id: string) => setSelected((current) =>
    current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <div className="matcher">
      <div className="matcher__choices" aria-label="Vos priorités">
        {criteria.map((criterion) => (
          <button key={criterion.id} type="button" onClick={() => toggle(criterion.id)}
            className={selected.includes(criterion.id) ? "is-selected" : ""} aria-pressed={selected.includes(criterion.id)}>
            <span>{selected.includes(criterion.id) ? "✓" : "+"}</span>{criterion.label}
          </button>
        ))}
      </div>
      <div className="matcher__comparison">
        {ranking.map(({ property, score }, index) => (
          <article key={property.slug} className={selected.length > 0 && index === 0 ? "is-winner" : ""}>
            <span className="matcher__rank">0{index + 1}</span>
            <p>{property.location}</p>
            <h3>{property.title}</h3>
            <strong>{property.capacity}</strong>
            <ul>{property.highlights.slice(0, 4).map((item) => <li key={item}>✓ {item}</li>)}</ul>
            {selected.length > 0 && <div className="matcher__score">{score} points d’affinité</div>}
            <Link href={`/maisons/${property.slug}`}>Découvrir la maison <span>→</span></Link>
          </article>
        ))}
      </div>
      <div className="matcher__result" aria-live="polite">
        {selected.length === 0 ? (
          <><p className="eyebrow light">Votre sélection</p><h2>Choisissez ce qui compte pour vous.</h2><p>Le classement se construit instantanément à partir de vos priorités.</p></>
        ) : (
          <><p className="eyebrow light">Notre recommandation</p><h2>{winner.property.title}</h2><p>{winner.property.intro}</p><Link className="primary-button" href={`/reserver?maison=${winner.property.slug}`}>Préparer mon séjour</Link></>
        )}
      </div>
    </div>
  );
}
