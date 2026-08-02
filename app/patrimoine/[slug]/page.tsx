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
  return createPageMetadata({
    title: isBaleines
      ? "Phare des Baleines : histoire, visite et conseils | Beaux Rivages"
      : isSaintMartin
        ? "Saint-Martin-de-Ré et fortifications Vauban UNESCO | Beaux Rivages"
        : isFortLaPree
          ? "Fort La Prée : histoire et visite sur l’Île de Ré | Beaux Rivages"
          : isChateliers
            ? "Abbaye des Châteliers : histoire et visite | Beaux Rivages"
            : isMaraisSalants
              ? "Marais salants de l’Île de Ré : sel et sauniers | Beaux Rivages"
              : `${site.title} — patrimoine de ${site.island} | Beaux Rivages`,
    description: isBaleines
      ? "Découvrez l’histoire du Phare des Baleines, sa Vieille Tour, ses 257 marches, son panorama et les conseils de Stéphanie & Bruno pour préparer votre visite."
      : isSaintMartin
        ? "Découvrez Saint-Martin-de-Ré, ses remparts Vauban inscrits à l’UNESCO, son port historique et les conseils de Stéphanie & Bruno pour préparer votre visite."
        : isFortLaPree
          ? "Découvrez Fort La Prée, le plus ancien fort militaire de l’Île de Ré : histoire, architecture, visite en famille et conseils de Stéphanie & Bruno."
          : isChateliers
            ? "Découvrez l’Abbaye des Châteliers : neuf siècles d’histoire cistercienne, ses ruines, son rôle dans la vigne et les conseils de Stéphanie & Bruno."
            : isMaraisSalants
              ? "Découvrez les marais salants de l’Île de Ré, le métier de saunier, la fleur de sel, la biodiversité et nos conseils pour préparer votre visite."
              : `${site.subtitle}. Histoire, conseils de visite et itinéraires depuis les maisons Beaux Rivages.`,
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
