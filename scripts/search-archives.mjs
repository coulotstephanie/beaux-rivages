import fs from "node:fs";
import path from "node:path";

const query = process.argv.slice(2).join(" ").trim().toLocaleLowerCase("fr");
if (!query) {
  console.error("Usage: node scripts/search-archives.mjs <mots-clés>");
  process.exit(1);
}

const directory = path.join(process.cwd(), "docs", "archives");
const terms = query.split(/\s+/).filter(Boolean);
const results = fs.readdirSync(directory)
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const content = fs.readFileSync(path.join(directory, file), "utf8");
    const normalized = content.toLocaleLowerCase("fr");
    const score = terms.reduce((total, term) => total + (normalized.split(term).length - 1), 0);
    const title = content.match(/^#\s+(.+)$/m)?.[1] ?? file;
    return { file, title, score };
  })
  .filter((result) => result.score > 0)
  .sort((a, b) => b.score - a.score);

if (!results.length) {
  console.log("Aucun résultat.");
} else {
  for (const result of results) console.log(`${result.score}\t${result.file}\t${result.title}`);
}
