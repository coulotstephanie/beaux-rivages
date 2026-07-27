import assert from "node:assert/strict";

const origin = new URL(process.env.SITE_URL ?? "http://localhost:3100");
const pending = [new URL("/", origin)];
const visited = new Set();
const failures = [];
const pages = new Map();
const fragmentLinks = [];

const sitemapResponse = await fetch(new URL("/sitemap.xml", origin));
if (sitemapResponse.ok) {
  const sitemap = await sitemapResponse.text();
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const published = new URL(match[1]);
    pending.push(new URL(`${published.pathname}${published.search}`, origin));
  }
}

while (pending.length) {
  const url = pending.shift();
  if (!url) continue;
  const routeKey = `${url.pathname}${url.search}`;
  if (visited.has(routeKey)) continue;
  visited.add(routeKey);

  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    failures.push(`${routeKey} returned ${response.status}`);
    continue;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) continue;
  const html = await response.text();
  pages.set(routeKey, html);
  const titles = html.match(/<title(?:\s[^>]*)?>/gi) ?? [];
  const descriptions = html.match(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gi) ?? [];
  const canonicals = html.match(/<link\s+rel="canonical"\s+href="https:\/\/www\.beaux-rivages\.com[^"]*"\s*\/?>/gi) ?? [];
  const openGraphTitles = html.match(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/gi) ?? [];
  const twitterCards = html.match(/<meta\s+name="twitter:card"\s+content="summary_large_image"\s*\/?>/gi) ?? [];
  const structuredData = html.match(/<script\s+type="application\/ld\+json"/gi) ?? [];
  const ids = [...html.matchAll(/\sid="([^"]+)"/gi)].map((match) => match[1]);

  if (titles.length !== 1) failures.push(`${routeKey} has ${titles.length} title tags`);
  if (descriptions.length !== 1) failures.push(`${routeKey} has ${descriptions.length} descriptions`);
  if (canonicals.length !== 1) failures.push(`${routeKey} has ${canonicals.length} absolute canonicals`);
  if (openGraphTitles.length !== 1) failures.push(`${routeKey} has ${openGraphTitles.length} Open Graph titles`);
  if (twitterCards.length !== 1) failures.push(`${routeKey} has ${twitterCards.length} Twitter cards`);
  if (structuredData.length < 1) failures.push(`${routeKey} has no structured data`);
  if (new Set(ids).size !== ids.length) failures.push(`${routeKey} has duplicate HTML ids`);

  for (const match of html.matchAll(/href="([^"]+)"/gi)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (
      href.startsWith("mailto:")
      || href.startsWith("tel:")
      || href.startsWith("javascript:")
    ) continue;

    const linked = new URL(href, url);
    if (linked.origin !== origin.origin || linked.pathname.startsWith("/_next/")) continue;
    if (linked.hash) {
      fragmentLinks.push({
        from: routeKey,
        target: `${linked.pathname}${linked.search}`,
        fragment: decodeURIComponent(linked.hash.slice(1)),
      });
    }
    linked.hash = "";
    const linkedKey = `${linked.pathname}${linked.search}`;
    if (!visited.has(linkedKey)) pending.push(linked);
  }
}

for (const { from, target, fragment } of fragmentLinks) {
  const html = pages.get(target);
  if (!html) {
    failures.push(`${from} links to unchecked fragment target ${target}#${fragment}`);
    continue;
  }
  const targetIds = new Set([...html.matchAll(/\sid="([^"]+)"/gi)].map((match) => match[1]));
  if (!targetIds.has(fragment)) failures.push(`${from} links to missing fragment ${target}#${fragment}`);
}

assert.deepEqual(failures, [], failures.join("\n"));
console.log(`Site crawl passed: ${visited.size} internal URLs and ${fragmentLinks.length} fragment links checked.`);
