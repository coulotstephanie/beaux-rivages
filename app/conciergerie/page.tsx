import { ConciergePlanner } from "@/components/ConciergePlanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroBackground } from "@/components/HeroBackground";
import { SmartWeatherAdvisor } from "@/components/SmartWeatherAdvisor";
import { siteMedia } from "@/media/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conciergerie intelligente | Beaux Rivages",
  description: "Composez votre séjour personnalisé sur les îles de Ré et d’Oléron : plages, restaurants, marchés, itinéraires, météo, mer et conseils de vos hôtes.",
  alternates: { canonical: "/conciergerie" },
};

export default function ConciergeriePage() {
  return <main>
    <Header />
    <section className="subpage-hero concierge-hero"><HeroBackground src={siteMedia.destination.familyForeshore} /><div className="subpage-overlay" /><div className="subpage-copy"><p className="eyebrow light">Votre assistant de séjour</p><h1>Les îles, juste comme vous les aimez.</h1><p>Un programme personnel, les conditions du jour et les conseils de Stéphanie & Bruno réunis dans un même carnet.</p><Link className="primary-button" href="#composer">Composer mon séjour</Link></div></section>
    <section id="composer" className="concierge-section shell"><ConciergePlanner /></section>
    <section className="today-islands"><div className="shell"><div className="today-islands__title"><p className="eyebrow">En direct du littoral</p><h2>Aujourd’hui sur les îles</h2><p>Météo, température de la mer, soleil, vent et recommandations qui évoluent avec les conditions.</p></div><SmartWeatherAdvisor /></div></section>
    <section className="concierge-carnet shell"><div><p className="eyebrow">Carnet intelligent</p><h2>Votre séjour continue dans votre poche.</h2><p>Après la réservation, retrouvez le compte à rebours, votre programme, les informations d’arrivée au bon moment et vos favoris.</p></div><Link className="primary-button" href="/carnet-voyageur">Ouvrir mon espace</Link></section>
    <Footer />
  </main>;
}
