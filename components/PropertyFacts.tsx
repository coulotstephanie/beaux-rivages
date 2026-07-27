import type { Property } from "@/data";
import { Container } from "./ui";

export function PropertyFacts({ property }: { property: Property }) {
  return (
    <Container as="section" className="premium-property-facts" aria-label="Informations essentielles">
      {property.stats.map((stat) => (
        <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>
      ))}
    </Container>
  );
}
