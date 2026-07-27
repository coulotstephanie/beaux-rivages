import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestinationGuidePage } from "@/components/DestinationGuidePage";
import { StructuredData } from "@/components/StructuredData";
import { destinationGuides, getDestinationGuide } from "@/destinationGuides";
import type { PageSeoConfig } from "@/content/fr/seo";
import { createDestinationStructuredData, createPageMetadata } from "@/seo";

export function generateStaticParams() {
  return destinationGuides.map(({ slug }) => ({ slug }));
}

function getSeo(slug: string): PageSeoConfig | null {
  const guide = destinationGuides.find((item) => item.slug === slug);
  if (!guide) return null;
  const path = `/destinations/${guide.slug}` as `/${string}`;
  return {
    title: `Guide ${guide.title} | Beaux Rivages`,
    description: `${guide.introduction} Le guide personnel de Stéphanie et Bruno.`,
    path,
    breadcrumbs: [
      { name: "Accueil", path: "/" },
      { name: "Les îles", path: "/destinations" },
      { name: guide.title, path },
    ],
    schemaTypes: ["CollectionPage"],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seo = getSeo(slug);
  if (!seo) return {};
  const guide = getDestinationGuide(slug);
  return createPageMetadata({ ...seo, image: guide.hero });
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seo = getSeo(slug);
  if (!seo) notFound();
  const guide = getDestinationGuide(slug);
  return (
    <>
      <StructuredData data={createDestinationStructuredData(guide, seo)} />
      <DestinationGuidePage guide={guide} />
    </>
  );
}
