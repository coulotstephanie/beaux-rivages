import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { Button, Container, Divider } from "./ui";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr, localizedHref } from "@/i18n/lot1-client";

const discoveryLinks = [
  ["Nos maisons", "/maisons"],
  ["Les deux îles", "/destinations"],
  ["Le Carnet", "/carnet"],
  ["Le patrimoine", "/patrimoine"],
] as const;

const exploreLinks = [
  ["Nos maisons", "/maisons"],
  ["L’histoire de nos maisons", "/histoire-de-nos-maisons"],
  ["Choisir ma maison", "/choisir"],
  ["Construire mon séjour", "/construisez-votre-sejour"],
  ["Inspirez-moi", "/inspiration"],
  ["Destinations", "/destinations"],
  ["Patrimoine", "/patrimoine"],
  ["Expériences", "/experiences"],
  ["Séjours professionnels", "/contact"],
  ["Le Carnet", "/carnet"],
  ["Photothèque", "/phototheque"],
] as const;

const brandLinks = [
  ["Nos engagements", "/engagements"],
  ["Pourquoi Beaux Rivages ?", "/pourquoi-beaux-rivages"],
  ["Votre séjour", "/sejour"],
  ["Avant votre arrivée", "/avant-arrivee"],
  ["Les conseils de Stéphanie & Bruno", "/conseils"],
  ["Le mot de Stéphanie", "/mot-de-stephanie"],
  ["Les saisons", "/saisons"],
  ["Les coulisses", "/coulisses"],
  ["Avis voyageurs", "/avis"],
  ["Personnaliser", "/personnaliser"],
  ["Questions fréquentes", "/faq"],
] as const;

const legalLinks = [
  ["Conditions Générales de Vente", "/conditions-generales-de-vente"],
  ["Conditions Générales d’Utilisation", "/conditions-generales-utilisation"],
  ["Politique d’annulation", "/politique-annulation"],
  ["Politique de remboursement", "/politique-remboursement"],
  ["Mentions légales", "/mentions-legales"],
  ["Politique de confidentialité", "/politique-de-confidentialite"],
  ["Politique de cookies", "/politique-de-cookies"],
  ["Charte qualité", "/charte-qualite"],
  ["Engagements environnementaux", "/engagements-environnement"],
  ["Charte Animaux", "/charte-animaux"],
  ["Charte du bon voisinage", "/charte-bon-voisinage"],
  ["Accessibilité", "/accessibilite"],
  ["FAQ juridique", "/faq-juridique"],
] as const;

export function Footer({ locale = "fr" }: { locale?: SupportedLocale } = {}) {
  const t = (source: string) => tr(locale, source);
  const h = (href: string) => localizedHref(locale, href);
  return (
    <footer id="contact" className="footer premium-footer">
      <Container size="wide">
        <nav className="footer-discovery" aria-label={t("Découvrir ensuite")}>
          <p className="eyebrow light">{t("Découvrir ensuite")}</p>
          <div>
            {discoveryLinks.map(([label, href]) => (
              <Link href={h(href)} key={href}>
                {t(label)} <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </nav>
        <div className="premium-footer__top">
          <div>
            <p className="eyebrow light">{t("Votre prochaine parenthèse")}</p>
            <h2>{t("Préparons votre séjour sur les îles.")}</h2>
          </div>
          <Button href={h("/reserver")} variant="secondary">
            {t("Demander une réservation")}
          </Button>
        </div>
        <Divider light />
        <div className="premium-footer__grid">
          <div className="premium-footer__brand">
            <BrandLogo locale={locale} />
            <p>{t("Deux îles. Trois maisons. Une même passion de l’hospitalité.")}</p>
          </div>
          <div>
            <p className="premium-footer__label">{t("Découvrir")}</p>
            {exploreLinks.map(([label, href]) => <Link href={h(href)} key={href}>{t(label)}</Link>)}
          </div>
          <div>
            <p className="premium-footer__label">Beaux Rivages</p>
            {brandLinks.map(([label, href]) => <Link href={h(href)} key={href}>{t(label)}</Link>)}
          </div>
          <div>
            <p className="premium-footer__label">{t("Nous contacter")}</p>
            <Link href={h("/contact")}>{t("Page Contact")}</Link>
            <a href="mailto:coulotstephanie@gmail.com">coulotstephanie@gmail.com</a>
            <a href="tel:+33617260094">+33 6 17 26 00 94</a>
            <p>Stéphanie & Bruno</p>
          </div>
          <div>
            <p className="premium-footer__label">{t("Informations légales")}</p>
            {legalLinks.map(([label, href]) => <Link href={h(href)} key={href}>{t(label)}</Link>)}
          </div>
        </div>
        <Divider light />
        <div className="premium-footer__bottom">
          <p>© {new Date().getFullYear()} Beaux Rivages</p>
          <p>{t("L’hospitalité des îles de Ré et d’Oléron")}</p>
        </div>
      </Container>
    </footer>
  );
}
