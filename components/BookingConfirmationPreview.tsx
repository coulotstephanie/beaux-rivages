import Image from "next/image";
import type { BookingSelection } from "@/booking";
import { getNights, SIGNATURE_PACK_IMAGE } from "@/booking";
import type { Property } from "@/data";
import { Badge } from "./ui";
import { describeWelcomeBaskets } from "@/platform/reservations/welcome-baskets";

export function BookingConfirmationPreview({
  selection,
  property,
}: {
  selection: BookingSelection;
  property: Property;
}) {
  const guests = selection.guests.adults + selection.guests.children;
  const hasSignaturePack = selection.options.includes("signature");
  const previewImage = hasSignaturePack ? SIGNATURE_PACK_IMAGE : property.hero;
  const baskets = describeWelcomeBaskets(selection.options.map((code) => ({ code })));
  return (
    <section className="booking-confirmation-preview" aria-labelledby="preview-title">
      <div className="booking-confirmation-preview__image">
        <Image
          src={previewImage}
          alt={
            hasSignaturePack
              ? "Pack Signature Beaux Rivages préparé dans une maison authentique"
              : `Votre projet de séjour à ${property.title}`
          }
          fill
          quality={88}
          loading="lazy"
          sizes="(max-width: 900px) 100vw, (max-width: 1400px) 52vw, 650px"
        />
        <span />
        <Badge light>Votre séjour ressemblera à cela</Badge>
      </div>
      <div className="booking-confirmation-preview__copy">
        <p className="eyebrow">Votre réservation</p>
        <h2 id="preview-title">{property.title}</h2>
        <p>{property.intro}</p>
        <div>
          <span>
            <strong>{getNights(selection.arrival, selection.departure)}</strong> nuits
          </span>
          <span>
            <strong>{guests}</strong> voyageurs
          </span>
          <span>
            <strong>{selection.options.length + selection.experiences.length}</strong> attentions
          </span>
        </div>
        <div className="booking-confirmation-preview__basket">
          <strong>Accueil gourmand</strong>
          <p>Panier inclus : {baskets.included}</p>
          {hasSignaturePack ? <p>Panier supplémentaire : {baskets.extra}</p> : null}
        </div>
        {selection.attention && (
          <blockquote>
            « Une attention pour votre {selection.attention.toLowerCase()} sera étudiée avec vous. »
          </blockquote>
        )}
      </div>
    </section>
  );
}
