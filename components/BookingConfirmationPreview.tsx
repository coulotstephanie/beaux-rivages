import Image from "next/image";
import type { BookingSelection } from "@/booking";
import { getNights } from "@/booking";
import type { Property } from "@/data";
import { Badge } from "./ui";

export function BookingConfirmationPreview({ selection, property }: { selection: BookingSelection; property: Property }) {
  const guests = selection.guests.adults + selection.guests.children;
  return (
    <section className="booking-confirmation-preview" aria-labelledby="preview-title">
      <div className="booking-confirmation-preview__image">
        <Image src={property.hero} alt={`Votre projet de séjour à ${property.title}`} fill quality={88} loading="lazy" sizes="(max-width: 900px) 100vw, (max-width: 1400px) 52vw, 650px" />
        <span />
        <Badge light>Votre séjour ressemblera à cela</Badge>
      </div>
      <div className="booking-confirmation-preview__copy">
        <p className="eyebrow">Votre projet de séjour</p>
        <h2 id="preview-title">{property.title}</h2>
        <p>{property.intro}</p>
        <div>
          <span><strong>{getNights(selection.arrival, selection.departure)}</strong> nuits</span>
          <span><strong>{guests}</strong> voyageurs</span>
          <span><strong>{selection.options.length + selection.experiences.length}</strong> attentions</span>
        </div>
        {selection.attention && <blockquote>« Une attention pour votre {selection.attention.toLowerCase()} sera étudiée avec vous. »</blockquote>}
      </div>
    </section>
  );
}
