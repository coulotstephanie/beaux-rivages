import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroBackground } from "@/components/HeroBackground";
import { Container } from "@/components/ui";
import { siteMedia } from "@/media/site";
import { PageStructuredData } from "@/components/PageStructuredData";
import { createPageMetadata } from "@/seo";
import type { PageSeoConfig } from "@/content/fr/seo";

const pageSeo = {
  title: "Contact | Beaux Rivages",
  description:
    "Contactez Stéphanie et Bruno pour préparer votre séjour sur l’Île de Ré ou l’Île d’Oléron.",
  path: "/contact",
  breadcrumbs: [
    { name: "Accueil", path: "/" },
    { name: "Contact", path: "/contact" },
  ],
  schemaTypes: ["WebPage"],
} satisfies PageSeoConfig;
export const metadata = createPageMetadata(pageSeo);

export default function ContactPage() {
  return (
    <main className="contact-page">
      <PageStructuredData {...pageSeo} />
      <Header />
      <section className="subpage-hero contact-page__hero">
        <HeroBackground src={siteMedia.destination.sea} />
        <div className="subpage-overlay" />
        <div className="subpage-copy">
          <p className="eyebrow light">Stéphanie & Bruno</p>
          <h1>Parlons de votre séjour.</h1>
          <p>
            Une question sur une maison, les îles ou votre réservation ? Nous vous répondons
            personnellement.
          </p>
        </div>
      </section>
      <section className="contact-page__content">
        <Container size="narrow">
          <div className="contact-page__grid">
            <article>
              <span>01</span>
              <h2>Nous écrire</h2>
              <p>Décrivez-nous votre projet de séjour et les personnes qui vous accompagnent.</p>
              <a href="mailto:coulotstephanie@gmail.com">coulotstephanie@gmail.com</a>
            </article>
            <article>
              <span>02</span>
              <h2>Nous appeler</h2>
              <p>Pour une question rapide, Stéphanie et Bruno sont joignables directement.</p>
              <a href="tel:+33617260094">+33 6 17 26 00 94</a>
            </article>
          </div>
          <div className="contact-page__actions">
            <Link href="/reserver">Vérifier les disponibilités →</Link>
            <Link href="/faq">Consulter les questions fréquentes →</Link>
          </div>
        </Container>
      </section>
      <Footer />
    </main>
  );
}
