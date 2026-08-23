import type { Metadata } from "next";
import type { PageSeoConfig } from "@/content/fr/seo";
import type { Property } from "@/data";
import type { DestinationGuide } from "@/destinationGuides";
import { productionLocales, type SupportedLocale } from "@/i18n/config";

export const SITE_URL = "https://www.beaux-rivages.com";
const DEFAULT_SOCIAL_IMAGE = "/images/destination/marais-coucher-soleil.jpeg";

export type PageMetadataInput = Pick<PageSeoConfig, "title" | "description" | "path"> & {
  title: string;
  description: string;
  image?: string;
  openGraphTitle?: string;
};

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

export function localizedUrl(path: string, locale: SupportedLocale) {
  const normalized = path === "/" ? "" : path;
  return `${SITE_URL}${locale === "fr" ? "" : `/${locale}`}${normalized}`;
}

export function languageAlternates(path: string) {
  return {
    ...Object.fromEntries(productionLocales.map((locale) => [locale, localizedUrl(path, locale)])),
    "x-default": absoluteUrl(path),
  };
}

export function createPageMetadata({
  title,
  description,
  image,
  openGraphTitle,
}: PageMetadataInput): Metadata {
  const socialImage = absoluteUrl(image ?? DEFAULT_SOCIAL_IMAGE);

  return {
    title,
    description,
    openGraph: {
      title: openGraphTitle ?? title,
      description,
      siteName: "Beaux Rivages",
      locale: "fr_FR",
      type: "website",
      images: [{ url: socialImage, alt: openGraphTitle ?? title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

function breadcrumbSchema(config: PageSeoConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: config.breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: absoluteUrl(breadcrumb.path),
    })),
  };
}

export function createPageStructuredData(config: PageSeoConfig): Record<string, unknown>[] {
  const url = absoluteUrl(config.path);
  const schemas = config.schemaTypes.map((schemaType) => {
    if (schemaType === "WebSite") {
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Beaux Rivages",
        url: SITE_URL,
        inLanguage: "fr-FR",
        publisher: { "@id": `${SITE_URL}#organization` },
      };
    }

    if (schemaType === "Organization") {
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: "Beaux Rivages",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/icon.svg"),
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+33 6 17 26 00 94",
          email: "coulotstephanie@gmail.com",
          contactType: "reservations",
          availableLanguage: ["français"],
        },
      };
    }

    return {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: config.title,
      description: config.description,
      url,
      inLanguage: "fr-FR",
      isPartOf: {
        "@type": "WebSite",
        name: "Beaux Rivages",
        url: SITE_URL,
      },
    };
  });

  return [...schemas, breadcrumbSchema(config)];
}

export function createPropertySeo(property: Property): PageSeoConfig {
  const path = `/maisons/${property.slug}` as const;
  const locality = property.location.split(" · ")[0];
  return {
    title: `${property.title}, ${locality} | Beaux Rivages`,
    description: property.seoDescription,
    path,
    breadcrumbs: [
      { name: "Accueil", path: "/" },
      { name: "Nos maisons", path: "/maisons" },
      { name: property.title, path },
    ],
    schemaTypes: ["WebPage"],
  };
}

export function createPropertyStructuredData(property: Property): Record<string, unknown>[] {
  const config = createPropertySeo(property);
  const url = absoluteUrl(config.path);
  const lodgingId = `${url}#lodging`;
  const capacity = Number(property.capacity.match(/\d+/)?.[0] ?? 0);
  const bedrooms = Number(property.stats.find((stat) => stat.label === "chambres")?.value ?? 0);
  const bathroomsFromStats = Number(
    property.stats.find((stat) => stat.label.includes("salle"))?.value ?? 0,
  );
  const bathrooms =
    bathroomsFromStats ||
    property.spaces
      .filter((space) => /salle(?:s)? (?:de bain|d’eau)/i.test(space.title))
      .reduce((total, space) => {
        const statedCount = Number(space.title.match(/\d+/)?.[0] ?? 0);
        if (statedCount) return total + statedCount;
        if (/\bdeux\b/i.test(space.title)) return total + 2;
        return total + 1;
      }, 0);
  const pageSchemas = createPageStructuredData(config).map((schema) =>
    schema["@type"] === "WebPage" ? { ...schema, mainEntity: { "@id": lodgingId } } : schema,
  );

  return [
    {
      "@context": "https://schema.org",
      "@type": "VacationRental",
      "@id": lodgingId,
      name: property.title,
      description: property.seoDescription,
      occupancy: {
        "@type": "QuantitativeValue",
        maxValue: capacity,
        unitText: "voyageurs",
      },
      numberOfBedrooms: bedrooms,
      numberOfBathroomsTotal: bathrooms,
      petsAllowed: property.amenityGroups.some((group) =>
        group.items.some((item) => item.toLocaleLowerCase("fr").includes("animaux")),
      ),
      address: {
        "@type": "PostalAddress",
        addressLocality: property.location.split(" · ")[0],
        addressRegion: property.location.split(" · ")[1],
        addressCountry: "FR",
      },
      containedInPlace: {
        "@type": "TouristDestination",
        name: property.location.split(" · ")[1],
        url: absoluteUrl(
          property.slug === "nid-d-ete" ? "/destinations/ile-d-oleron" : "/destinations/ile-de-re",
        ),
      },
      image: property.gallery.map((image) => absoluteUrl(image.src)),
      amenityFeature: property.amenityGroups.flatMap((group) =>
        group.items.map((item) => ({
          "@type": "LocationFeatureSpecification",
          name: item,
          value: true,
        })),
      ),
      potentialAction: {
        "@type": "ReserveAction",
        target: absoluteUrl(`/reserver?maison=${property.slug}`),
      },
      url,
      mainEntityOfPage: url,
    },
    ...(property.faq.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: property.faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]
      : []),
    ...pageSchemas,
  ];
}

export function createDestinationStructuredData(
  guide: DestinationGuide,
  config: PageSeoConfig,
): Record<string, unknown>[] {
  const url = absoluteUrl(config.path);
  const destinationId = `${url}#destination`;
  const pageSchemas = createPageStructuredData(config).map((schema) =>
    schema["@type"] === "CollectionPage"
      ? { ...schema, mainEntity: { "@id": destinationId } }
      : schema,
  );
  return [
    {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      "@id": destinationId,
      name: guide.title,
      description: guide.introduction,
      url,
      image: guide.gallery.map((image) => absoluteUrl(image.src)),
      touristType: ["Familles", "Couples", "Cyclotouristes", "Voyageurs gourmands"],
      includesAttraction: guide.chapters.map((chapter) => ({
        "@type": "TouristAttraction",
        name: chapter.title,
        description: chapter.copy,
        image: absoluteUrl(chapter.image),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Itinéraires recommandés — ${guide.title}`,
      itemListElement: guide.itineraries.map((itinerary, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: itinerary.title,
        description: itinerary.steps.join(" → "),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    ...pageSchemas,
  ];
}
