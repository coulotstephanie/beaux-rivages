import Image from "next/image";
import Link from "next/link";
import { getExperienceHref, type Experience } from "@/experiences";
import { getExperienceEditorial } from "@/experienceEditorial";

function bookingHref(experience: Experience) {
  const params = new URLSearchParams({ experience: experience.slug });
  if (experience.recommendedProperty.slug)
    params.set("maison", experience.recommendedProperty.slug);
  if (experience.option) params.set("option", experience.option);
  return `/reserver?${params.toString()}`;
}

export function ExperienceCollection({ experiences }: { experiences: Experience[] }) {
  const transitions = [
    "Prenez le temps. Les îles se découvrent à leur propre rythme.",
    "Parce que certaines vacances restent gravées bien après le retour.",
    "Les plus beaux souvenirs sont souvent les plus simples.",
  ];
  const freeExperiences = new Set([
    "lever-de-soleil",
    "coucher-de-soleil",
    "peche-a-pied",
    "balade-velo",
    "famille",
    "atelier-macarons",
    "bien-etre",
  ]);
  return (
    <section className="premium-experience-collection shell" aria-label="Collection d’expériences">
      {experiences.map((experience, index) => {
        const editorial = getExperienceEditorial(experience.slug);
        return (
          <div className="premium-experience-card-wrap" key={experience.slug}>
            <article id={experience.slug} className="premium-experience-card" key={experience.slug}>
              <div className="premium-experience-card__media">
                <Image
                  src={experience.image}
                  alt={experience.imageAlt}
                  fill
                  quality={90}
                  loading="lazy"
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
              </div>
              <div className="premium-experience-card__copy">
                <p className="eyebrow">{experience.eyebrow}</p>
                <h2>{experience.title}</h2>
                <p className="premium-experience-card__hook">{editorial.hook}</p>
                <p>{experience.text}</p>
                <dl>
                  <div>
                    <dt>Durée</dt>
                    <dd>{experience.duration}</dd>
                  </div>
                  <div>
                    <dt>Période idéale</dt>
                    <dd>{experience.idealPeriod}</dd>
                  </div>
                  <div>
                    <dt>Maison conseillée</dt>
                    <dd>{experience.recommendedProperty.label}</dd>
                  </div>
                  <div>
                    <dt>Pour qui</dt>
                    <dd>{experience.audience}</dd>
                  </div>
                </dl>
                <div className="premium-experience-card__actions">
                  <Link href={getExperienceHref(experience.slug)}>
                    Voir l’expérience <span aria-hidden="true">→</span>
                  </Link>
                  {!freeExperiences.has(experience.slug) ? (
                    <Link href={bookingHref(experience)}>
                      Demander cette suggestion <span aria-hidden="true">+</span>
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
            {index < experiences.length - 1 ? (
              <p className="experience-card-transition">
                {transitions[index % transitions.length]}
              </p>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
