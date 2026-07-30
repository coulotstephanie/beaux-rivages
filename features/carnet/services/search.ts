import type { CarnetEntry } from "../types";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr");

export function searchCarnetEntries(
  entries: CarnetEntry[],
  filters: { query?: string; category?: string; destination?: string },
) {
  const query = normalize(filters.query?.trim() ?? "");
  return entries.filter((entry) => {
    if (filters.category && entry.category !== filters.category) return false;
    if (
      filters.destination &&
      entry.destination !== "all" &&
      entry.destination !== filters.destination
    )
      return false;
    if (!query) return true;
    return normalize(
      [entry.title, entry.summary, entry.body, entry.address, entry.hostTip, ...entry.tags].join(
        " ",
      ),
    ).includes(query);
  });
}
