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
import { Badge, Button, Heading, Section } from "@/components/ui";
import { FutureVisualScenes } from "@/components/FutureVisualScenes";
import { createPageMetadata } from "@/seo";
import { PageStructuredData } from "@/components/PageStructuredData";
import { StructuredData } from "@/components/StructuredData";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import { premiumPlaces } from "@/carnetPremiumData";
import { absoluteUrl } from "@/seo";
import Image from "next/image";
import Link from "next/link";

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
      <section className="local-signature" aria-labelledby="nina-metayer-title">
        <div className="local-signature__visual">
          <Image
            src={siteMedia.destination.ninaMetayerFruitCake}
            alt="Gâteau aux fruits et à la crème signé Nina Métayer"
            fill
            quality={90}
            loading="lazy"
            sizes="(max-width: 900px) 100vw, 52vw"
          />
        </div>
        <div className="local-signature__copy">
          <Badge>À Rivedoux-Plage</Badge>
          <p className="local-signature__award">
            Pâtissière Mondiale 2023 · World’s Best Pastry Chef 2024
          </p>
          <h2 id="nina-metayer-title">Une gourmandise d’exception, à quelques pas.</h2>
          <p>
            Chez Nina fait entrer l’excellence mondiale dans la vie du village. Pour une première
            visite, Stéphanie et Bruno vous conseillent la chocolatine praliné.
          </p>
          <div className="local-signature__actions">
            <Button href="#guides">Voir dans notre Carnet</Button>
            <Button href="https://larochelle.delicatisserie.com/" variant="ghost">
              Découvrir Chez Nina <span aria-hidden="true">↗</span>
            </Button>
          </div>
        </div>
      </section>
      <section className="carnet-small-happiness shell">
        <Image
          src={siteMedia.destination.reMarketFruit}
          alt="Fruits colorés du marché choisis par Stéphanie et Bruno"
          width={720}
          height={720}
        />
        <div>
          <p className="eyebrow">Le carnet personnel</p>
          <h2>Ces petits bonheurs que nous avons envie de partager avec vous.</h2>
          <p>Nos rituels, nos habitudes et ces adresses où nous revenons avec le même plaisir.</p>
          <Link href="/nos-petits-bonheurs">Entrer dans notre quotidien →</Link>
        </div>
      </section>
      <PremiumPlaceCollection />
      <FutureVisualScenes />

      <Section id="carte" tone="dark" className="carnet-map-section">
        <Heading
          eyebrow="Se laisser guider"
          title="Retrouvez les lieux qui accompagnent nos journées sur les îles."
          description="Marchés, plages, producteurs, Fort Boyard, vélo et repères pratiques restent réunis sur une carte précise, lorsque vient le moment de partir à leur rencontre."
          light
        />
        <PremiumInteractiveMap />
      </Section>

      <IdealDays />
      <CarnetExperiences />
      <section className="host-advice">
        <div className="host-advice__visual">
          <Image
            src={siteMedia.destination.lane}
            alt="Ruelle lumineuse au charme insulaire"
            fill
            quality={88}
            loading="lazy"
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="host-advice__copy">
          <Badge>Le conseil de Stéphanie & Bruno</Badge>
          <blockquote>
            « Les plus belles vacances ne se mesurent pas en mètres carrés. Elles se mesurent en
            souvenirs. »
          </blockquote>
          <p>
            Nos recommandations viennent de notre vie sur les îles : des producteurs, artisans et
            expériences que nous partageons comme nous le ferions avec des amis.
          </p>
          <Button href="/conseils" variant="ghost">
            Tous nos conseils <span aria-hidden="true">→</span>
          </Button>
        </div>
      </section>
      <Footer />
    </main>
  );
}
