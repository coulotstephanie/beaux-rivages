import type { Property } from "@/data";
import { Card, Heading, Section } from "./ui";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr } from "@/i18n/lot1-client";

export function PropertyAmenitiesGrid({
  property,
  locale = "fr",
}: {
  property: Property;
  locale?: SupportedLocale;
}) {
  return (
    <Section className="premium-amenities">
      <Heading
        eyebrow={tr(locale, "Équipements de la maison")}
        title={tr(locale, "Tout est prévu pour votre séjour.")}
        description={tr(
          locale,
          "Cuisine, literie, équipements bébé, loisirs et confort : retrouvez ici les équipements réellement disponibles dans cette maison.",
        )}
      />
      <div className="premium-amenities__grid">
        {property.amenityGroups.map((group) => (
          <Card key={group.title} className="premium-amenity-card">
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>
                  <span aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}
