import type { Property } from "@/data";
import { Card, Heading, Section } from "./ui";

export function PropertyAmenitiesGrid({ property }: { property: Property }) {
  return (
    <Section className="premium-amenities">
      <Heading
        eyebrow="Pensée dans les détails"
        title="Tout ce qui rend le séjour plus simple."
        description="Des équipements utiles, choisis pour profiter de la maison et des îles sans se charger inutilement."
      />
      <div className="premium-amenities__grid">
        {property.amenityGroups.map((group) => (
          <Card key={group.title} className="premium-amenity-card">
            <h3>{group.title}</h3>
            <ul>{group.items.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}
