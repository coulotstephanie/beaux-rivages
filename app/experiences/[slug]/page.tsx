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
      label: "Réserver auprès de Confetti",
    },
    "bien-etre": {
      href: "https://www.reedukcoach.fr",
      label: "Réserver auprès de Reéduk Coach",
    },
  };
  const freeExperiences = ["lever-de-soleil", "coucher-de-soleil", "peche-a-pied", "famille"];
  const partner = directPartners[experience.slug];
  const included =
    experience.slug === "atelier-macarons"
      ? ["La présentation de l’atelier et notre recommandation personnelle"]
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
        presentation={experience.story ?? experience.text}
        included={included}
        practical={[
          { label: "Durée", value: experience.duration },
          {
            label: "Disponibilité",
            value: freeExperiences.includes(experience.slug)
              ? "Toute l’année"
              : experience.idealPeriod,
          },
          {
            label: "Maison",
            value: freeExperiences.includes(experience.slug)
              ? "Les trois maisons"
              : experience.recommendedProperty.label,
          },
          {
            label: "Tarif",
            value: freeExperiences.includes(experience.slug)
              ? "Gratuit"
              : partner
                ? "Selon le prestataire"
                : "Sur demande",
          },
          ...(experience.slug === "bien-etre"
            ? [
                {
                  label: "Réservation",
                  value: "Directement auprès de Reéduk Coach, notamment via Doctolib",
                },
              ]
            : []),
        ]}
        faq={[
          {
            question: "Faut-il réserver ?",
            answer: partner
              ? "Oui, directement auprès du prestataire et selon ses disponibilités."
              : "Les expériences gratuites se vivent librement, sans réservation spécifique.",
          },
          {
            question: "Cette expérience convient-elle à toutes les maisons ?",
            answer: freeExperiences.includes(experience.slug)
              ? "Oui, elle est valable pour les trois maisons."
              : `Elle est particulièrement adaptée à ${experience.recommendedProperty.label}.`,
          },
        ]}
        bookingHref={partner?.href ?? "/reserver"}
        bookingLabel={partner?.label ?? "Réserver une maison"}
        bookingExternal={Boolean(partner)}
        similar={similar}
      />
      <Footer />
    </main>
  );
}
