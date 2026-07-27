import type { Property } from "@/data";
import { Card, Heading, Section } from "./ui";

export function PropertyHighlights({ property }: { property: Property }) {
  return (
    <Section tone="sand" className="premium-highlights">
      <Heading eyebrow="Les points forts" title="Ce qui rend cette maison unique." />
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
