import type { MediaAsset } from "@/media/types";
import { Heading, Section } from "./ui";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr } from "@/i18n/lot1-client";

export function PropertyFilms({ films, poster, locale = "fr" }: { films: readonly MediaAsset[]; poster: string; locale?: SupportedLocale }) {
  if (films.length === 0) return null;

  return (
    <Section tone="sand" className="property-films">
      <Heading
        eyebrow={tr(locale, "La maison en mouvement")}
        title={tr(locale, "Entrez quelques instants.")}
        description={tr(locale, "Une visite spontanée pour ressentir les volumes, la lumière et l’atmosphère avant votre arrivée.")}
      />
      <div className={`property-films__grid${films.length === 1 ? " is-single" : ""}`}>
        {films.map((film) => (
          <figure key={film.src} className="property-films__item">
            <video
              controls
              muted
              suppressHydrationWarning
              playsInline
              preload="metadata"
              poster={film.poster ?? poster}
              aria-label={film.alt}
            >
              <source src={film.src} type="video/mp4" />
              {tr(locale, "Votre navigateur ne peut pas lire cette vidéo.")}
            </video>
            {film.caption && <figcaption>{film.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </Section>
  );
}
