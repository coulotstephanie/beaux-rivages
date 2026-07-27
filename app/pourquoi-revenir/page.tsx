import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroBackground } from "@/components/HeroBackground";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";

const pageSeo = staticPageSeo["/pourquoi-revenir"];
export const metadata = createPageMetadata(pageSeo);

const reasons = [
  ["Les îles", "Une lumière différente, une marée différente et une nouvelle façon de ralentir à chaque séjour."],
  ["L’accueil", "Une hospitalité inspirée de trois générations d’expérience, chaleureuse lorsque vous le souhaitez et toujours respectueuse de votre intimité."],
  ["Les maisons", "Trois lieux de caractère, pensés pour partager des repas, retrouver l’océan et créer des souvenirs en famille ou entre amis."],
  ["Les attentions", "Une maison préparée avec soin, de l’eau fraîche à l’arrivée, quelques essentiels et des recommandations vraiment personnelles."],
];

export default function PourquoiRevenirPage() {
  return <main><PageStructuredData {...pageSeo} /><Header />
    <section className="subpage-hero returning-hero"><HeroBackground src={siteMedia.destination.bridge} /><div className="subpage-overlay"/><div className="subpage-copy"><p className="eyebrow light">Pourquoi nos voyageurs reviennent</p><h1>Parce qu’un beau séjour donne envie d’en imaginer un autre.</h1><p>Beaux Rivages ne cherche pas seulement à offrir de belles maisons, mais une relation de confiance et une expérience qui évolue au fil des saisons.</p></div></section>
    <section className="returning-intro shell"><p className="eyebrow">Une hospitalité qui reste en mémoire</p><h2>Ils reviennent pour les îles, les maisons et la sensation d’être attendus.</h2></section>
    <section className="returning-grid shell">{reasons.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</section>
    <section className="guestbook-section"><div className="shell guestbook-layout"><div><p className="eyebrow light">Les livres d’or</p><h2>Des souvenirs transmis d’un voyageur au suivant.</h2><p>Chaque maison possède son livre d’or. On y retrouve des mots spontanés, des dessins d’enfants, des bonnes adresses et des souvenirs de vacances. Avec l’accord des voyageurs, certains extraits pourront nourrir ce carnet vivant sur le site.</p></div><blockquote>« Ici, les avis ne sont pas seulement des notes. Ce sont des histoires qui continuent. »</blockquote></div></section>
    <section className="returning-cta shell"><p className="eyebrow">Revenir autrement</p><h2>Une autre saison, une autre maison, une nouvelle lumière sur les îles.</h2><Link className="primary-button" href="/reserver">Préparer un prochain séjour</Link></section>
    <Footer />
  </main>
}
