import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroBackground } from "@/components/HeroBackground";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";
import { ConciergePremium } from "@/components/ConciergePremium";

const pageSeo = staticPageSeo["/personnaliser"];
export const metadata = createPageMetadata(pageSeo);

export default function PersonaliserPage() {
  return <main><PageStructuredData {...pageSeo} /><Header />
    <section className="subpage-hero options-hero"><HeroBackground src={siteMedia.destination.food} /><div className="subpage-overlay"/><div className="subpage-copy"><p className="eyebrow light">Concierge Premium</p><h1>Personnalisez votre séjour</h1><p>Ajoutez quelques attentions qui rendront votre séjour encore plus agréable.</p></div></section>
    <ConciergePremium />
    <Footer />
  </main>
}
