import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroBackground } from "@/components/HeroBackground";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";

const pageSeo = staticPageSeo["/coulisses"];
export const metadata = createPageMetadata(pageSeo);

const backstage = [
  ["Avant chaque arrivée", "Nettoyage, désinfection, contrôle des équipements et mise en place de la maison avec une attention particulière aux détails."],
  ["Les attentions de bienvenue", "Eau fraîche au réfrigérateur, sel des îles, petites douceurs et essentiels de dépannage pour commencer le séjour sereinement."],
  ["Les saisons", "Décorations de Noël, ambiance d’Halloween et tables préparées pour que chaque période de l’année raconte une histoire différente."],
  ["Les bonnes adresses", "Stéphanie & Bruno testent les producteurs, restaurants, artisans et expériences qu’ils recommandent ensuite dans le Carnet Beaux Rivages."],
];

export default function CoulissesPage() {
  return <main><PageStructuredData {...pageSeo} /><Header />
    <section className="subpage-hero backstage-hero"><HeroBackground src={siteMedia.destination.food} /><div className="subpage-overlay"/><div className="subpage-copy"><p className="eyebrow light">Les coulisses de Beaux Rivages</p><h1>Tout ce que l’on ne voit pas, mais que l’on ressent en arrivant.</h1><p>Une maison accueillante commence bien avant l’ouverture de la porte : préparation, vérifications, petites attentions et connaissance du territoire.</p></div></section>
    <section className="backstage-intro shell"><p className="eyebrow">Préparer comme si nous recevions des amis</p><h2>Le soin apporté au séjour fait partie intégrante de l’expérience.</h2></section>
    <section className="backstage-grid shell">{backstage.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</section>
    <section className="promise-dark"><div className="shell"><p className="eyebrow light">Notre promesse</p><h2>Une maison fidèle aux photos, préparée avec exigence et accompagnée de conseils sincères.</h2><div className="promise-checks"><span>Propreté contrôlée</span><span>Arrivée autonome simple</span><span>Disponibilité discrète</span><span>Conseils locaux authentiques</span></div></div></section>
    <section className="returning-cta shell"><p className="eyebrow">L’hospitalité des îles</p><h2>Plus qu’une remise de clés, une attention portée à chaque moment.</h2><Link className="primary-button" href="/reserver">Réserver en direct</Link></section>
    <Footer />
  </main>
}
