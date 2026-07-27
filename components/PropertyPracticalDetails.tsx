import type { Property } from "@/data";
import { Card, Container, Heading, Section } from "./ui";

export function PropertyPracticalDetails({ property }: { property: Property }) {
  if (!property.spaces.length) return null;

  return (
    <>
      <Section tone="sand" className="property-spaces">
        <Heading
          eyebrow="La maison en détail"
          title="Chaque espace a sa place dans le séjour."
          description="Une lecture claire de la maison, de ses couchages et de ses espaces extérieurs."
        />
        <div className="property-spaces__grid">
          {property.spaces.map((space) => (
            <Card key={space.title} className="property-space-card">
              <h3>{space.title}</h3>
              <p>{space.detail}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="property-practical">
        <Heading
          eyebrow="Avant de venir"
          title="Les repères utiles, simplement."
          description="Les détails pratiques qui permettent d’arriver l’esprit libre."
        />
        <Container size="narrow">
          <dl className="property-practical__list">
            {property.practicalInformation.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
          <div className="property-faq">
            <h3>Questions fréquentes</h3>
            {property.faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
