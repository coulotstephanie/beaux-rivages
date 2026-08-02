import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { Button, Container, Divider } from "./ui";

export function Footer() {
  return (
    <footer id="contact" className="footer premium-footer">
      <Container size="wide">
        <nav className="footer-discovery" aria-label="Découvrir ensuite">
          <p className="eyebrow light">Découvrir ensuite</p>
          <div>
            <Link href="/maisons">
              Nos maisons <span aria-hidden="true">→</span>
            </Link>
            <Link href="/destinations">
              Les deux îles <span aria-hidden="true">→</span>
            </Link>
            <Link href="/carnet">
              Le Carnet <span aria-hidden="true">→</span>
            </Link>
            <Link href="/patrimoine">
              Le patrimoine <span aria-hidden="true">→</span>
            </Link>
          </div>
        </nav>
        <div className="premium-footer__top">
          <div>
            <p className="eyebrow light">Votre prochaine parenthèse</p>
            <h2>Préparons votre séjour sur les îles.</h2>
          </div>
          <Button href="/reserver" variant="secondary">
            Demander une réservation
          </Button>
        </div>
        <Divider light />
        <div className="premium-footer__grid">
          <div className="premium-footer__brand">
            <BrandLogo />
            <p>Deux îles. Trois maisons. Une même passion de l’hospitalité.</p>
          </div>
          <div>
            <p className="premium-footer__label">Découvrir</p>
            <Link href="/maisons">Nos maisons</Link>
            <Link href="/histoire-de-nos-maisons">L’histoire de nos maisons</Link>
            <Link href="/choisir">Choisir ma maison</Link>
            <Link href="/construisez-votre-sejour">Construire mon séjour</Link>
            <Link href="/inspiration">Inspirez-moi</Link>
            <Link href="/destinations">Destinations</Link>
            <Link href="/patrimoine">Patrimoine</Link>
            <Link href="/experiences">Expériences</Link>
            <Link href="/carnet">Le Carnet</Link>
            <Link href="/phototheque">Photothèque</Link>
          </div>
          <div>
            <p className="premium-footer__label">Beaux Rivages</p>
            <Link href="/engagements">Nos engagements</Link>
            <Link href="/pourquoi-beaux-rivages">Pourquoi Beaux Rivages ?</Link>
            <Link href="/sejour">Votre séjour</Link>
            <Link href="/avant-arrivee">Avant votre arrivée</Link>
            <Link href="/conseils">Les conseils de Stéphanie & Bruno</Link>
            <Link href="/mot-de-stephanie">Le mot de Stéphanie</Link>
            <Link href="/saisons">Les saisons</Link>
            <Link href="/coulisses">Les coulisses</Link>
            <Link href="/avis">Avis voyageurs</Link>
            <Link href="/personnaliser">Personnaliser</Link>
            <Link href="/faq">Questions fréquentes</Link>
          </div>
          <div>
            <p className="premium-footer__label">Nous contacter</p>
            <Link href="/contact">Page Contact</Link>
            <a href="mailto:coulotstephanie@gmail.com">coulotstephanie@gmail.com</a>
            <a href="tel:+33617260094">+33 6 17 26 00 94</a>
            <p>Stéphanie & Bruno</p>
          </div>
          <div>
            <p className="premium-footer__label">Informations légales</p>
            <Link href="/conditions-generales-de-vente">Conditions Générales de Vente</Link>
            <Link href="/conditions-generales-utilisation">Conditions Générales d’Utilisation</Link>
            <Link href="/politique-annulation">Politique d’annulation</Link>
            <Link href="/politique-remboursement">Politique de remboursement</Link>
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/politique-de-confidentialite">Politique de confidentialité</Link>
            <Link href="/politique-de-cookies">Politique de cookies</Link>
            <Link href="/charte-qualite">Charte qualité</Link>
            <Link href="/engagements-environnement">Engagements environnementaux</Link>
            <Link href="/charte-animaux">Charte Animaux</Link>
            <Link href="/charte-bon-voisinage">Charte du bon voisinage</Link>
            <Link href="/accessibilite">Accessibilité</Link>
            <Link href="/faq-juridique">FAQ juridique</Link>
          </div>
        </div>
        <Divider light />
        <div className="premium-footer__bottom">
          <p>© {new Date().getFullYear()} Beaux Rivages</p>
          <p>L’hospitalité des îles de Ré et d’Oléron</p>
        </div>
      </Container>
    </footer>
  );
}
