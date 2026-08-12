"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { calculateGuestBookStats, type GuestBookEntry } from "@/features/guestbook";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr } from "@/i18n/lot1-client";

const houseLabels = {
  "chai-des-tortues": "Le Chai des Tortues",
  "villa-raie-manta": "Villa Raie Manta",
  "nid-d-ete": "Le Nid d’Été",
} as const;
const languageLabels = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
  es: "Español",
  nl: "Nederlands",
  other: "Autre",
} as const;

function formatGuestBookDate(value: string, language: string) {
  const locale = language === "en" ? "en-GB" : "fr-FR";
  const date = new Date(`${value.length === 7 ? `${value}-01` : value}T12:00:00`);
  return new Intl.DateTimeFormat(
    locale,
    value.length === 7
      ? { month: "long", year: "numeric" }
      : { day: "numeric", month: "long", year: "numeric" },
  ).format(date);
}

export function GuestBook({
  entries,
  compact = false,
  locale = "fr",
}: {
  entries: GuestBookEntry[];
  compact?: boolean;
  locale?: SupportedLocale;
}) {
  const reducedMotion = useReducedMotion();
  const [search, setSearch] = useState("");
  const [house, setHouse] = useState("all");
  const [language, setLanguage] = useState("all");
  const [year, setYear] = useState("all");
  const [tag, setTag] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = compact ? 5 : 6;
  const years = [...new Set(entries.map((entry) => entry.date.slice(0, 4)))].sort().reverse();
  const tags = [...new Set(entries.flatMap((entry) => entry.tags))].sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
  const filtered = useMemo(
    () =>
      entries.filter((entry) => {
        const haystack = `${entry.author} ${entry.text} ${entry.tags.join(" ")}`.toLocaleLowerCase(
          "fr",
        );
        return (
          (!search || haystack.includes(search.toLocaleLowerCase("fr"))) &&
          (house === "all" || entry.house === house) &&
          (language === "all" || entry.language === language) &&
          (year === "all" || entry.date.startsWith(year)) &&
          (tag === "all" || entry.tags.includes(tag))
        );
      }),
    [entries, house, language, search, tag, year],
  );
  const stats = calculateGuestBookStats(filtered);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice(
    (Math.min(page, pageCount) - 1) * pageSize,
    Math.min(page, pageCount) * pageSize,
  );
  const update = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <section
      className={`guestbook ${compact ? "guestbook--compact" : ""}`}
      aria-label={tr(locale, "Livre d’Or Beaux Rivages")}
    >
      {!compact && (
        <div
          className="guestbook__filters"
          role="search"
          aria-label="Rechercher dans le Livre d’Or"
        >
          <label>
            <span>Rechercher</span>
            <input
              type="search"
              value={search}
              onChange={(event) => update(setSearch)(event.target.value)}
              placeholder="Un mot, un souvenir…"
            />
          </label>
          <label>
            <span>Maison</span>
            <select value={house} onChange={(event) => update(setHouse)(event.target.value)}>
              <option value="all">Toutes</option>
              {Object.entries(houseLabels).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Langue</span>
            <select value={language} onChange={(event) => update(setLanguage)(event.target.value)}>
              <option value="all">Toutes</option>
              {Object.entries(languageLabels).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Année</span>
            <select value={year} onChange={(event) => update(setYear)(event.target.value)}>
              <option value="all">Toutes</option>
              {years.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Thème</span>
            <select value={tag} onChange={(event) => update(setTag)(event.target.value)}>
              <option value="all">Tous</option>
              {tags.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {!compact && (
        <div className="guestbook__stats" aria-live="polite">
          <strong>{stats.total}</strong>
          <span>mots laissés dans le carnet</span>
          <span>
            {stats.languages.length} langue{stats.languages.length > 1 ? "s" : ""}
          </span>
          <span>
            {stats.themes
              .slice(0, 3)
              .map((item) => item.value)
              .join(" · ")}
          </span>
        </div>
      )}

      <div className="guestbook__pages">
        <AnimatePresence mode="popLayout">
          {visible.map((entry, index) => (
            <motion.article
              id={`temoignage-${entry.id}`}
              className="guestbook-card"
              key={entry.id}
              initial={
                reducedMotion ? false : { opacity: 0, y: 22, rotate: index % 2 ? 0.6 : -0.6 }
              }
              animate={{ opacity: 1, y: 0, rotate: index % 2 ? 0.3 : -0.3 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              tabIndex={0}
            >
              <div className="guestbook-card__binding" aria-hidden="true" />
              <p className="guestbook-card__date">
                {formatGuestBookDate(entry.date, entry.language)} · {languageLabels[entry.language]}
              </p>
              <blockquote lang={entry.language}>
                <p>« {entry.text} »</p>
                <footer>— {entry.author}</footer>
              </blockquote>
              <div className="guestbook-card__tags">
                {entry.tags.map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
        {!visible.length && (
          <p className="guestbook__empty">Aucun souvenir ne correspond encore à ces critères.</p>
        )}
      </div>

      {!compact && pageCount > 1 && (
        <nav className="guestbook__pagination" aria-label="Pagination du Livre d’Or">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page === 1}
          >
            ← Précédent
          </button>
          <span>
            Page {Math.min(page, pageCount)} sur {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            disabled={page >= pageCount}
          >
            Suivant →
          </button>
        </nav>
      )}
    </section>
  );
}
