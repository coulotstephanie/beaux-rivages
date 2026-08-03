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
        <p>
          Entrez dans nos habitudes, nos rencontres et ces lieux où nous revenons avec le même
          plaisir, entre Ré, Oléron et La Rochelle.
        </p>
      </div>
      <a href="#guides" aria-label="Commencer à parcourir le Carnet">
        <span />
        Ouvrir le carnet
      </a>
    </section>
  );
}
