import type { Property } from "@/data";
import { Button } from "./ui";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr, localizedHref } from "@/i18n/lot1-client";

export function PropertyStickyBooking({
  property,
  locale = "fr",
}: {
  property: Property;
  locale?: SupportedLocale;
}) {
  return (
    <aside className="property-sticky-booking" aria-label="Réservation">
      <div>
        <strong>{property.title}</strong>
        <span>
          {property.capacity} · {tr(locale, "Réservation directe")}
        </span>
      </div>
      <Button href={localizedHref(locale, `/reserver?maison=${property.slug}`)}>
        {tr(locale, "Voir les disponibilités")}
      </Button>
    </aside>
  );
}
