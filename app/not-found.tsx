import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroBackground } from "@/components/HeroBackground";
import { siteMedia } from "@/media/site";

export default function NotFound() {
  return <main><Header />
    <section className="not-found-page">
      <HeroBackground src={siteMedia.destination.sea} />
      <div className="not-found-page__overlay" />
      <div className="not-found-page__content">
        <p className="eyebrow light">Erreur 404</p>
        <h1>Le chemin s’arrête ici. L’horizon, lui, continue.</h1>
        <p>Cette page n’existe plus ou son adresse a changé. Retrouvez les maisons, le Carnet ou laissez-nous vous inspirer.</p>
        <div><Link className="primary-button" href="/">Revenir à l’accueil</Link><Link className="secondary-button" href="/inspiration">Inspirez-moi</Link></div>
      </div>
    </section>
    <Footer />
  </main>;
}
