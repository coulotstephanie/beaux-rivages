import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InspirationQuiz } from "@/components/InspirationQuiz";
import { PageStructuredData } from "@/components/PageStructuredData";
import { HeroBackground } from "@/components/HeroBackground";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";
import Image from "next/image";
import Link from "next/link";

const pageSeo = staticPageSeo["/inspiration"];
export const metadata = createPageMetadata({ ...pageSeo, image: siteMedia.destination.marsh });

export default function InspirationPage() {
  return <main><PageStructuredData {...pageSeo} /><Header />
    <section className="subpage-hero"><HeroBackground src={siteMedia.destination.marsh} /><div className="subpage-overlay" /><div className="subpage-copy"><p className="eyebrow light">Mode Inspiration</p><h1>Et si le séjour se composait autour de vous ?</h1><p>Quelques envies suffisent. Nous réunissons la maison, les expériences, les bonnes adresses et un premier itinéraire.</p></div></section>
    <nav className="inspiration-navigation" aria-label="Explorer l’inspiration">
      <a href="#explorer">Explorer les îles</a><a href="#gouter">Goûter</a><a href="#respirer">Respirer</a><a href="#dormir">Dormir</a><a href="#decouvrir">Découvrir</a>
    </nav>
    <section id="explorer" className="inspiration-immersive" aria-label="Trois invitations au voyage">
      {[
        { image: siteMedia.destination.saintMartinPort, alt: "Port de Saint-Martin-de-Ré", eyebrow: "Respirer", title: "Partir tôt. Suivre la lumière.", copy: "Ré se découvre entre deux silences.", credit: "Angelo Brathot · domaine public", source: "https://commons.wikimedia.org/wiki/File:Port_de_St_Martin-de-R%C3%A9_T_%2845053203774%29.jpg" },
        { image: siteMedia.destination.chassiron, alt: "Pointe de Chassiron sur l’Île d’Oléron", eyebrow: "Regarder", title: "Laisser l’océan décider.", copy: "Oléron, plus vaste. Plus sauvage.", credit: "Dimimis · CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:Pointe_de_Chassiron.jpg" },
        { image: siteMedia.destination.laRochelleOldPort, alt: "Entrée du Vieux-Port de La Rochelle", eyebrow: "S’échapper", title: "Une ville tournée vers le large.", copy: "La Rochelle à pied, du marché jusqu’aux tours.", credit: "Jebulon · CC0", source: "https://commons.wikimedia.org/wiki/File:Entrance_La_Rochelle_old_harbor.jpg" },
      ].map((scene, index) => (
        <article className="inspiration-immersive__scene" key={scene.title}>
          <Image src={scene.image} alt={scene.alt} fill sizes="100vw" quality={90} loading={index === 0 ? "eager" : "lazy"} priority={index === 0} />
          <div className="inspiration-immersive__veil" />
          <div className="inspiration-immersive__copy">
            <p className="eyebrow light">{scene.eyebrow}</p>
            <h2>{scene.title}</h2>
            <p>{scene.copy}</p>
            <Link href="/carnet">Ouvrir le Carnet <span aria-hidden="true">→</span></Link>
          </div>
          <a className="inspiration-immersive__credit" href={scene.source} target="_blank" rel="noreferrer">Photo : {scene.credit}</a>
        </article>
      ))}
    </section>
    <section id="respirer" className="inspiration-manifesto shell"><p className="eyebrow">Respirer</p><h2>Les paysages qui nous font ralentir.</h2><p>Des marais au petit matin, une forêt qui filtre le vent, le sable encore frais et le pertuis qui change de couleur. Ici, le programme commence par de la place laissée au hasard.</p></section>
    <section id="gouter" className="inspiration-editorial">
      <Image src={siteMedia.destination.oceanBreakfast} alt="Petit déjeuner face à l’océan" fill sizes="(max-width: 900px) 100vw, 55vw" />
      <div><p className="eyebrow light">Goûter</p><h2>Une journée idéale.</h2><ol><li><span>08:30</span> Le marché avant l’effervescence</li><li><span>12:30</span> Un déjeuner improvisé à la maison</li><li><span>17:00</span> La plage choisie selon le vent</li><li><span>21:15</span> Le dernier rayon sur l’océan</li></ol><Link href="/conciergerie">Composer la vôtre →</Link></div>
    </section>
    <section id="decouvrir" className="inspiration-host shell"><div><p className="eyebrow">Découvrir</p><h2>Le conseil de Stéphanie & Bruno.</h2><blockquote>« Gardez toujours un moment sans réservation. Les îles savent très bien proposer la suite. »</blockquote><Link href="/carnet">Voir leurs bonnes adresses →</Link></div><Image src={siteMedia.destination.beachPicnic} alt="Pique-nique élégant au bord de l’océan" width={760} height={920} /></section>
    <section className="inspiration-seasons"><div><p className="eyebrow light">Revenir</p><h2>Nos maisons vivent au rythme des saisons.</h2><p>La lumière franche de l’hiver, les pistes calmes du printemps, les longues soirées d’été ou les marchés d’automne : aucun séjour ne ressemble tout à fait au précédent.</p><Link href="/saisons">Choisir sa saison →</Link></div></section>
    <section id="dormir" className="inspiration-section shell"><InspirationQuiz /></section>
    <Footer />
  </main>;
}
