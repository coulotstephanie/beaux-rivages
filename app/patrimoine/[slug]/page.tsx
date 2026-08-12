import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeritageDetail } from "@/components/heritage/HeritageDetail";
import { StructuredData } from "@/components/StructuredData";
import { getHeritageSite, heritageSites } from "@/content/patrimoine";
import { getHeritageEditorial } from "@/content/patrimoinePremium";
import { listHeritageMedia } from "@/platform/heritage/media";
import { absoluteUrl, createPageMetadata } from "@/seo";

type HeritagePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return heritageSites.map((site) => ({ slug: site.slug }));
}

export async function generateMetadata({ params }: HeritagePageProps): Promise<Metadata> {
  const site = getHeritageSite((await params).slug);
  if (!site) return {};
  const isBaleines = site.slug === "phare-des-baleines";
  const isSaintMartin = site.slug === "fortifications-vauban-saint-martin-de-re";
  const isFortLaPree = site.slug === "fort-la-pree";
  const isChateliers = site.slug === "abbaye-des-chateliers";
  const isMaraisSalants = site.slug === "marais-salants-ile-de-re";
  const conciseSeo: Record<string, { title: string; description: string }> = {
    "lilleau-des-niges": {
      title: "Lilleau des Niges : réserve naturelle | Beaux Rivages",
      description:
        "Découvrez la réserve naturelle de Lilleau des Niges au cœur des marais de l’Île de Ré, ses oiseaux migrateurs et nos conseils de visite.",
    },
    "fier-d-ars": {
      title: "Le Fier d’Ars sur l’Île de Ré | Beaux Rivages",
      description:
        "Explorez le Fier d’Ars, paysage sauvage entre océan et marais salants, avec nos conseils et itinéraires depuis les maisons Beaux Rivages.",
    },
    "ecluses-a-poissons-ile-de-re": {
      title: "Écluses à poissons de l’Île de Ré | Beaux Rivages",
      description:
        "Découvrez les écluses à poissons de l’Île de Ré, leur histoire et leur fonctionnement, avec nos conseils pour les observer à marée basse.",
    },
    "pont-de-l-ile-de-re": {
      title: "Le pont de l’Île de Ré : histoire et vue | Beaux Rivages",
      description:
        "Découvrez l’histoire du pont de l’Île de Ré, ses points de vue et nos conseils pour rejoindre les maisons Beaux Rivages à Rivedoux-Plage.",
    },
    "foret-des-saumonards": {
      title: "Forêt des Saumonards à Oléron | Beaux Rivages",
      description:
        "Promenez-vous dans la forêt des Saumonards entre pins, dunes et océan, près de Boyardville et du Nid d’Été, face à Fort Boyard.",
    },
    "citadelle-du-chateau-d-oleron": {
      title: "Citadelle du Château-d’Oléron | Beaux Rivages",
      description:
        "Découvrez la citadelle du Château-d’Oléron, son histoire, ses remparts et nos conseils pour préparer votre visite depuis Boyardville.",
    },
    "cabanes-ostreicoles-chateau-d-oleron": {
      title: "Cabanes ostréicoles du Château-d’Oléron | Beaux Rivages",
      description:
        "Découvrez les cabanes ostréicoles colorées du Château-d’Oléron, les chenaux et les savoir-faire locaux depuis Le Nid d’Été à Boyardville.",
    },
    "phare-de-chassiron": {
      title: "Phare de Chassiron : visite à Oléron | Beaux Rivages",
      description:
        "Découvrez le phare de Chassiron à la pointe nord de l’Île d’Oléron, son jardin, son panorama et nos conseils pour préparer votre visite.",
    },
  };
  const concise = conciseSeo[site.slug];
  return createPageMetadata({
    title: concise?.title ?? (isBaleines
      ? "Phare des Baleines : histoire, visite et conseils | Beaux Rivages"
      : isSaintMartin
        ? "Fortifications Vauban à Saint-Martin-de-Ré | Beaux Rivages"
        : isFortLaPree
          ? "Fort La Prée : histoire et visite sur l’Île de Ré | Beaux Rivages"
          : isChateliers
            ? "Abbaye des Châteliers : histoire et visite | Beaux Rivages"
            : isMaraisSalants
              ? "Marais salants de l’Île de Ré : sel et sauniers | Beaux Rivages"
              : `${site.title} — patrimoine de ${site.island} | Beaux Rivages`),
    description: concise?.description ?? (isBaleines
      ? "Découvrez l’histoire du Phare des Baleines, sa Vieille Tour, ses 257 marches, son panorama et les conseils de Stéphanie & Bruno pour préparer votre visite."
      : isSaintMartin
        ? "Découvrez Saint-Martin-de-Ré, ses remparts Vauban inscrits à l’UNESCO, son port historique et les conseils de Stéphanie & Bruno pour préparer votre visite."
        : isFortLaPree
          ? "Découvrez Fort La Prée, le plus ancien fort militaire de l’Île de Ré : histoire, architecture, visite en famille et conseils de Stéphanie & Bruno."
          : isChateliers
            ? "Découvrez l’Abbaye des Châteliers : neuf siècles d’histoire cistercienne, ses ruines, son rôle dans la vigne et les conseils de Stéphanie & Bruno."
            : isMaraisSalants
              ? "Découvrez les marais salants de l’Île de Ré, le métier de saunier, la fleur de sel, la biodiversité et nos conseils pour préparer votre visite."
              : `${site.subtitle}. Histoire, conseils de visite et itinéraires depuis les maisons Beaux Rivages.`),
    path: `/patrimoine/${site.slug}`,
    image: site.images[0].src,
  });
}

export default async function HeritagePage({ params }: HeritagePageProps) {
  const site = getHeritageSite((await params).slug);
  if (!site) notFound();
  const editorial = getHeritageEditorial(site.slug);
  const managed = await listHeritageMedia(site.slug, true).catch(() => []);
  const managedImages = managed.map((image) => ({
    src: image.src,
    alt: image.alt,
    caption: image.caption,
  }));
  const managedCover = managed.findIndex((image) => image.isCover);
  const images =
    managedCover >= 0
      ? [
          ...managedImages.slice(managedCover, managedCover + 1),
          ...managedImages.filter((_, index) => index !== managedCover),
          ...site.images,
        ]
      : [site.images[0], ...managedImages, ...site.images.slice(1)];
  const url = absoluteUrl(`/patrimoine/${site.slug}`);
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": site.landmark
        ? ["TouristAttraction", "LandmarksOrHistoricalBuildings"]
        : "TouristAttraction",
      name: site.title,
      description: site.introduction,
      url,
      image: site.images.map((image) => absoluteUrl(image.src)),
      geo: {
        "@type": "GeoCoordinates",
        latitude: site.coordinates.lat,
        longitude: site.coordinates.lng,
      },
      isAccessibleForFree: site.price.toLowerCase().includes("gratuit"),
      touristType: site.audiences,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Patrimoine", item: absoluteUrl("/patrimoine") },
        { "@type": "ListItem", position: 3, name: site.title, item: url },
      ],
    },
  ];
  return (
    <>
      <StructuredData data={schema} />
      <HeritageDetail site={site} editorial={editorial} images={images} />
    </>
  );
}
