import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StructuredData } from "@/components/StructuredData";
import { experiences, getExperience } from "@/experiences";
import { SITE_URL } from "@/seo";

export function generateStaticParams() {
  return experiences.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperience(slug);
  if (!experience) return {};
  return {
    title: `${experience.title} | Expérience Beaux Rivages`,
    description: experience.text,
    alternates: { canonical: `${SITE_URL}/experiences/${slug}` },
    openGraph: {
      title: experience.title,
      description: experience.text,
      images: [experience.image],
    },
  };
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const canonicalServiceRoutes: Record<string, string> = {
    "pack-signature": "/experience-signature",
    romance: "/romance",
    anniversaire: "/anniversaire",
    "demande-en-mariage": "/demande-en-mariage",
  };
  if (canonicalServiceRoutes[slug]) permanentRedirect(canonicalServiceRoutes[slug]);
  const experience = getExperience(slug);
  if (!experience) notFound();
  const url = `${SITE_URL}/experiences/${experience.slug}`;
  return (
    <main>
      <StructuredData
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: experience.title,
            description: experience.text,
            url,
            inLanguage: "fr-FR",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
              {
                "@type": "ListItem",
                position: 2,
                name: "Expériences",
                item: `${SITE_URL}/experiences`,
              },
              { "@type": "ListItem", position: 3, name: experience.title, item: url },
            ],
          },
        ]}
      />
      <Header />
      <section className="experience-detail-hero">
        <Image src={experience.image} alt={experience.imageAlt} fill priority sizes="100vw" />
        <div>
          <p className="eyebrow light">{experience.eyebrow}</p>
          <h1>{experience.title}</h1>
          <p>{experience.text}</p>
        </div>
      </section>
      <section className="experience-detail-intro shell">
        <div>
          <p className="eyebrow">L’histoire</p>
          <h2>
            {experience.storyTitle ??
              "Un moment choisi pour sa justesse, pas pour remplir un programme."}
          </h2>
          <p>
            {experience.story ??
              `${experience.text} Stéphanie et Bruno recommandent cette expérience pour la relation qu’elle crée avec le territoire, la maison et les personnes avec qui l’on voyage.`}
          </p>
        </div>
        <aside>
          <div>
            <span>Durée</span>
            <strong>{experience.duration}</strong>
          </div>
          <div>
            <span>Meilleure période</span>
            <strong>{experience.idealPeriod}</strong>
          </div>
          <div>
            <span>Pour qui</span>
            <strong>{experience.audience}</strong>
          </div>
          <div>
            <span>Maison conseillée</span>
            <strong>{experience.recommendedProperty.label}</strong>
          </div>
        </aside>
      </section>
      <section className="experience-detail-advice">
        <div className="shell">
          <p className="eyebrow light">Notre proposition</p>
          <h2>
            {experience.whyTitle ??
              "Parce que les souvenirs les plus durables ont souvent besoin de peu."}
          </h2>
          <div>
            <div>
              <h3>À savoir</h3>
              <p>
                {experience.advice ??
                  "Prévoyez du temps avant et après. Une expérience Beaux Rivages n’est pas un rendez-vous à enchaîner, mais un point de départ pour vivre la journée autrement."}
              </p>
            </div>
            <div>
              <h3>Ce que nous pouvons organiser</h3>
              <ul>
                {(
                  experience.checklist ?? [
                    "Vérifier la météo et les conditions saisonnières",
                    "Réserver en avance lorsque nécessaire",
                    "Garder une marge pour profiter sans regarder l’heure",
                  ]
                ).map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="experience-detail-cta shell">
        <p className="eyebrow">Construire cette expérience</p>
        <h2>
          Parlez-nous de votre séjour : nous vous proposons une formule précise et vérifions sa
          disponibilité.
        </h2>
        <p>
          Le contenu définitif, les éventuels prestataires et le tarif vous sont toujours confirmés
          avant réservation.
        </p>
        <Link
          className="primary-button"
          href={`/reserver?experience=${experience.slug}${experience.option ? `&option=${experience.option}` : ""}`}
        >
          Demander une proposition
        </Link>
      </section>
      <Footer />
    </main>
  );
}
