import { premiumPlaces } from "@/carnetPremiumData";
import { heritageSites } from "@/content/patrimoine";
import { properties } from "@/data";
import { destinationGuides } from "@/destinationGuides";
import { experiences, getExperienceHref } from "@/experiences";

export type PublicSearchItem = {
  title: string;
  href: string;
  type: "Maison" | "Patrimoine" | "Île" | "Adresse" | "Plage" | "Expérience" | "Carnet";
  description: string;
  keywords: string;
};

const editorialItems: PublicSearchItem[] = [
  {
    title: "Le Carnet Beaux Rivages",
    href: "/carnet",
    type: "Carnet",
    description: "Bonnes adresses, marchés, plages et cartes.",
    keywords: "restaurant gastronomie producteurs marché vélo itinéraire",
  },
  {
    title: "Les saisons",
    href: "/saisons",
    type: "Carnet",
    description: "Ré et Oléron au printemps, en été, en automne et en hiver.",
    keywords: "printemps été automne hiver halloween noël",
  },
  {
    title: "Les conseils de Stéphanie & Bruno",
    href: "/conseils",
    type: "Carnet",
    description: "Nos astuces et nos lieux préférés.",
    keywords: "conseils astuces coups de coeur recommandations",
  },
  {
    title: "Nos petits bonheurs",
    href: "/nos-petits-bonheurs",
    type: "Carnet",
    description: "Anecdotes, traditions et découvertes.",
    keywords: "anecdotes traditions découvertes",
  },
  {
    title: "Photothèque",
    href: "/phototheque",
    type: "Carnet",
    description: "Les îles et les maisons en images.",
    keywords: "photos galerie images",
  },
];

export const publicSearchIndex: PublicSearchItem[] = [
  ...properties.map((property): PublicSearchItem => ({
    title: property.title,
    href: `/maisons/${property.slug}`,
    type: "Maison",
    description: property.location,
    keywords: `${property.intro} ${property.highlights.join(" ")}`,
  })),
  ...destinationGuides.map((guide): PublicSearchItem => ({
    title: guide.title,
    href: `/destinations/${guide.slug}`,
    type: "Île",
    description: guide.introduction,
    keywords: `${guide.kicker} ${guide.addresses.map((address) => address.name).join(" ")}`,
  })),
  ...heritageSites.map((site): PublicSearchItem => ({
    title: site.title,
    href: `/patrimoine/${site.slug}`,
    type: "Patrimoine",
    description: `${site.island} · ${site.subtitle}`,
    keywords: `${site.introduction} ${site.audiences.join(" ")}`,
  })),
  ...experiences.map((experience): PublicSearchItem => ({
    title: experience.title,
    href: getExperienceHref(experience.slug),
    type: "Expérience",
    description: experience.text,
    keywords: `${experience.eyebrow} ${experience.audience} ${experience.idealPeriod}`,
  })),
  ...premiumPlaces.map((place): PublicSearchItem => ({
    title: place.name,
    href: `/carnet?recherche=${encodeURIComponent(place.name)}#guides`,
    type: place.category === "plages" ? "Plage" : "Adresse",
    description: `${place.destination} · ${place.kind}`,
    keywords: `${place.description} ${place.category} ${place.address}`,
  })),
  ...editorialItems,
];
