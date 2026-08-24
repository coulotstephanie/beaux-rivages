import fs from "node:fs";
import missing from "/tmp/lot1-missing.json" with { type: "json" };
import { pathToFileURL } from "node:url";

const source =
  fs.readFileSync(new URL("../i18n/lot1/catalog.ts", import.meta.url), "utf8") +
  fs.readFileSync(new URL("../i18n/lot1/content.ts", import.meta.url), "utf8");
const exact = [...source.matchAll(/(?:e|q|same)\("((?:[^"\\]|\\.)*)"/g)].map((match) =>
  JSON.parse(`"${match[1]}"`),
);
const dynamic = [
  /^Langue actuelle : /,
  /^Informations essentielles — /,
  /^Plus de (67|61|136) voyageurs/,
  /^(9,3\/10 · 21|9,1\/10 · 30|9,2\/10 · 15) avis/,
  /^photos\)$/,
];
const uncovered = missing.filter(
  (value) => !exact.includes(value) && !dynamic.some((pattern) => pattern.test(value)),
);
if (uncovered.length) throw new Error(`Chaînes non classées: ${uncovered.join(" | ")}`);
console.log(
  JSON.stringify(
    { audited: missing.length, covered: missing.length - uncovered.length, uncovered },
    null,
    2,
  ),
);

if (process.argv.includes("--markdown")) {
  const moduleUrl = pathToFileURL(new URL("../i18n/lot1/index.ts", import.meta.url).pathname).href;
  const { lot1Entries } = await import(moduleUrl);
  console.log("\n| Clé | Français | EN | DE | ES | NL | Décision |");
  console.log("|---|---|---|---|---|---|---|");
  const cell = (value) => value.replaceAll("|", "\\|").replaceAll("\n", " ");
  for (const [key, entry] of Object.entries(lot1Entries)) {
    console.log(
      `| ${key} | ${cell(entry.fr)} | ${cell(entry.en)} | ${cell(entry.de)} | ${cell(entry.es)} | ${cell(entry.nl)} | ${entry.decision} |`,
    );
  }
}
