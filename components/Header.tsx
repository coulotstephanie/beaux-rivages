"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { LanguageSelector } from "./LanguageSelector";
import { PublicSiteSearch } from "./PublicSiteSearch";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr, localizedHref } from "@/i18n/lot1-client";

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
  ["Vélo et itinéraires", "/velo-itineraires"],
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
  locale,
}: {
  label: string;
  image: string;
  imageAlt: string;
  introduction: string;
  links: readonly (readonly [string, string])[];
  locale: SupportedLocale;
}) {
  return (
    <details className="mega-menu">
      <summary>{tr(locale, label)}</summary>
      <div className="mega-menu__panel">
        <div className="mega-menu__visual">
          <Image src={image} alt={imageAlt} fill sizes="360px" />
        </div>
        <div className="mega-menu__content">
          <p className="eyebrow">Beaux Rivages</p>
          <p>{tr(locale, introduction)}</p>
          <div className="mega-menu__links">
            {links.map(([title, href]) => (
              <Link href={localizedHref(locale, href)} key={href}>
                {tr(locale, title)}
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
  locale,
}: {
  label: string;
  links: readonly (readonly [string, string])[];
  close: () => void;
  locale: SupportedLocale;
}) {
  return (
    <details className="mobile-navigation__group">
      <summary>{tr(locale, label)}</summary>
      <div>
        {links.map(([title, href]) => (
          <Link href={localizedHref(locale, href)} onClick={close} key={href}>
            {tr(locale, title)}
          </Link>
        ))}
      </div>
    </details>
  );
}

export function Header({
  contrast = "light",
  locale = "fr",
}: {
  contrast?: "light" | "dark";
  locale?: SupportedLocale;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
  };

  return (
    <header
      className={`site-header site-header--${contrast}${scrolled ? " is-scrolled" : ""}${menuOpen ? " is-menu-open" : ""}`}
    >
      <div className="site-header__inner">
        <BrandLogo />
        <nav className="desktop-navigation" aria-label={tr(locale, "Navigation principale")}>
          <Link href={localizedHref(locale, "/")}>{tr(locale, "Accueil")}</Link>
          <MegaMenu
            label="Nos maisons"
            image="/images/properties/chai-des-tortues/port-fleuri.jpeg"
            imageAlt="Le Chai des Tortues"
            introduction="Trois maisons singulières, entre l’Île de Ré et l’Île d’Oléron."
            links={houseLinks}
            locale={locale}
          />
          <MegaMenu
            label="Découvrir les îles"
            image="/images/destination/re-authentique/phare-des-baleines.jpg"
            imageAlt="Le littoral de l’Île de Ré"
            introduction="Patrimoine, villages, nature, plages et chemins pour découvrir les îles à votre rythme."
            links={islandLinks}
            locale={locale}
          />
          <MegaMenu
            label="Le Carnet Beaux Rivages"
            image="/images/destination/nina-metayer/cookie-brownie.jpg"
            imageAlt="Une adresse gourmande du Carnet Beaux Rivages"
            introduction="Nos adresses, anecdotes, saisons et conseils personnels réunis comme dans un magazine."
            links={carnetLinks}
            locale={locale}
          />
          <Link href={localizedHref(locale, "/contact")}>
            {tr(locale, "Séjours professionnels")}
          </Link>
          <Link href={localizedHref(locale, "/reserver")}>{tr(locale, "Réserver")}</Link>
          <Link href={localizedHref(locale, "/contact")}>{tr(locale, "Contact")}</Link>
        </nav>
        <div className="site-header__actions">
          <LanguageSelector />
          <Link href={localizedHref(locale, "/reserver")} className="nav-cta">
            {tr(locale, "Réserver")}
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={tr(locale, menuOpen ? "Fermer le menu" : "Ouvrir le menu")}
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
        aria-label={tr(locale, "Navigation mobile")}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="mobile-navigation__inner">
          <Link href={localizedHref(locale, "/")} onClick={closeMenu}>
            {tr(locale, "Accueil")}
          </Link>
          <MobileGroup label="Nos maisons" links={houseLinks} close={closeMenu} locale={locale} />
          <MobileGroup
            label="Découvrir les îles"
            links={islandLinks}
            close={closeMenu}
            locale={locale}
          />
          <MobileGroup
            label="Le Carnet Beaux Rivages"
            links={carnetLinks}
            close={closeMenu}
            locale={locale}
          />
          <Link href={localizedHref(locale, "/contact")} onClick={closeMenu}>
            {tr(locale, "Séjours professionnels")}
          </Link>
          <Link href={localizedHref(locale, "/reserver")} onClick={closeMenu}>
            {tr(locale, "Réserver")}
          </Link>
          <Link href={localizedHref(locale, "/contact")} onClick={closeMenu}>
            {tr(locale, "Contact")}
          </Link>
          <PublicSiteSearch onNavigate={closeMenu} />
        </div>
      </nav>
    </header>
  );
}
