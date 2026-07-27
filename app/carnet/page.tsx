import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  CarnetExperiences,
  CarnetHero,
  IdealDays,
  CarnetNavigation,
  PremiumInteractiveMap,
  PremiumPlaceCollection,
} from "@/components/carnet";
import { Heading, Section } from "@/components/ui";
import { createPageMetadata } from "@/seo";
import { PageStructuredData } from "@/components/PageStructuredData";
import { StructuredData } from "@/components/StructuredData";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import { premiumPlaces } from "@/carnetPremiumData";
import { absoluteUrl } from "@/seo";

const pageSeo = staticPageSeo["/carnet"];
export const metadata = createPageMetadata({
  ...pageSeo,
  image: siteMedia.destination.food,
});

export default function CarnetPage() {
  const carnetStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Carnet Beaux Rivages — adresses et expériences",
    numberOfItems: premiumPlaces.length,
    itemListElement: premiumPlaces.map((place, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": place.kind.includes("Plage") ? "Beach" : "TouristAttraction",
        name: place.name,
        description: place.description,
        url: place.officialUrl,
        image: absoluteUrl(place.image),
        address: place.address,
        geo: {
          "@type": "GeoCoordinates",
          latitude: place.coordinates[0],
          longitude: place.coordinates[1],
        },
        containedInPlace: {
          "@type": "TouristDestination",
          name: place.destination,
        },
      },
    })),
  };

  return (
    <main className="premium-carnet-page">
      <PageStructuredData {...pageSeo} />
      <StructuredData data={carnetStructuredData} />
      <Header />
      <CarnetHero />
      <CarnetNavigation />
      <PremiumPlaceCollection />

      <Section id="carte" tone="dark" className="carnet-map-section">
        <Heading
          eyebrow="S’orienter"
          title="Toutes nos adresses sur de vraies cartes."
          description="Adresses, marchés, plages, producteurs, Fort Boyard, vélo, parkings et bornes électriques : filtrez selon votre envie et votre destination."
          light
        />
        <PremiumInteractiveMap />
      </Section>

      <IdealDays />
      <CarnetExperiences />
      <Footer />
    </main>
  );
}
