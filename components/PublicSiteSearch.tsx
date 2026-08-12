"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { publicSearchIndex } from "@/lib/publicSearchIndex";
import type { SupportedLocale } from "@/i18n/config";
import { clientLocalize as tr, localizedHref } from "@/i18n/lot1-client";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .trim();
}

export function PublicSiteSearch({ onNavigate, locale = "fr" }: { onNavigate?: () => void; locale?: SupportedLocale }) {
  const router = useRouter();
  const searchId = useId();
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = normalize(query);
    if (needle.length < 2) return [];
    return publicSearchIndex
      .filter((item) =>
        normalize(`${item.title} ${item.type} ${item.description} ${item.keywords}`).includes(
          needle,
        ),
      )
      .slice(0, 7);
  }, [query]);

  const openFirstResult = () => {
    const firstResult = results[0];
    if (!firstResult) return;
    onNavigate?.();
    router.push(localizedHref(locale, firstResult.href));
  };

  return (
    <form
      className="public-site-search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        openFirstResult();
      }}
    >
      <label htmlFor={searchId}>{tr(locale, "Rechercher dans Beaux Rivages")}</label>
      <div className="public-site-search__field">
        <span aria-hidden="true">⌕</span>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tr(locale, "Maison, monument, village, plage…")}
          autoComplete="off"
        />
        <button type="submit" disabled={!results.length} aria-label={tr(locale, "Ouvrir le premier résultat")}>
          {tr(locale, "Rechercher")}
        </button>
      </div>
      {query.trim().length >= 2 && (
        <div className="public-site-search__results" aria-live="polite">
          {results.length ? (
            results.map((item) => (
              <Link href={localizedHref(locale, item.href)} key={`${item.type}-${item.href}`} onClick={onNavigate}>
                <span>{tr(locale, item.type)}</span>
                <strong>{tr(locale, item.title)}</strong>
                <small>{tr(locale, item.description)}</small>
              </Link>
            ))
          ) : (
            <p>{tr(locale, "Aucun résultat. Essayez un lieu, une maison ou une expérience.")}</p>
          )}
        </div>
      )}
    </form>
  );
}
