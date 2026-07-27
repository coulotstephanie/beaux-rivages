import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroBackground } from "@/components/HeroBackground";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import { propertyMedia } from "@/media/properties";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/mot-de-stephanie"];
export const metadata = createPageMetadata({ ...pageSeo, image: siteMedia.destination.food });

export default function StephanieLetterPage() {
  return <main><PageStructuredData {...pageSeo} /><Header />
    <section className="subpage-hero"><HeroBackground src={siteMedia.destination.food} /><div className="subpage-overlay" /><div className="subpage-copy"><p className="eyebrow light">Le mot de Stéphanie</p><h1>Recevoir est une histoire de famille.</h1><p>Une lettre sur les maisons, les îles et cette attention discrète qui transforme une location en souvenir.</p></div></section>
    <section className="stephanie-letter shell"><div><p className="eyebrow">Bienvenue chez nous</p><h2>Je voudrais que vous vous sentiez attendus.</h2><p>Beaux Rivages est né d’une conviction simple : une maison de vacances ne se résume pas à ses murs. Elle commence dans la manière de préparer les chambres, de partager une adresse et de rester disponible sans jamais s’imposer.</p><p>J’ai grandi avec trois générations d’hôtellerie et le plaisir de voir les voyageurs revenir. Avec Bruno, nous avons imaginé trois maisons différentes, mais une même façon de recevoir : sincère, généreuse et profondément liée aux îles.</p><blockquote>« Vous laisser libres, tout en ayant pensé à ce qui pourrait rendre le séjour plus doux. »</blockquote><p>Chaque conseil du Carnet a été choisi comme nous le ferions pour des amis. Chaque attention est préparée avec la même exigence que si nous vous recevions personnellement.</p><p className="stephanie-letter__signature">Stéphanie</p></div><div className="stephanie-letter__media"><Image src={siteMedia.destination.saintMartinPort} alt="Le port de Saint-Martin-de-Ré, paysage familier de Beaux Rivages" fill sizes="(max-width: 800px) 100vw, 45vw" /><video controls preload="metadata" poster={propertyMedia["chai-des-tortues"].gallery[0].src}><source src="/videos/chai-des-tortues-film-sans-son.mp4" type="video/mp4" /></video></div></section>
    <Footer /></main>;
}
