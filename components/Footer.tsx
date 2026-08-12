import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { Button, Container, Divider } from "./ui";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr, localizedHref } from "@/i18n/lot1-client";

export function Footer({ locale = "fr" }: { locale?: SupportedLocale } = {}) {
  const t = (source: string) => tr(locale, source);
  const href = (path: string) => localizedHref(locale, path);
  return (
    <footer id="contact" className="footer premium-footer">
      <Container size="wide">
        <nav className="footer-discovery" aria-label={t("Découvrir ensuite")}>
          <p className="eyebrow light">{t("Découvrir ensuite")}</p>
          <div>
            <Link href={href("/maisons")}>
              {t("Nos maisons")} <span aria-hidden="true">→</span>
            </Link>
            <Link href={href("/destinations")}>
              {t("Les deux îles")} <span aria-hidden="true">→</span>
            </Link>
            <Link href={href("/carnet")}>
              {t("Le Carnet")} <span aria-hidden="true">→</span>
            </Link>
            <Link href={href("/patrimoine")}>
              {t("Le patrimoine")} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </nav>
        <div className="premium-footer__top">
          <div>
            <p className="eyebrow light">{t("Votre prochaine parenthèse")}</p>
            <h2>{t("Préparons votre séjour sur les îles.")}</h2>
          </div>
          <Button href={href("/reserver")} variant="secondary">
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
            <Link href={href("/maisons")}>{t("Nos maisons")}</Link>
            <Link href={href("/histoire-de-nos-maisons")}>{t("L’histoire de nos maisons")}</Link>
            <Link href={href("/choisir")}>{t("Choisir ma maison")}</Link>
            <Link href={href("/construisez-votre-sejour")}>{t("Construire mon séjour")}</Link>
            <Link href={href("/inspiration")}>{t("Inspirez-moi")}</Link>
            <Link href={href("/destinations")}>{t("Destinations")}</Link>
            <Link href={href("/patrimoine")}>{t("Patrimoine")}</Link>
            <Link href={href("/experiences")}>{t("Expériences")}</Link>
            <Link href={href("/sejours-professionnels")}>{t("Séjours professionnels")}</Link>
            <Link href={href("/carnet")}>{t("Le Carnet")}</Link>
            <Link href={href("/phototheque")}>{t("Photothèque")}</Link>
          </div>
          <div>
            <p className="premium-footer__label">Beaux Rivages</p>
            <Link href={href("/engagements")}>{t("Nos engagements")}</Link>
            <Link href={href("/pourquoi-beaux-rivages")}>{t("Pourquoi Beaux Rivages ?")}</Link>
            <Link href={href("/sejour")}>{t("Votre séjour")}</Link>
            <Link href={href("/avant-arrivee")}>{t("Avant votre arrivée")}</Link>
            <Link href={href("/conseils")}>{t("Les conseils de Stéphanie & Bruno")}</Link>
            <Link href={href("/mot-de-stephanie")}>{t("Le mot de Stéphanie")}</Link>
            <Link href={href("/saisons")}>{t("Les saisons")}</Link>
            <Link href={href("/coulisses")}>{t("Les coulisses")}</Link>
            <Link href={href("/avis")}>{t("Avis voyageurs")}</Link>
            <Link href={href("/personnaliser")}>{t("Personnaliser")}</Link>
            <Link href={href("/faq")}>{t("Questions fréquentes")}</Link>
          </div>
          <div>
            <p className="premium-footer__label">{t("Nous contacter")}</p>
            <Link href={href("/contact")}>{t("Page Contact")}</Link>
            <a href="mailto:coulotstephanie@gmail.com">coulotstephanie@gmail.com</a>
            <a href="tel:+33617260094">+33 6 17 26 00 94</a>
            <p>Stéphanie & Bruno</p>
          </div>
          <div>
            <p className="premium-footer__label">{t("Informations légales")}</p>
            <Link href={href("/conditions-generales-de-vente")}>{t("Conditions Générales de Vente")}</Link>
            <Link href={href("/conditions-generales-utilisation")}>{t("Conditions Générales d’Utilisation")}</Link>
            <Link href={href("/politique-annulation")}>{t("Politique d’annulation")}</Link>
            <Link href={href("/politique-remboursement")}>{t("Politique de remboursement")}</Link>
            <Link href={href("/mentions-legales")}>{t("Mentions légales")}</Link>
            <Link href={href("/politique-de-confidentialite")}>{t("Politique de confidentialité")}</Link>
            <Link href={href("/politique-de-cookies")}>{t("Politique de cookies")}</Link>
            <Link href={href("/charte-qualite")}>{t("Charte qualité")}</Link>
            <Link href={href("/engagements-environnement")}>{t("Engagements environnementaux")}</Link>
            <Link href={href("/charte-animaux")}>{t("Charte Animaux")}</Link>
            <Link href={href("/charte-bon-voisinage")}>{t("Charte du bon voisinage")}</Link>
            <Link href={href("/accessibilite")}>{t("Accessibilité")}</Link>
            <Link href={href("/faq-juridique")}>{t("FAQ juridique")}</Link>
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
