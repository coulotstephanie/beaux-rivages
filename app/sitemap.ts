import type { MetadataRoute } from "next";
import { properties } from "@/data";
import { destinationGuides } from "@/destinationGuides";
import { experiences } from "@/experiences";
import { productionLocales } from "@/i18n/config";

const staticRoutes = [
  "",
  "/maisons",
  "/carnet",
  "/conciergerie",
  "/choisir",
  "/construisez-votre-sejour",
  "/avant-arrivee",
  "/conseils",
  "/mot-de-stephanie",
  "/avis",
  "/livre-d-or",
  "/coulisses",
  "/destinations",
  "/engagements",
  "/experiences",
  "/experience-signature",
  "/panier-aperitif",
  "/panier-douceur",
  "/romance",
  "/demande-en-mariage",
  "/anniversaire",
  "/bebe",
  "/animaux",
  "/faq",
  "/inspiration",
  "/personnaliser",
  "/phototheque",
  "/pourquoi-beaux-rivages",
  "/pourquoi-revenir",
  "/reserver",
  "/saisons",
  "/sejour",
  "/conditions-generales-de-vente",
  "/conditions-generales-utilisation",
  "/politique-annulation",
  "/politique-remboursement",
  "/mentions-legales",
  "/politique-de-confidentialite",
  "/politique-de-cookies",
  "/charte-qualite",
  "/engagements-environnement",
  "/charte-animaux",
  "/charte-bon-voisinage",
  "/accessibilite",
  "/faq-juridique",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.beaux-rivages.com";
  const propertyRoutes = properties.map((property) => `/maisons/${property.slug}`);
  const guideRoutes = destinationGuides.map((guide) => `/destinations/${guide.slug}`);
  const experienceRoutes = experiences.map((experience) => `/experiences/${experience.slug}`);

  return [...staticRoutes, ...propertyRoutes, ...guideRoutes, ...experienceRoutes].flatMap(
    (route) => {
      const languages = Object.fromEntries(
        productionLocales.map((locale) => [
          locale,
          `${baseUrl}${locale === "fr" ? "" : `/${locale}`}${route}`,
        ]),
      );
      return productionLocales.map((locale) => ({
        url: languages[locale],
        alternates: { languages: { ...languages, "x-default": `${baseUrl}${route}` } },
        changeFrequency: (route === "" ? "weekly" : "monthly") as "weekly" | "monthly",
        priority:
          route === ""
            ? 1
            : route.startsWith("/maisons")
              ? 0.9
              : route.startsWith("/destinations/") || route.startsWith("/experiences/")
                ? 0.85
                : 0.7,
      }));
    },
  );
}
