import Image from "next/image";
import type { Property } from "@/data";
import { BLUR_DATA_URL } from "@/media";
import { Badge, Button, Container } from "./ui";

export function PropertyHero({ property }: { property: Property }) {
  return (
    <section className="premium-property-hero">
      <Image src={property.hero} alt={property.title} fill quality={95} priority fetchPriority="high" placeholder="blur" blurDataURL={BLUR_DATA_URL} sizes="100vw" />
      <div className="premium-property-hero__overlay" />
      <Container size="wide" className="premium-property-hero__content">
        <Badge light>{property.kicker}</Badge>
        <h1>{property.title}</h1>
        <p>{property.intro}</p>
        <div className="premium-property-hero__meta">
          <span>{property.location}</span>
          <span>{property.capacity}</span>
        </div>
        <div className="premium-property-hero__actions">
          <Button href={`/reserver?maison=${property.slug}`}>Imaginer mon séjour</Button>
          <Button href="#histoire" variant="secondary">Entrer dans la maison</Button>
        </div>
      </Container>
      <a href="#histoire" className="property-scroll-cue" aria-label="Découvrir la maison"><span />Découvrir</a>
    </section>
  );
}
