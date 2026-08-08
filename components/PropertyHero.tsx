import Image from "next/image";
import type { Property } from "@/data";
import { BLUR_DATA_URL } from "@/media";
import { Badge, Button, Container } from "./ui";

export function PropertyHero({ property }: { property: Property }) {
  return (
    <section className="premium-property-hero" data-editor-field="hero" data-editor-kind="image">
      <Image
        key={property.hero}
        src={property.hero}
        alt={property.title}
        fill
        quality={95}
        priority
        fetchPriority="high"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        sizes="100vw"
        unoptimized={property.hero.startsWith("http")}
      />
      <div className="premium-property-hero__overlay" />
      <Container size="wide" className="premium-property-hero__content">
        <Badge light>
          <span data-editor-field="kicker">{property.kicker}</span>
        </Badge>
        <h1 data-editor-field="title">{property.title}</h1>
        <p data-editor-field="intro">{property.intro}</p>
        <div className="premium-property-hero__meta">
          <span data-editor-field="location">{property.location}</span>
          <span data-editor-field="capacity">{property.capacity}</span>
        </div>
        <div className="premium-property-hero__actions">
          <Button href={`/reserver?maison=${property.slug}`}>Imaginer mon séjour</Button>
          <Button href="#histoire" variant="secondary">
            Entrer dans la maison
          </Button>
        </div>
      </Container>
      <a href="#histoire" className="property-scroll-cue" aria-label="Découvrir la maison">
        <span />
        Découvrir
      </a>
    </section>
  );
}
