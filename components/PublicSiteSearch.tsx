"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { publicSearchIndex } from "@/lib/publicSearchIndex";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .trim();
}

export function PublicSiteSearch({ onNavigate }: { onNavigate?: () => void }) {
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

  return (
    <div className="public-site-search" role="search">
      <label htmlFor={searchId}>Rechercher dans Beaux Rivages</label>
      <div className="public-site-search__field">
        <span aria-hidden="true">⌕</span>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Maison, monument, village, plage…"
          autoComplete="off"
        />
      </div>
      {query.trim().length >= 2 && (
        <div className="public-site-search__results" aria-live="polite">
          {results.length ? (
            results.map((item) => (
              <Link href={item.href} key={`${item.type}-${item.href}`} onClick={onNavigate}>
                <span>{item.type}</span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </Link>
            ))
          ) : (
            <p>Aucun résultat. Essayez un lieu, une maison ou une expérience.</p>
          )}
        </div>
      )}
    </div>
  );
}
