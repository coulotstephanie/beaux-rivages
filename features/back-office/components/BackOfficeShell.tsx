"use client";

import {
  CalendarDays,
  Bell,
  BookOpenText,
  CheckSquare,
  ChevronLeft,
  Command,
  History,
  Gauge,
  LayoutDashboard,
  Menu,
  MessagesSquare,
  Moon,
  Search,
  Settings,
  Star,
  Sun,
  Tags,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const navigation = [
  { href: "/administration", label: "Tableau de bord", icon: Gauge },
  { href: "/administration/ma-journee", label: "Ma journée", icon: CheckSquare },
  { href: "/administration/taches", label: "Tâches & checklists", icon: CheckSquare },
  { href: "/administration/activite", label: "Historique", icon: History },
  { href: "/administration/supervision", label: "Command Center", icon: LayoutDashboard },
  { href: "/administration/calendriers", label: "Calendrier", icon: CalendarDays },
  { href: "/administration/tarifs", label: "Tarifs & offres", icon: Tags },
  { href: "/administration/voyageurs", label: "Voyageurs CRM", icon: Users },
  { href: "/administration/communications", label: "Communications", icon: MessagesSquare },
  { href: "/administration/contenus", label: "CMS & Carnet", icon: BookOpenText },
  { href: "/administration/parametres", label: "Paramètres", icon: Settings },
];

const commandItems = [
  { id: "guest", href: "/administration/voyageurs", label: "Élodie & Thomas Martin", detail: "Voyageur · Le Chai des Tortues", icon: Users },
  { id: "booking", href: "/administration/calendriers", label: "BR-2026-084", detail: "Réservation · 3 au 10 août", icon: CalendarDays },
  { id: "article", href: "/administration/contenus", label: "Les marchés de l’île", detail: "Article du Carnet", icon: BookOpenText },
  { id: "contract", href: "/administration/activite", label: "Contrat BR-2026-084", detail: "Document signé", icon: History },
];

export function BackOfficeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("br-back-office-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(storedTheme ? storedTheme === "dark" : prefersDark);
    setFavorites(JSON.parse(window.localStorage.getItem("br-back-office-favorites") ?? "[]") as string[]);
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
      if (event.altKey && event.key === "1") window.location.assign("/administration/ma-journee");
      if (event.altKey && event.key === "2") window.location.assign("/administration/calendriers");
      if (event.altKey && event.key === "3") window.location.assign("/administration/voyageurs");
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !dark;
    setDark(nextTheme);
    window.localStorage.setItem("br-back-office-theme", nextTheme ? "dark" : "light");
  };
  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem("br-back-office-favorites", JSON.stringify(next));
      return next;
    });
  };
  const visibleCommands = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fr");
    return commandItems
      .filter((item) => !normalized || `${item.label} ${item.detail}`.toLocaleLowerCase("fr").includes(normalized))
      .sort((left, right) => Number(favorites.includes(right.id)) - Number(favorites.includes(left.id)));
  }, [favorites, query]);

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
            <input ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher voyageurs, réservations, documents…" aria-label="Recherche globale" />
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
            <p>{query ? `Résultats pour « ${query} »` : favorites.length ? "Favoris et suggestions" : "Suggestions"}</p>
            {visibleCommands.map(({ id, href, label, detail, icon: Icon }) => <div className="bo-command-result" key={id}><Link href={href} onClick={() => setSearchOpen(false)}><Icon /><span><strong>{label}</strong><small>{detail}</small></span></Link><button type="button" className={favorites.includes(id) ? "is-favorite" : ""} onClick={() => toggleFavorite(id)} aria-label={`${favorites.includes(id) ? "Retirer des" : "Ajouter aux"} favoris`}><Star /></button></div>)}
            {!visibleCommands.length && <p className="bo-empty">Aucun résultat. Essayez un nom, une réservation ou un document.</p>}
            <footer><span>Alt+1 Ma journée</span><span>Alt+2 Calendrier</span><span>Alt+3 Voyageurs</span></footer>
          </div>
        )}
        {notificationsOpen && (
          <aside className="bo-notifications" aria-label="Notifications importantes">
            <header><strong>Centre de notifications</strong><small>3 importantes</small></header>
            <button type="button"><span>Paiement à relancer</span><small>Villa Raie Manta · aujourd’hui</small></button>
            <button type="button"><span>Nouvelle réservation</span><small>Le Nid d’Été · il y a 12 min</small></button>
            <button type="button"><span>Erreur de synchronisation</span><small>Airbnb · Le Chai des Tortues</small></button>
            <Link href="/administration/activite">Voir toutes les notifications</Link>
          </aside>
        )}
        {children}
      </div>
      {open && <button className="bo-backdrop" type="button" onClick={() => setOpen(false)} aria-label="Fermer le menu" />}
    </div>
  );
}
