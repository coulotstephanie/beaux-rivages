"use client";

import { Badge } from "./ui";

export function SignaturePackCard({
  selected,
  onToggle,
}: {
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <label className={`signature-pack-card${selected ? " is-selected" : ""}`}>
      <input type="checkbox" checked={selected} onChange={onToggle} />
      <span className="signature-pack-card__visual">
        <Badge light>Expérience phare</Badge>
        <strong>
          Signature
          <br />
          Beaux Rivages
        </strong>
        <small>145 € par séjour</small>
      </span>
      <span className="signature-pack-card__copy">
        <span className="signature-pack-card__check" aria-hidden="true">
          {selected ? "✓" : "+"}
        </span>
        <strong>Le séjour préparé dans ses moindres détails.</strong>
        <span>
          Lits faits, linge complet, serviettes de plage, deux peignoirs et chaussons, carafe d’eau
          fraîche et attention personnalisée. Le panier gourmand de votre choix peut être ajouté à
          la réservation.
        </span>
      </span>
    </label>
  );
}
