import type { Property } from "@/data";
import { Card, Container, Heading, Section } from "./ui";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr } from "@/i18n/lot1-client";

export function PropertyPracticalDetails({
  property,
  locale = "fr",
}: {
  property: Property;
  locale?: SupportedLocale;
}) {
  if (!property.spaces.length) return null;

  return (
    <>
      <Section tone="sand" className="property-spaces">
        <Heading
          eyebrow={tr(locale, "La maison en détail")}
          title={tr(locale, "Chaque espace a sa place dans le séjour.")}
          description={tr(
            locale,
            "Une lecture claire de la maison, de ses couchages et de ses espaces extérieurs.",
          )}
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
          eyebrow={tr(locale, "Avant de venir")}
          title={tr(locale, "Les repères utiles, simplement.")}
          description={tr(locale, "Les détails pratiques qui permettent d’arriver l’esprit libre.")}
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
            <h3>{tr(locale, "Questions fréquentes")}</h3>
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
