import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroBackground } from "@/components/HeroBackground";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";

const pageSeo = staticPageSeo["/destinations"];
export const metadata = createPageMetadata(pageSeo);

const destinations = [
  {
    href: "/destinations/ile-de-re",
    title: "Île de Ré",
    image: siteMedia.destination.marsh,
    text: "Villages blancs, marais salants, marchés et kilomètres de pistes cyclables : une île qui se découvre lentement, au rythme des haltes gourmandes et de l’océan.",
  },
  {
    href: "/destinations/ile-d-oleron",
    title: "Île d’Oléron",
    image: siteMedia.destination.beach,
    text: "Forêts de pins, plages sauvages et Fort Boyard à l’horizon. Depuis Le Nid d’Été, la plage des Saumonards devient le prolongement naturel de la maison.",
  },
  {
    href: "/destinations/la-rochelle",
    title: "La Rochelle et les escapades",
    image: siteMedia.destination.sea,
    text: "Le Vieux-Port, Rochefort, l’Île d’Aix et les croisières autour de Fort Boyard composent des journées d’excursion à moins d’une heure de nos maisons.",
  },
];

export default function DestinationsPage() {
  return (
    <main>
      <PageStructuredData {...pageSeo} />
      <Header />
      <section className="page-hero destination-hero">
        <HeroBackground src={siteMedia.destination.village} />
        <div className="page-hero-content">
          <p className="eyebrow light">Le guide Beaux Rivages</p>
          <h1>Les îles avant les maisons.</h1>
          <p>Nous partageons les paysages, les producteurs et les habitudes qui donnent à chaque séjour sa véritable saveur.</p>
        </div>
      </section>

      <section className="destination-list shell">
        {destinations.map((destination, index) => (
          <article className={`destination-row ${index % 2 ? "reverse" : ""}`} key={destination.title}>
            <div className="destination-photo"><Image src={destination.image} alt="" fill quality={88} loading="lazy" sizes="(max-width: 900px) 100vw, (max-width: 1400px) 55vw, 660px" /></div>
            <div className="destination-copy">
              <p className="eyebrow">Destination</p>
              <h2>{destination.title}</h2>
              <p>{destination.text}</p>
              <Link className="text-link" href={destination.href}>Ouvrir le guide <span>→</span></Link>
            </div>
          </article>
        ))}
      </section>
      <Footer />
    </main>
  );
}
