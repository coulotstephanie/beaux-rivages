import type { MediaAsset } from "@/media/types";
import { Heading, Section } from "./ui";

export function PropertyFilms({
  films,
  poster,
}: {
  films: readonly MediaAsset[];
  poster: string;
}) {
  if (films.length === 0) return null;

  return (
    <Section tone="sand" className="property-films">
      <Heading
        eyebrow="La maison en mouvement"
        title="Entrez quelques instants."
        description="Une visite spontanée pour ressentir les volumes, la lumière et l’atmosphère avant votre arrivée."
      />
      <div className={`property-films__grid${films.length === 1 ? " is-single" : ""}`}>
        {films.map((film) => (
          <figure key={film.src} className="property-films__item">
            <video
              controls
              muted
              playsInline
              preload="metadata"
              poster={poster}
              aria-label={film.alt}
            >
              <source src={film.src} type="video/mp4" />
              Votre navigateur ne peut pas lire cette vidéo.
            </video>
            {film.caption && <figcaption>{film.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </Section>
  );
}
