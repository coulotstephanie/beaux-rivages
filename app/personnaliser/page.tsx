import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroBackground } from "@/components/HeroBackground";
import { siteMedia } from "@/media/site";
import { createPageMetadata } from "@/seo";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";
import { StayComposer } from "@/components/StayComposer";

const pageSeo = staticPageSeo["/personnaliser"];
export const metadata = createPageMetadata(pageSeo);

const included = ["Arrivée autonome", "Fibre et Wi‑Fi", "Équipement bébé selon la maison", "Jeux, livres et conseils famille", "Carnet Beaux Rivages", "Eau fraîche et attention de bienvenue", "Fond de placard de dépannage", "Disponibilité discrète de vos hôtes"];
const comfort = ["Pack linge complet — 20 € par personne", "Serviettes de plage", "Peignoirs", "Chaussons de bain", "Arrivée anticipée selon disponibilité", "Départ tardif selon disponibilité"];
const signature = ["Pack linge avec lits préparés", "Serviettes de plage", "Deux peignoirs", "Arrivée anticipée si disponible", "Panier Apéritif ou Panier Douceur", "Attention personnalisée à l’arrivée"];
const baskets = [
  ["Panier Apéritif", "Une sélection conviviale inspirée des saveurs locales, pensée pour profiter des premiers instants de vacances."],
  ["Panier Douceur", "Une attention gourmande à partager au petit-déjeuner, au goûter ou après une journée au bord de l’océan."],
];

export default function PersonaliserPage() {
  return <main><PageStructuredData {...pageSeo} /><Header />
    <section className="subpage-hero options-hero"><HeroBackground src={siteMedia.destination.food} /><div className="subpage-overlay"/><div className="subpage-copy"><p className="eyebrow light">Personnalisez votre séjour</p><h1>Votre façon de vivre Beaux Rivages.</h1><p>Choisissez uniquement les attentions qui comptent pour vous, avec une présentation claire avant la réservation.</p></div></section>
    <section className="options-intro shell"><p className="eyebrow">Déjà inclus</p><h2>L’essentiel n’est jamais une option.</h2><div className="included-grid">{included.map((item) => <div key={item}><span>✓</span><p>{item}</p></div>)}</div></section>
    <section className="composer-section shell"><p className="eyebrow">Composer en direct</p><h2>Ajoutez seulement ce qui rendra le séjour plus personnel.</h2><StayComposer /></section>
    <section className="experience-levels shell">
      <article className="level-card"><p className="eyebrow">Confort</p><h2>Quelques attentions en plus.</h2><ul>{comfort.map(i=><li key={i}>{i}</li>)}</ul><Link href="/reserver" className="text-link">Ajouter à ma demande <span>→</span></Link></article>
      <article className="level-card signature"><div className="signature-badge">Expérience phare</div><p className="eyebrow">Signature Beaux Rivages</p><h2>Le séjour préparé dans ses moindres détails.</h2><ul>{signature.map(i=><li key={i}>{i}</li>)}</ul><Link href="/reserver" className="primary-button">Choisir Signature</Link></article>
    </section>
    <section className="welcome-baskets shell"><div className="section-heading"><div><p className="eyebrow">Paniers d’accueil</p><h2>Choisissez la première saveur de votre séjour.</h2></div><p>La composition exacte et le tarif restent configurables selon la saison, la maison et les disponibilités de nos producteurs.</p></div><div className="basket-grid">{baskets.map(([title, text]) => <article key={title}><p className="eyebrow">À la carte</p><h3>{title}</h3><p>{text}</p><Link href="/reserver" className="text-link">Ajouter à ma demande <span>→</span></Link></article>)}</div></section>
    <section className="special-attention"><div className="shell"><p className="eyebrow light">Une occasion particulière ?</p><h2>Anniversaire, retrouvailles, séjour sportif ou escapade à deux.</h2><p>Parlez-nous de votre projet. Lorsque cela est possible, nous adaptons l’accueil avec simplicité et sincérité.</p><a href="mailto:coulotstephanie@gmail.com" className="secondary-button">Écrire à Stéphanie</a></div></section>
    <section className="pet-option shell"><div><p className="eyebrow">Animaux bienvenus</p><h2>Ils font aussi partie du voyage.</h2></div><div><p>Supplément de 25 € par animal et par séjour. Des gamelles sont mises à disposition. Merci d’apporter leur couchage et de ne pas les laisser monter sur les lits.</p><p>À La Maison Heureuse, les chiens doivent être tenus en laisse dans les espaces communs.</p></div></section>
    <Footer />
  </main>
}
