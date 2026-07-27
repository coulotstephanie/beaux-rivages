"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "./BrandLogo";

export function Header({ contrast = "light" }: { contrast?: "light" | "dark" }) {
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
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header site-header--${contrast}${scrolled ? " is-scrolled" : ""}${menuOpen ? " is-menu-open" : ""}`}>
      <div className="site-header__inner">
        <BrandLogo />
        <nav className="desktop-navigation" aria-label="Navigation principale">
          <Link href="/maisons">Nos maisons</Link>
          <Link href="/choisir">Quelle maison ?</Link>
          <Link href="/destinations">Les îles</Link>
          <Link href="/experiences">Expériences</Link>
          <Link href="/carnet">Le Carnet</Link>
          <Link href="/phototheque">Photothèque</Link>
          <Link href="/avis">Avis</Link>
        </nav>
        <div className="site-header__actions">
          <Link href="/reserver" className="nav-cta">Réserver</Link>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span /><span />
          </button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile-navigation" aria-label="Navigation mobile" aria-hidden={!menuOpen} inert={!menuOpen}>
        <Link href="/maisons" onClick={closeMenu}>Nos maisons</Link>
        <Link href="/choisir" onClick={closeMenu}>Quelle maison pour vous ?</Link>
        <Link href="/inspiration" onClick={closeMenu}>Inspirez-moi</Link>
        <Link href="/construisez-votre-sejour" onClick={closeMenu}>Construisez votre séjour</Link>
        <Link href="/avant-arrivee" onClick={closeMenu}>Avant votre arrivée</Link>
        <Link href="/conseils" onClick={closeMenu}>Les conseils de Stéphanie & Bruno</Link>
        <Link href="/sejour" onClick={closeMenu}>Votre séjour</Link>
        <Link href="/saisons" onClick={closeMenu}>Les saisons</Link>
        <Link href="/destinations" onClick={closeMenu}>Les îles</Link>
        <Link href="/experiences" onClick={closeMenu}>Expériences</Link>
        <Link href="/carnet" onClick={closeMenu}>Le Carnet</Link>
        <Link href="/phototheque" onClick={closeMenu}>Photothèque</Link>
        <Link href="/personnaliser" onClick={closeMenu}>Personnaliser</Link>
        <Link href="/engagements" onClick={closeMenu}>Nos engagements</Link>
        <Link href="/pourquoi-beaux-rivages" onClick={closeMenu}>Pourquoi Beaux Rivages ?</Link>
        <Link href="/pourquoi-revenir" onClick={closeMenu}>Pourquoi revenir</Link>
        <Link href="/avis" onClick={closeMenu}>Avis voyageurs</Link>
        <Link href="/faq" onClick={closeMenu}>Questions fréquentes</Link>
        <Link href="/coulisses" onClick={closeMenu}>Les coulisses</Link>
      </nav>
    </header>
  );
}
