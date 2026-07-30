"use client";

import {
  CalendarDays,
  Bell,
  BookOpenText,
  ChevronLeft,
  Command,
  Gauge,
  Menu,
  MessagesSquare,
  Moon,
  Search,
  Settings,
  Sun,
  Tags,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

const navigation = [
  { href: "/administration", label: "Tableau de bord", icon: Gauge },
  { href: "/administration/calendriers", label: "Calendrier", icon: CalendarDays },
  { href: "/administration/tarifs", label: "Tarifs & offres", icon: Tags },
  { href: "/administration/voyageurs", label: "Voyageurs CRM", icon: Users },
  { href: "/administration/communications", label: "Communications", icon: MessagesSquare },
  { href: "/administration/contenus", label: "CMS & Carnet", icon: BookOpenText },
  { href: "/administration/parametres", label: "Paramètres", icon: Settings },
];

export function BackOfficeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("br-back-office-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(storedTheme ? storedTheme === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !dark;
    setDark(nextTheme);
    window.localStorage.setItem("br-back-office-theme", nextTheme ? "dark" : "light");
  };

  return (
    <div className="bo-shell" data-theme={dark ? "dark" : "light"}>
      <aside className={`bo-sidebar${open ? " is-open" : ""}`}>
        <div className="bo-brand">
          <span>BR</span>
          <div>
            <strong>Beaux Rivages</strong>
            <small>Administration privée</small>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Fermer le menu">
            <X />
          </button>
        </div>
        <nav aria-label="Navigation du Back Office">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              <Icon aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="bo-sidebar__footer">
          <Link href="/">
            <ChevronLeft aria-hidden="true" />
            Voir le site
          </Link>
        </div>
      </aside>
      <div className="bo-main">
        <header className="bo-topbar">
          <button className="bo-menu" type="button" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
            <Menu />
          </button>
          <label className="bo-search" onFocus={() => setSearchOpen(true)}>
            <Search aria-hidden="true" />
            <input ref={searchRef} type="search" placeholder="Rechercher partout…" aria-label="Recherche globale" />
            <kbd>⌘ K</kbd>
          </label>
          <button className="bo-icon-button" type="button" onClick={toggleTheme} aria-label={dark ? "Activer le mode clair" : "Activer le mode sombre"}>
            {dark ? <Sun /> : <Moon />}
          </button>
          <button className="bo-icon-button bo-notification-button" type="button" onClick={() => setNotificationsOpen((value) => !value)} aria-label="Afficher les notifications" aria-expanded={notificationsOpen}>
            <Bell />
            <i aria-label="3 notifications">3</i>
          </button>
          <div className="bo-user">
            <span>SB</span>
            <div>
              <strong>Stéphanie</strong>
              <small>Administratrice</small>
            </div>
          </div>
        </header>
        {searchOpen && (
          <div className="bo-command" role="dialog" aria-label="Recherche globale">
            <div>
              <Command aria-hidden="true" />
              <span>Accès rapide</span>
              <button type="button" onClick={() => setSearchOpen(false)}>Échap</button>
            </div>
            <Link href="/administration/voyageurs" onClick={() => setSearchOpen(false)}><Users /> Rechercher un voyageur</Link>
            <Link href="/administration/calendriers" onClick={() => setSearchOpen(false)}><CalendarDays /> Ouvrir le calendrier</Link>
            <Link href="/administration/communications" onClick={() => setSearchOpen(false)}><MessagesSquare /> Préparer un message</Link>
            <Link href="/administration/parametres" onClick={() => setSearchOpen(false)}><Settings /> Modifier les paramètres</Link>
          </div>
        )}
        {notificationsOpen && (
          <aside className="bo-notifications" aria-label="Notifications importantes">
            <header><strong>Notifications</strong><small>3 importantes</small></header>
            <button type="button"><span>Paiement à relancer</span><small>Villa Raie Manta · aujourd’hui</small></button>
            <button type="button"><span>Contrat non signé</span><small>Le Nid d’Été · arrivée demain</small></button>
            <button type="button"><span>Maintenance à confirmer</span><small>Le Chai des Tortues · 16 h</small></button>
          </aside>
        )}
        {children}
      </div>
      {open && <button className="bo-backdrop" type="button" onClick={() => setOpen(false)} aria-label="Fermer le menu" />}
    </div>
  );
}
