import type { Property } from "@/data";
import { Card, Heading, Section } from "./ui";

export function PropertyAmenitiesGrid({ property }: { property: Property }) {
  return (
    <Section className="premium-amenities">
      <Heading
        eyebrow="Équipements de la maison"
        title="Tout est prévu pour votre séjour."
        description="Cuisine, literie, équipements bébé, loisirs et confort : retrouvez ici les équipements réellement disponibles dans cette maison."
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
