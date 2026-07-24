import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

const links = [
  ["Nos maisons", "#maisons"],
  ["Les îles", "#iles"],
  ["L’hospitalité", "#hospitalite"],
  ["Contact", "#contact"],
] as const;

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" aria-label="Accueil Beaux Rivages" className="brand-link">
        <BrandLogo />
      </Link>
      <nav aria-label="Navigation principale">
        {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <Link className="button button-small" href="#reserver">Réserver</Link>
    </header>
  );
}
