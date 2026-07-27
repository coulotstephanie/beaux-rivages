import Link from "next/link";
import { properties } from "@/data";
import type { DestinationGuide } from "@/destinationGuides";
import { Container } from "./ui";

export function DestinationPropertyLinks({ guide }: { guide: DestinationGuide }) {
  const houses = properties.filter((property) =>
    guide.slug === "ile-de-re"
      ? property.slug !== "nid-d-ete"
      : guide.slug === "ile-d-oleron"
        ? property.slug === "nid-d-ete"
        : true
  );
  return (
    <section className="destination-guide__houses">
      <Container>
        <p className="eyebrow">Habiter la destination</p>
        <h2>Les maisons conseillées pour ce guide</h2>
        <div>
          {houses.map((property) => (
            <Link href={`/maisons/${property.slug}`} key={property.slug}>
              <span>{property.location}</span><strong>{property.title}</strong><small>{property.capacity} · Découvrir la maison →</small>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
