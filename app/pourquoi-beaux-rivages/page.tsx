import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";

const pageSeo = staticPageSeo["/pourquoi-beaux-rivages"];
export const metadata = createPageMetadata({ ...pageSeo, image: siteMedia.destination.lane });
const pillars = [
  ["Philosophie", "Offrir moins de complications et plus de place aux souvenirs."],
  ["Hospitalité", "Être présents lorsque cela compte, discrets lorsque la maison doit devenir la vôtre."],
  ["Valeurs", "Sincérité, soin, transmission et respect du rythme des îles."],
  ["Engagement", "Recommander ce que nous connaissons, expliquer clairement ce qui est inclus et faire progresser chaque séjour."],
];
export default function WhyPage() {
  return <main><PageStructuredData {...pageSeo} /><Header />
    <section className="identity-hero"><Image src={siteMedia.destination.lane} alt="" fill priority sizes="100vw" /><div><p className="eyebrow light">Pourquoi Beaux Rivages ?</p><h1>Des maisons choisies pour les histoires qu’elles permettent de vivre.</h1></div></section>
    <section className="identity-intro shell"><p className="eyebrow">Stéphanie & Bruno</p><h2>Notre idée du luxe tient dans une maison préparée avec soin, une adresse donnée au bon moment et la liberté de vivre à son rythme.</h2><p>Beaux Rivages est une histoire familiale nourrie par trois générations d’accueil. Nous ne cherchons pas à effacer l’autonomie d’une maison de vacances, mais à lui apporter l’attention d’une belle maison d’hôtes.</p></section>
    <section className="identity-pillars shell">{pillars.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</section>
    <section className="identity-story"><div><Image src={siteMedia.destination.bridge} alt="Le pont de l’Île de Ré" fill sizes="(max-width: 900px) 100vw, 50vw" /></div><div><p className="eyebrow light">Notre histoire familiale</p><h2>Accueillir, transmettre, recommencer.</h2><p>Chaque maison possède son caractère. Ce qui les relie, c’est notre manière de préparer l’arrivée, de partager les îles et d’écouter ce que les voyageurs nous apprennent. C’est ainsi que l’expérience continue de grandir.</p><Link href="/pourquoi-revenir" className="secondary-button">Pourquoi ils reviennent</Link></div></section>
    <Footer />
  </main>;
}
