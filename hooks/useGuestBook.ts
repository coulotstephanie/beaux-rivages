"use client";

import { useEffect, useState } from "react";
import type { GuestBookEntry, GuestBookFilters } from "@/features/guestbook";

export function useGuestBook(filters: GuestBookFilters = {}) {
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { house, language, search, tag, year } = filters;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    Object.entries({ house, language, search, tag, year }).forEach(
      ([key, value]) => value && value !== "all" && params.set(key, value),
    );
    fetch(`/api/guestbook?${params}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Livre d’Or indisponible");
        return response.json() as Promise<{ entries: GuestBookEntry[] }>;
      })
      .then((body) => setEntries(body.entries))
      .catch((reason) => reason.name !== "AbortError" && setError(reason.message))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [house, language, search, tag, year]);

  return { entries, loading, error };
}
