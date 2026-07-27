import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { Button, Container, Divider } from "./ui";

export function Footer() {
  return (
    <footer id="contact" className="footer premium-footer">
      <Container size="wide">
        <div className="premium-footer__top">
          <div>
            <p className="eyebrow light">Votre prochaine parenthèse</p>
            <h2>Préparons votre séjour sur les îles.</h2>
          </div>
          <Button href="/reserver" variant="secondary">Demander une réservation</Button>
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
            <Link href="/choisir">Choisir ma maison</Link>
            <Link href="/construisez-votre-sejour">Construire mon séjour</Link>
            <Link href="/inspiration">Inspirez-moi</Link>
            <Link href="/destinations">Destinations</Link>
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
            <Link href="/saisons">Les saisons</Link>
            <Link href="/coulisses">Les coulisses</Link>
            <Link href="/avis">Avis voyageurs</Link>
            <Link href="/personnaliser">Personnaliser</Link>
            <Link href="/faq">Questions fréquentes</Link>
          </div>
          <div>
            <p className="premium-footer__label">Nous contacter</p>
            <a href="mailto:coulotstephanie@gmail.com">coulotstephanie@gmail.com</a>
            <a href="tel:+33617260094">+33 6 17 26 00 94</a>
            <p>Stéphanie & Bruno</p>
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
