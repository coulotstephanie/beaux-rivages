import Link from "next/link";
import { ArrivalChecklist } from "@/components/ArrivalChecklist";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroBackground } from "@/components/HeroBackground";
import { PageStructuredData } from "@/components/PageStructuredData";
import { SmartWeatherAdvisor } from "@/components/SmartWeatherAdvisor";
import { PremiumInteractiveMap } from "@/components/carnet";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/avant-arrivee"];
export const metadata = createPageMetadata({ ...pageSeo, image: siteMedia.destination.sea });

export default function BeforeArrivalPage() {
  return (
    <main>
      <PageStructuredData {...pageSeo} />
      <Header />
      <section className="subpage-hero">
        <HeroBackground src={siteMedia.destination.sea} />
        <div className="subpage-overlay" />
        <div className="subpage-copy">
          <p className="eyebrow light">Avant votre arrivée</p>
          <h1>Tout ce qui devient utile, au bon moment.</h1>
          <p>Préparez la valise, vérifiez les conditions et gardez les bonnes adresses à portée de main.</p>
        </div>
      </section>
      <section className="arrival-section shell">
        <div className="section-heading">
          <div><p className="eyebrow">Checklist personnalisable</p><h2>Arriver l’esprit déjà léger.</h2></div>
          <p>Cochez ce qui est prêt. La liste reste volontairement courte et ne collecte aucune donnée.</p>
        </div>
        <ArrivalChecklist />
      </section>
      <section className="arrival-weather">
        <div className="shell"><SmartWeatherAdvisor /></div>
      </section>
      <section className="arrival-openings shell">
        <div className="section-heading">
          <div><p className="eyebrow">À vérifier le jour même</p><h2>Marchés et tables changent de rythme.</h2></div>
          <p>Les horaires saisonniers évoluent. Nous renvoyons vers les sources officielles plutôt que d’afficher une ouverture incertaine.</p>
        </div>
        <div>
          <article><span>01</span><h3>Marchés de Ré</h3><p>Consultez les jours et horaires actualisés par l’office de tourisme.</p><a href="https://www.iledere.com/" target="_blank" rel="noreferrer">Office officiel ↗</a></article>
          <article><span>02</span><h3>Marchés d’Oléron</h3><p>Retrouvez l’agenda et les informations pratiques de chaque commune.</p><a href="https://www.ile-oleron-marennes.com/" target="_blank" rel="noreferrer">Office officiel ↗</a></article>
          <article><span>03</span><h3>Restaurants choisis</h3><p>Ouvrez le Carnet et vérifiez directement auprès de l’établissement.</p><Link href="/carnet#guides">Voir le Carnet →</Link></article>
        </div>
      </section>
      <section className="arrival-map-section">
        <div className="shell">
          <p className="eyebrow light">Vos repères</p>
          <h2>Marchés, plages, parkings et bornes sur une même carte.</h2>
          <PremiumInteractiveMap />
        </div>
      </section>
      <Footer />
    </main>
  );
}
