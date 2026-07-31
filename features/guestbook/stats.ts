import type { GuestBookEntry, GuestBookStats } from "./types";

const ignoredWords = new Set([
  "avec",
  "cette",
  "dans",
  "nous",
  "pour",
  "très",
  "votre",
  "vous",
  "mais",
  "plus",
  "chez",
  "tout",
  "bien",
  "une",
  "des",
  "les",
  "est",
  "sur",
  "notre",
  "séjour",
]);

export function calculateGuestBookStats(entries: GuestBookEntry[]): GuestBookStats {
  const languages = new Map<GuestBookEntry["language"], number>();
  const themes = new Map<string, number>();
  const words = new Map<string, number>();

  for (const entry of entries) {
    languages.set(entry.language, (languages.get(entry.language) ?? 0) + 1);
    for (const tag of entry.tags) themes.set(tag, (themes.get(tag) ?? 0) + 1);
    for (const token of entry.text.toLocaleLowerCase("fr").match(/[\p{L}’-]{4,}/gu) ?? []) {
      const word = token.replace(/[’'-]/g, "");
      if (!ignoredWords.has(word)) words.set(word, (words.get(word) ?? 0) + 1);
    }
  }

  const ranked = <T extends string>(values: Map<T, number>, limit = 12) =>
    [...values.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"))
      .slice(0, limit)
      .map(([value, count]) => ({ value, count }));

  return {
    total: entries.length,
    languages: ranked(languages),
    themes: ranked(themes),
    words: ranked(words),
  };
}
