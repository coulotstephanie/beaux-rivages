import Image from "next/image";
import Link from "next/link";
import type { Experience } from "@/experiences";

function bookingHref(experience: Experience) {
  const params = new URLSearchParams({ experience: experience.slug });
  if (experience.recommendedProperty.slug) params.set("maison", experience.recommendedProperty.slug);
  if (experience.option) params.set("option", experience.option);
  return `/reserver?${params.toString()}`;
}

export function ExperienceCollection({ experiences }: { experiences: Experience[] }) {
  return (
    <section className="premium-experience-collection shell" aria-label="Collection d’expériences">
      {experiences.map((experience) => (
        <article id={experience.slug} className="premium-experience-card" key={experience.slug}>
          <div className="premium-experience-card__media">
            <Image src={experience.image} alt={experience.imageAlt} fill quality={90} loading="lazy" sizes="(max-width: 800px) 100vw, 50vw" />
          </div>
          <div className="premium-experience-card__copy">
            <p className="eyebrow">{experience.eyebrow}</p>
            <h2>{experience.title}</h2>
            <p>{experience.text}</p>
            <dl>
              <div><dt>Durée</dt><dd>{experience.duration}</dd></div>
              <div><dt>Période idéale</dt><dd>{experience.idealPeriod}</dd></div>
              <div><dt>Maison conseillée</dt><dd>{experience.recommendedProperty.label}</dd></div>
              <div><dt>Pour qui</dt><dd>{experience.audience}</dd></div>
            </dl>
            <div className="premium-experience-card__actions">
              <Link href={`/experiences/${experience.slug}`}>Voir l’expérience <span aria-hidden="true">→</span></Link>
              <Link href={bookingHref(experience)}>Ajouter à mon séjour <span aria-hidden="true">+</span></Link>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
