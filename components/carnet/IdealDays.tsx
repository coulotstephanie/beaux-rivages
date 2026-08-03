import Image from "next/image";
import { idealDays, premiumPlaces } from "@/carnetPremiumData";
import { Heading, Section } from "@/components/ui";

export function IdealDays() {
  return (
    <Section tone="sand" className="ideal-days" id="journees-ideales">
      <Heading
        eyebrow="Une journée à notre rythme"
        title="Sept façons de laisser les îles vous surprendre."
        description="En famille, à deux, à vélo ou sous un ciel changeant : voici les journées que nous composerions pour des amis, comme une invitation et jamais comme une obligation."
      />
      <div className="ideal-days__grid">
        {idealDays.map((day) => (
          <article key={day.slug} className="ideal-day-card">
            <div className="ideal-day-card__media">
              <Image
                src={day.image}
                alt={day.imageAlt}
                fill
                sizes="(max-width: 800px) 100vw, 42vw"
                loading="lazy"
                quality={85}
              />
              <p>{day.eyebrow}</p>
            </div>
            <div className="ideal-day-card__content">
              <h3>{day.title}</h3>
              <p>{day.description}</p>
              <ol>
                {day.stops.map((stop) => {
                  const place = stop.placeSlug
                    ? premiumPlaces.find((item) => item.slug === stop.placeSlug)
                    : undefined;
                  return (
                    <li key={`${day.slug}-${stop.time}-${stop.title}`}>
                      <time>{stop.time}</time>
                      <div>
                        <strong>{stop.title}</strong>
                        <span>{stop.detail}</span>
                        {place ? (
                          <a href={place.officialUrl} target="_blank" rel="noreferrer">
                            Lien officiel <span aria-hidden="true">↗</span>
                          </a>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
