import type { Property } from "@/data";
import { Button } from "./ui";

export function PropertyStickyBooking({ property }: { property: Property }) {
  return (
    <aside className="property-sticky-booking" aria-label="Réservation">
      <div>
        <strong>{property.title}</strong>
        <span>{property.capacity} · Réservation directe</span>
      </div>
      <Button href={`/reserver?maison=${property.slug}`}>Voir les disponibilités</Button>
    </aside>
  );
}
