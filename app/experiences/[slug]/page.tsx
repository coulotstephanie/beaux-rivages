import type { Metadata } from "next";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StructuredData } from "@/components/StructuredData";
import { experiences, getExperience } from "@/experiences";
import { SITE_URL } from "@/seo";
import { ExperienceSections } from "@/components/experiences/ExperienceSections";

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
  const directPartners: Record<string, { href: string; label: string }> = {
    "atelier-macarons": {
      href: "https://www.confetti-patisserie.com",
      label: "Découvrir les ateliers chez Confetti",
    },
    "bien-etre": {
      href: "https://www.reedukcoach.fr",
      label: "Réserver auprès de Reéduk Coach",
    },
  };
  const freeExperiences = ["lever-de-soleil", "coucher-de-soleil", "peche-a-pied", "famille"];
  const partner = directPartners[experience.slug];
  const isFree = freeExperiences.includes(experience.slug);
  const included =
    experience.slug === "atelier-macarons"
      ? []
      : experience.slug === "bien-etre"
        ? ["La présentation de l’expérience et notre recommandation personnelle"]
        : [
            experience.storyTitle ?? "Un moment libre, au rythme de l’océan",
            "Nos repères pour choisir le lieu et le bon moment",
            ...(experience.slug === "peche-a-pied"
              ? [
                  "Nous recommandons les grandes marées afin de profiter pleinement de cette activité.",
                ]
              : []),
          ];
  const similar = experiences
    .filter((item) => item.slug !== experience.slug)
    .map((item) => ({
      title: item.title,
      href: `/experiences/${item.slug}`,
      image: item.image,
      imageAlt: item.imageAlt,
    }));
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
      <ExperienceSections
        presentation={
          experience.slug === "atelier-macarons"
            ? `${experience.text} Les ateliers sont proposés directement par Confetti Pâtisserie et doivent être réservés selon leurs disponibilités.`
            : (experience.story ?? experience.text)
        }
        included={included}
        practical={[
          { label: "Durée", value: experience.duration },
          {
            label: "Disponibilité",
            value: isFree ? "Toute l’année" : experience.idealPeriod,
          },
          {
            label: "Maison",
            value: isFree ? "Les trois maisons" : experience.recommendedProperty.label,
          },
          {
            label: "Tarif",
            value: isFree ? "Gratuit" : partner ? "Selon le prestataire" : "Sur demande",
          },
          ...(experience.slug === "bien-etre"
            ? [
                {
                  label: "Réservation",
                  value: "Directement auprès de Reéduk Coach, notamment via Doctolib",
                },
              ]
            : []),
          ...(experience.slug === "atelier-macarons"
            ? [
                {
                  label: "Réservation",
                  value: "Directement chez Confetti à Rivedoux-Plage, selon leurs disponibilités",
                },
              ]
            : []),
        ]}
        faq={
          isFree
            ? [
                {
                  question: "Qui peut profiter de cette expérience ?",
                  answer: "Elle est gratuite et accessible à tous les voyageurs des trois maisons.",
                },
                {
                  question: "Quand la vivre ?",
                  answer:
                    experience.advice ??
                    `Le meilleur moment dépend de la saison, de la météo et des marées.`,
                },
              ]
            : [
                {
                  question: "Faut-il réserver ?",
                  answer: partner
                    ? "Oui, directement auprès du prestataire et selon ses disponibilités."
                    : "Oui, depuis le parcours de réservation Beaux Rivages.",
                },
                {
                  question: "Quelles maisons sont recommandées ?",
                  answer:
                    experience.slug === "atelier-macarons"
                      ? "Le Chai des Tortues et Villa Raie Manta sont les plus proches de Rivedoux-Plage."
                      : `Cette expérience est particulièrement adaptée à ${experience.recommendedProperty.label}.`,
                },
              ]
        }
        bookingHref={isFree ? undefined : (partner?.href ?? "/reserver")}
        bookingLabel={isFree ? undefined : (partner?.label ?? "Ajouter à ma réservation")}
        bookingExternal={Boolean(partner)}
        recommendedHouses={
          experience.slug === "atelier-macarons"
            ? [
                {
                  icon: "🐢",
                  title: "Le Chai des Tortues",
                  text: "Une maison particulièrement pratique pour rejoindre Confetti à Rivedoux-Plage.",
                },
                {
                  icon: "🌊",
                  title: "Villa Raie Manta",
                  text: "Une situation adaptée pour profiter facilement des ateliers à Rivedoux-Plage.",
                },
              ]
            : []
        }
        similar={similar}
      />
      <Footer />
    </main>
  );
}
