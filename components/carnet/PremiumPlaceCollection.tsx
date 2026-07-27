import Image from "next/image";
import { premiumPlaces } from "@/carnetPremiumData";
import { Heading, Section } from "@/components/ui";

const destinationCopy = {
  "Île de Ré": "Artisans, villages, marchés et pistes : nos repères depuis Rivedoux.",
  "Île d’Oléron": "Fort Boyard, ports, forêt et plages : Oléron au rythme des marées.",
  "La Rochelle": "Vieux-Port, aquarium, tours, musées, shopping et solutions pratiques.",
} as const;

export function PremiumPlaceCollection() {
  return (
    <section className="premium-place-collection" id="guides">
      <span id="gastronomie" className="legacy-carnet-anchor" aria-hidden="true" />
      <span id="marches" className="legacy-carnet-anchor" aria-hidden="true" />
      {(Object.keys(destinationCopy) as (keyof typeof destinationCopy)[]).map((destination, destinationIndex) => {
        const places = premiumPlaces.filter((place) => place.destination === destination && !["parkings", "bornes-electriques"].includes(place.category));
        return (
          <Section key={destination} tone={destinationIndex % 2 ? "light" : "sand"} className="premium-place-destination">
            <Heading eyebrow="Guide premium" title={destination} description={destinationCopy[destination]} />
            <div className="premium-place-grid">
              {places.map((place) => (
                <article key={place.slug} className="premium-place-card">
                  <div className="premium-place-card__media">
                    <Image src={place.image} alt={place.imageAlt} fill sizes="(max-width: 800px) 100vw, 31vw" loading="lazy" quality={85} />
                    <span>{place.kind}</span>
                  </div>
                  <div className="premium-place-card__content">
                    <p>{place.destination}</p>
                    <h3>{place.name}</h3>
                    <p>{place.description}</p>
                    <dl>
                      <div><dt>Distance</dt><dd>{place.distance}</dd></div>
                      <div><dt>À vélo</dt><dd>{place.bikeTime}</dd></div>
                      <div><dt>À pied</dt><dd>{place.walkTime}</dd></div>
                    </dl>
                    {place.hostTip ? <blockquote><span>Notre conseil</span>« {place.hostTip} »</blockquote> : null}
                    <div className="premium-place-card__actions">
                      <a href={place.officialUrl} target="_blank" rel="noreferrer">Site officiel <span aria-hidden="true">↗</span></a>
                      <a href={place.mapUrl} target="_blank" rel="noreferrer">Carte <span aria-hidden="true">↗</span></a>
                    </div>
                    <p className="premium-place-card__credit">
                      Photo : <a href={place.imageSource} target="_blank" rel="noreferrer">{place.imageCredit}</a> · {place.imageLicense}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        );
      })}
    </section>
  );
}
