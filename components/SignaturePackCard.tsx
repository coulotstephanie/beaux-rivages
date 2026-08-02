"use client";

import Image from "next/image";
import { calculateSignaturePackPrice, SIGNATURE_PACK_IMAGE, type GuestCounts } from "@/booking";
import { Badge } from "./ui";

export function SignaturePackCard({
  selected,
  guests,
  onToggle,
}: {
  selected: boolean;
  guests: Pick<GuestCounts, "adults" | "children" | "babies">;
  onToggle: () => void;
}) {
  const price = calculateSignaturePackPrice(guests);
  const payingGuests = guests.adults + guests.children;
  return (
    <label className={`signature-pack-card${selected ? " is-selected" : ""}`}>
      <input type="checkbox" checked={selected} onChange={onToggle} />
      <span className="signature-pack-card__visual">
        <Image
          src={SIGNATURE_PACK_IMAGE}
          alt="Chambre authentique du Chai des Tortues préparée pour le Pack Signature"
          fill
          sizes="(max-width: 900px) 100vw, 42vw"
        />
        <span className="signature-pack-card__overlay" aria-hidden="true" />
        <Badge light>Expérience phare</Badge>
        <strong>
          Signature
          <br />
          Beaux Rivages
        </strong>
        <small>{price} €</small>
      </span>
      <span className="signature-pack-card__copy">
        <span className="signature-pack-card__check" aria-hidden="true">
          {selected ? "✓" : "+"}
        </span>
        <strong>Le séjour préparé dans ses moindres détails.</strong>
        <span className="signature-pack-card__price" aria-live="polite">
          {price} € · {payingGuests} personne{payingGuests > 1 ? "s" : ""} payante
          {payingGuests > 1 ? "s" : ""}
          {guests.babies > 0
            ? ` · ${guests.babies} bébé${guests.babies > 1 ? "s" : ""} non facturé${guests.babies > 1 ? "s" : ""}`
            : ""}
        </span>
        <span>
          À partir de 145 € selon le nombre de voyageurs. Le montant exact est calculé
          automatiquement lors de la réservation. Lits faits, linge complet, serviettes de plage,
          deux peignoirs et chaussons, carafe d’eau fraîche et attention personnalisée. Le panier
          gourmand de votre choix peut être ajouté à la réservation.
        </span>
      </span>
    </label>
  );
}
