import Link from "next/link";

export function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="eyebrow light">Beaux Rivages</p>
          <h2>Des maisons de caractère, une hospitalité d’exception.</h2>
        </div>
        <div>
          <strong>Stéphanie Coulot</strong>
          <a href="mailto:coulotstephanie@gmail.com">coulotstephanie@gmail.com</a>
          <a href="tel:+33617260094">+33 6 17 26 00 94</a>
        </div>
        <div>
          <Link href="#maisons">Nos maisons</Link>
          <Link href="#iles">Les îles</Link>
          <Link href="#reserver">Réserver en direct</Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Beaux Rivages</span>
        <span>Chèques-Vacances · Virement · Espèces</span>
      </div>
    </footer>
  );
}
