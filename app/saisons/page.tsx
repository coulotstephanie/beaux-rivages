import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/saisons"];
export const metadata = createPageMetadata({ ...pageSeo, image: siteMedia.destination.flowerDunes });
const seasons = [
  ["Printemps", "Les pistes retrouvent leur silence, les marchés s’étoffent et les marais reprennent leurs couleurs.", siteMedia.destination.flowerDunes],
  ["Été", "La plage dès le matin, les longues tables et les retours à vélo dans la lumière du soir.", siteMedia.destination.beach],
  ["Automne", "Une île plus intime, l’océan plus présent et le plaisir de retrouver une maison chaleureuse.", siteMedia.destination.marsh],
  ["Halloween", "Des vacances en famille, des goûters à préparer et les premières soirées à l’intérieur.", siteMedia.properties["chai-des-tortues"].kitchen[0].src],
  ["Noël", "Les maisons se parent de lumière pour réunir les générations autour de la grande table.", siteMedia.properties["villa-raie-manta"].livingRoom[0].src],
  ["Hiver", "Les plages presque seules, l’air vif et la liberté de ralentir sans programme.", siteMedia.destination.sea],
  ["Pâques", "Les premiers déjeuners dehors, les fleurs, le chocolat et le retour des balades sans manteau.", siteMedia.destination.village],
] as const;
export default function SeasonsPage() {
  return <main><PageStructuredData {...pageSeo} /><Header />
    <section className="seasons-hero"><Image src={siteMedia.destination.flowerDunes} alt="" fill priority sizes="100vw" /><div><p className="eyebrow light">Revenir autrement</p><h1>Nos maisons vivent au rythme des saisons.</h1><p>Chaque lumière transforme les îles, les habitudes et la façon d’habiter la maison.</p></div></section>
    <section className="season-grid shell">{seasons.map(([title, copy, image]) => <article key={title}><div><Image src={image} alt="" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><p className="eyebrow">{title}</p><h2>{copy}</h2></article>)}</section>
    <section className="season-films">
      <div className="shell">
        <div className="section-heading"><div><p className="eyebrow light">Les maisons en mouvement</p><h2>La lumière, les volumes, le calme.</h2></div><p>Des séquences authentiques du Chai des Tortues, sans musique imposée, pour ressentir la maison avant le séjour.</p></div>
        <div className="season-films__grid">
          <figure><video controls muted playsInline preload="metadata" poster={siteMedia.properties["chai-des-tortues"].hero.src}><source src="/videos/chai-des-tortues-film-sans-son.mp4" type="video/mp4" /></video><figcaption>Le Chai des Tortues · visite de la maison</figcaption></figure>
          <figure><video controls muted playsInline preload="none" poster={siteMedia.properties["chai-des-tortues"].gallery[0].src}><source src="/videos/chai-des-tortues-chambre-1-sans-son.mp4" type="video/mp4" /></video><figcaption>Les chambres préparées · détails et lumière</figcaption></figure>
        </div>
      </div>
    </section>
    <section className="returning-cta shell"><p className="eyebrow">Votre saison</p><h2>Quelle lumière aimeriez-vous retrouver ?</h2><Link className="primary-button" href="/reserver">Choisir mes dates</Link></section><Footer />
  </main>;
}
