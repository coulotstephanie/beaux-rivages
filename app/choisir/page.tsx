import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HouseMatcher } from "@/components/HouseMatcher";
import { HouseComparisonTable } from "@/components/HouseComparisonTable";
import { PageStructuredData } from "@/components/PageStructuredData";
import { HeroBackground } from "@/components/HeroBackground";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/choisir"];
export const metadata = createPageMetadata({ ...pageSeo, image: siteMedia.destination.bridge });

export default function ChooseHousePage() {
  return <main><PageStructuredData {...pageSeo} /><Header />
    <section className="subpage-hero"><HeroBackground src={siteMedia.destination.bridge} /><div className="subpage-overlay" /><div className="subpage-copy"><p className="eyebrow light">Le comparateur Beaux Rivages</p><h1>Quelle maison est faite pour vous ?</h1><p>Indiquez vos priorités. Nous comparons les trois maisons et vous orientons vers celle qui correspond le mieux à votre séjour.</p></div></section>
    <section className="matcher-section shell"><p className="eyebrow">Votre façon de voyager</p><h2>Dites-nous ce qui compte. La maison se révèle.</h2><HouseMatcher /></section>
    <section className="comparison-section">
      <div className="shell">
        <div className="section-heading"><div><p className="eyebrow light">Comparer sans deviner</p><h2>Les trois maisons, critère par critère.</h2></div><p>Plage, capacité, bébé, animaux, vue, cuisine et médias : les informations publiques sont réunies sans estimer ce qui n’est pas communiqué.</p></div>
        <HouseComparisonTable />
      </div>
    </section>
    <Footer />
  </main>;
}
