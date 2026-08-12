import assert from "node:assert/strict";

const origin = new URL(process.env.SITE_URL ?? "http://localhost:3107");
const publicOrigin = "https://www.beaux-rivages.com";

function attribute(html, expression, label, route) {
  const match = html.match(expression);
  assert.ok(match?.[1], `${route}: ${label} absent`);
  return match[1];
}

const sitemapResponse = await fetch(new URL("/sitemap.xml", origin));
assert.equal(sitemapResponse.status, 200, "sitemap.xml doit répondre 200");
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(new Set(urls).size, urls.length, "Le sitemap contient des URL en double");

const frenchRoutes = urls
  .map((url) => new URL(url).pathname)
  .filter((pathname) => !/^\/(en|de|es|nl)(\/|$)/.test(pathname));

for (const route of frenchRoutes) {
  const response = await fetch(new URL(route, origin), { redirect: "manual" });
  assert.equal(response.status, 200, `${route}: statut HTTP inattendu`);
  const html = await response.text();
  const title = attribute(html, /<title[^>]*>(.*?)<\/title>/s, "title", route);
  const description = attribute(
    html,
    /<meta name="description" content="([^"]+)"/,
    "meta description",
    route,
  );
  assert.ok(title.length <= 65, `${route}: title trop long (${title.length})`);
  assert.ok(description.length >= 50 && description.length <= 180, `${route}: description hors seuil (${description.length})`);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${route}: un H1 unique est requis`);

  const canonical = attribute(
    html,
    /<link rel="canonical" href="([^"]+)"/,
    "canonical",
    route,
  );
  assert.equal(canonical, `${publicOrigin}${route === "/" ? "" : route}`, `${route}: canonical incorrect`);

  for (const locale of ["fr", "en", "de", "es", "nl", "x-default"]) {
    assert.match(
      html,
      new RegExp(`<link rel="alternate" hrefLang="${locale}" href="[^"]+"`),
      `${route}: hreflang ${locale} absent`,
    );
  }

  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(schemas.length > 0, `${route}: données structurées absentes`);
  for (const [, json] of schemas) assert.doesNotThrow(() => JSON.parse(json), `${route}: JSON-LD invalide`);
}

for (const legacyRoute of [
  "/teletravail",
  "/teletravail-ile-de-re",
  "/sejours-professionnels-ile-de-re",
]) {
  const response = await fetch(new URL(legacyRoute, origin), { redirect: "manual" });
  assert.ok([307, 308].includes(response.status), `${legacyRoute}: redirection absente`);
  assert.equal(response.headers.get("location"), "/sejours-professionnels");
}

const missing = await fetch(new URL("/page-seo-inexistante", origin), { redirect: "manual" });
assert.equal(missing.status, 404, "Une URL inexistante doit rester une vraie 404");

for (const locale of ["", "/en", "/de", "/es", "/nl"]) {
  const route = `${locale}/patrimoine/phare-des-baleines`;
  const response = await fetch(new URL(route, origin));
  assert.equal(response.status, 200, `${route}: statut HTTP inattendu`);
  const html = await response.text();
  assert.match(html, /href="#vieille-tour"/, `${route}: lien #vieille-tour absent`);
  assert.equal(
    (html.match(/id="vieille-tour"/g) ?? []).length,
    1,
    `${route}: la cible #vieille-tour doit être unique`,
  );
}

console.log(`SEO France: ${frenchRoutes.length} pages contrôlées, ${urls.length} URL uniques.`);
