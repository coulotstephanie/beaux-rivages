import type { Property } from "@/data";
import { Container } from "./ui";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr } from "@/i18n/lot1-client";

export function PropertyFacts({
  property,
  locale = "fr",
}: {
  property: Property;
  locale?: SupportedLocale;
}) {
  return (
    <Container
      as="section"
      className="premium-property-facts"
      aria-label={tr(locale, "Informations essentielles")}
    >
      {property.stats.map((stat) => (
        <div key={stat.label}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </Container>
  );
}
