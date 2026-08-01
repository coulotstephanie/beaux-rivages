import Image from "next/image";
import Link from "next/link";

export const freshWaterNote =
  "À votre arrivée, une carafe d’eau fraîche vous attend dans le réfrigérateur afin de commencer votre séjour dans les meilleures conditions.";

export const linenCareText =
  "Le linge fourni dans les expériences incluant cette prestation est entretenu avec le plus grand soin. Après chaque séjour, il est lavé et désinfecté selon un protocole rigoureux afin de garantir une hygiène irréprochable, un confort optimal et une qualité digne des standards hôteliers.";

export type ExperienceFaq = { question: string; answer: string };
export type ExperiencePractical = { label: string; value: string };
export type SimilarExperience = { title: string; href: string; image: string; imageAlt: string };

type Props = {
  presentation: string;
  included: string[];
  practical: ExperiencePractical[];
  faq: ExperienceFaq[];
  bookingHref?: string;
  bookingLabel?: string;
  bookingExternal?: boolean;
  linenIncluded?: boolean;
  similar: SimilarExperience[];
  sources?: { label: string; href: string }[];
  recommendedHouses?: { icon: string; title: string; text: string }[];
};

export function ExperienceSections({
  presentation,
  included,
  practical,
  faq,
  bookingHref,
  bookingLabel,
  bookingExternal = false,
  linenIncluded = false,
  similar,
  sources = [],
  recommendedHouses = [],
}: Props) {
  return (
    <>
      <section className="experience-unified-presentation shell">
        <p className="eyebrow">Présentation</p>
        <h2>Une expérience pensée pour être simple à vivre.</h2>
        <p>{presentation}</p>
      </section>

      {included.length > 0 ? (
        <section className="experience-unified-included shell">
          <p className="eyebrow">Ce qui est inclus</p>
          <h2>Des repères clairs, sans promesse imprécise.</h2>
          <ul>
            {included.map((item) => (
              <li key={item}>
                <span aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {recommendedHouses.length > 0 ? (
        <section
          className="experience-unified-included shell"
          aria-labelledby="recommended-houses-title"
        >
          <p className="eyebrow">Maisons recommandées</p>
          <h2 id="recommended-houses-title">À proximité des ateliers Confetti.</h2>
          <ul>
            {recommendedHouses.map((house) => (
              <li key={house.title}>
                <span aria-hidden="true">{house.icon}</span>
                <strong>{house.title}</strong> · {house.text}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {linenIncluded && (
        <section className="experience-linen shell" aria-labelledby="experience-linen-title">
          <p className="eyebrow">Le linge</p>
          <h2 id="experience-linen-title">Le soin jusque dans les détails.</h2>
          <p>{linenCareText}</p>
        </section>
      )}

      <section className="experience-unified-practical shell">
        <p className="eyebrow">Informations pratiques</p>
        <h2>Tout savoir avant de choisir.</h2>
        <dl>
          {practical.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
        <p className="experience-fresh-water">{freshWaterNote}</p>
        {sources.length > 0 && (
          <div className="experience-official-sources">
            <strong>Sources officielles vérifiées</strong>
            {sources.map((source) => (
              <a href={source.href} target="_blank" rel="noopener noreferrer" key={source.href}>
                {source.label}
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="experience-unified-faq shell">
        <p className="eyebrow">FAQ</p>
        <h2>Les réponses utiles.</h2>
        {faq.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>

      {bookingHref && bookingLabel ? (
        <section className="experience-detail-cta shell">
          <p className="eyebrow">Réserver</p>
          <h2>Prêt à donner une autre dimension à votre séjour ?</h2>
          <Link
            className="primary-button"
            href={bookingHref}
            target={bookingExternal ? "_blank" : undefined}
            rel={bookingExternal ? "noopener noreferrer" : undefined}
          >
            {bookingLabel}
          </Link>
        </section>
      ) : null}

      <section className="experience-similar shell" aria-labelledby="similar-experiences-title">
        <p className="eyebrow">Expériences similaires</p>
        <h2 id="similar-experiences-title">Poursuivre l’inspiration.</h2>
        <div>
          {similar.slice(0, 3).map((item) => (
            <Link href={item.href} key={item.href}>
              <span>
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
              </span>
              <strong>{item.title}</strong>
              <small>Découvrir →</small>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
