import type { Property } from "@/data";
import { Card, Heading, Section } from "./ui";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr } from "@/i18n/lot1-client";

export function PropertyHighlights({
  property,
  locale = "fr",
}: {
  property: Property;
  locale?: SupportedLocale;
}) {
  return (
    <Section tone="sand" className="premium-highlights">
      <Heading
        eyebrow={tr(locale, "Les points forts")}
        title={tr(locale, "Ce qui rend cette maison unique.")}
      />
      <div className="premium-highlights__grid">
        {property.highlights.map((item, index) => (
          <Card className="premium-highlight-card" key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item}</h3>
          </Card>
        ))}
      </div>
    </Section>
  );
}
