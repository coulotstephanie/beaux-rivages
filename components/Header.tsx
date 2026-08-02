"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { LanguageSelector } from "./LanguageSelector";
import { PublicSiteSearch } from "./PublicSiteSearch";

const houseLinks = [
  ["Les trois maisons", "/maisons"],
  ["Le Chai des Tortues", "/maisons/chai-des-tortues"],
  ["Villa Raie Manta", "/maisons/villa-raie-manta"],
  ["Le Nid d’Été", "/maisons/nid-d-ete"],
  ["Quelle maison choisir ?", "/choisir"],
  ["Leurs histoires", "/histoire-de-nos-maisons"],
] as const;

const islandLinks = [
  ["Guides des deux îles", "/destinations"],
  ["Patrimoine et monuments", "/patrimoine"],
  ["Villages, nature et plages", "/carnet#guides"],
  ["Gastronomie et marchés", "/carnet?categorie=restaurants#guides"],
  ["Vélo et itinéraires", "/carnet?categorie=velo#carte"],
  ["Fort Boyard", "/patrimoine/fort-boyard"],
] as const;

const carnetLinks = [
  ["Ouvrir le Carnet", "/carnet"],
  ["Nos bonnes adresses", "/carnet#guides"],
  ["Anecdotes et petits bonheurs", "/nos-petits-bonheurs"],
  ["Les saisons", "/saisons"],
  ["Les expériences", "/experiences"],
  ["Conseils de Stéphanie & Bruno", "/conseils"],
] as const;

function MegaMenu({
  label,
  image,
  imageAlt,
  introduction,
  links,
}: {
  label: string;
  image: string;
  imageAlt: string;
  introduction: string;
  links: readonly (readonly [string, string])[];
}) {
  return (
    <details className="mega-menu">
      <summary>{label}</summary>
      <div className="mega-menu__panel">
        <div className="mega-menu__visual">
          <Image src={image} alt={imageAlt} fill sizes="360px" />
        </div>
        <div className="mega-menu__content">
          <p className="eyebrow">Beaux Rivages</p>
          <p>{introduction}</p>
          <div className="mega-menu__links">
            {links.map(([title, href]) => (
              <Link href={href} key={href}>
                {title}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
        <PublicSiteSearch />
      </div>
    </details>
  );
}

function MobileGroup({
  label,
  links,
  close,
  open,
  toggle,
}: {
  label: string;
  links: readonly (readonly [string, string])[];
  close: () => void;
  open: boolean;
  toggle: () => void;
}) {
  return (
    <div className={`mobile-navigation__group${open ? " is-open" : ""}`}>
      <button type="button" aria-expanded={open} onClick={toggle}>
        {label}
      </button>
      <div hidden={!open}>
        {links.map(([title, href]) => (
          <Link href={href} onClick={close} key={href}>
            {title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header({ contrast = "light" }: { contrast?: "light" | "dark" }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileGroup(null);
  };

  return (
    <header
      className={`site-header site-header--${contrast}${scrolled ? " is-scrolled" : ""}${menuOpen ? " is-menu-open" : ""}`}
    >
      <div className="site-header__inner">
        <BrandLogo />
        <nav className="desktop-navigation" aria-label="Navigation principale">
          <Link href="/">Accueil</Link>
          <MegaMenu
            label="Nos maisons"
            image="/images/properties/chai-des-tortues/editorial/espace-de-vie-retour-marche.png"
            imageAlt="Le Chai des Tortues"
            introduction="Trois maisons singulières, entre l’Île de Ré et l’Île d’Oléron."
            links={houseLinks}
          />
          <MegaMenu
            label="Découvrir les îles"
            image="/images/destination/re-authentique/phare-des-baleines.jpg"
            imageAlt="Le littoral de l’Île de Ré"
            introduction="Patrimoine, villages, nature, plages et chemins pour découvrir les îles à votre rythme."
            links={islandLinks}
          />
          <MegaMenu
            label="Le Carnet Beaux Rivages"
            image="/images/destination/nina-metayer/selection-patisseries.jpg"
            imageAlt="Une adresse gourmande du Carnet Beaux Rivages"
            introduction="Nos adresses, anecdotes, saisons et conseils personnels réunis comme dans un magazine."
            links={carnetLinks}
          />
          <Link href="/reserver">Réserver</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="site-header__actions">
          <LanguageSelector />
          <Link href="/reserver" className="nav-cta">
            Réserver
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-navigation"
        aria-label="Navigation mobile"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="mobile-navigation__inner">
          <Link href="/" onClick={closeMenu}>
            Accueil
          </Link>
          <MobileGroup
            label="Nos maisons"
            links={houseLinks}
            close={closeMenu}
            open={mobileGroup === "houses"}
            toggle={() => setMobileGroup((value) => (value === "houses" ? null : "houses"))}
          />
          <MobileGroup
            label="Découvrir les îles"
            links={islandLinks}
            close={closeMenu}
            open={mobileGroup === "islands"}
            toggle={() => setMobileGroup((value) => (value === "islands" ? null : "islands"))}
          />
          <MobileGroup
            label="Le Carnet Beaux Rivages"
            links={carnetLinks}
            close={closeMenu}
            open={mobileGroup === "carnet"}
            toggle={() => setMobileGroup((value) => (value === "carnet" ? null : "carnet"))}
          />
          <Link href="/reserver" onClick={closeMenu}>
            Réserver
          </Link>
          <Link href="/contact" onClick={closeMenu}>
            Contact
          </Link>
          <PublicSiteSearch onNavigate={closeMenu} />
        </div>
      </nav>
    </header>
  );
}
