import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroBackground } from "@/components/HeroBackground";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";

const pageSeo = staticPageSeo["/engagements"];
export const metadata = createPageMetadata(pageSeo);

const commitments = [
  ["01", "Préparer avec soin", "Chaque maison est nettoyée, contrôlée et désinfectée entre les séjours, avec la même exigence que si nous recevions notre propre famille."],
  ["02", "Respecter votre liberté", "Une arrivée autonome simple, une présence disponible si nécessaire et une discrétion totale lorsque vous souhaitez profiter seuls."],
  ["03", "Partager des conseils sincères", "Nos recommandations viennent de notre vie quotidienne sur les îles : producteurs, artisans, promenades et habitudes réellement testées."],
  ["04", "Préserver les îles", "Usage responsable de l’eau, tri des déchets, mobilité à vélo, respect des plages et soutien aux producteurs locaux."],
  ["05", "Respecter le voisinage", "Nous invitons chacun à préserver le calme des résidences et la qualité de vie locale, particulièrement en soirée."],
  ["06", "Rester fidèles aux photos", "Nous présentons les maisons telles qu’elles sont, avec leurs qualités, leur caractère et les informations utiles pour choisir sereinement."],
];

export default function EngagementsPage(){return <main><PageStructuredData {...pageSeo} /><Header />
<section className="subpage-hero commitments-hero"><HeroBackground src={siteMedia.destination.village} /><div className="subpage-overlay"/><div className="subpage-copy"><p className="eyebrow light">Notre promesse</p><h1>Recevoir avec attention, préserver avec respect.</h1><p>Une hospitalité exigeante, sincère et profondément liée aux îles.</p></div></section>
<section className="commitments-intro shell"><p className="eyebrow">Nos engagements</p><h2>Des gestes concrets, avant chaque arrivée et pendant chaque séjour.</h2></section>
<section className="commitment-grid shell">{commitments.map(([n,t,c])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></article>)}</section>
<section className="seasonal-story"><div className="shell"><p className="eyebrow light">Nos maisons vivent au rythme des saisons</p><h2>Printemps calme, été lumineux, automne gourmand, hiver face à l’océan.</h2><p>Beaux Rivages ne se résume pas aux vacances d’été. Les maisons changent d’atmosphère, se parent pour Halloween ou Noël et invitent à découvrir une autre lumière sur Ré et Oléron.</p></div></section>
<Footer /></main>}
