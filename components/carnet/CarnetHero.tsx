import { HeroBackground } from "@/components/HeroBackground";
import { siteMedia } from "@/media/site";

export function CarnetHero() {
  return (
    <section className="carnet-premium-hero">
      <HeroBackground src={siteMedia.destination.food} />
      <div className="carnet-premium-hero__veil" />
      <div className="carnet-premium-hero__content">
        <p className="eyebrow light">Le Carnet Beaux Rivages</p>
        <h1>Les îles, comme nous les partagerions avec des amis.</h1>
        <p>Adresses choisies, cartes, itinéraires et expériences pour vivre Ré, Oléron et La Rochelle de l’intérieur.</p>
      </div>
      <a href="#guides" aria-label="Commencer à parcourir le Carnet"><span />Ouvrir le carnet</a>
    </section>
  );
}
