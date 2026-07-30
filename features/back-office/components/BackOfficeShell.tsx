"use client";

import {
  CalendarDays,
  BookOpenText,
  ChevronLeft,
  Gauge,
  Menu,
  MessagesSquare,
  Search,
  Settings,
  Tags,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

const navigation = [
  { href: "/administration", label: "Tableau de bord", icon: Gauge },
  { href: "/administration/calendriers", label: "Calendrier", icon: CalendarDays },
  { href: "/administration/tarifs", label: "Tarifs & offres", icon: Tags },
  { href: "/administration/voyageurs", label: "Voyageurs CRM", icon: Users },
  { href: "/administration/communications", label: "Communications", icon: MessagesSquare },
  { href: "/administration/contenus", label: "CMS & Carnet", icon: BookOpenText },
];

export function BackOfficeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="bo-shell">
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
          <button type="button">
            <Settings aria-hidden="true" />
            Paramètres
          </button>
        </div>
      </aside>
      <div className="bo-main">
        <header className="bo-topbar">
          <button className="bo-menu" type="button" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
            <Menu />
          </button>
          <label className="bo-search">
            <Search aria-hidden="true" />
            <input type="search" placeholder="Rechercher un voyageur, une réservation…" />
          </label>
          <div className="bo-user">
            <span>SB</span>
            <div>
              <strong>Stéphanie</strong>
              <small>Administratrice</small>
            </div>
          </div>
        </header>
        {children}
      </div>
      {open && <button className="bo-backdrop" type="button" onClick={() => setOpen(false)} aria-label="Fermer le menu" />}
    </div>
  );
}
