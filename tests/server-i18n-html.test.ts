import assert from "node:assert/strict";
import test from "node:test";
import { translateInitialHtml } from "../i18n/server-html";

const source = `<!doctype html><html lang="fr"><head><title>Nos maisons | Beaux Rivages</title><meta name="description" content="Trois maisons de caractère sur les îles de Ré et d’Oléron, préparées avec soin par Stéphanie et Bruno."><meta property="og:url" content="https://www.beaux-rivages.com/maisons"/><link rel="canonical" href="https://www.beaux-rivages.com/maisons"/></head><body><strong>Beaux Rivages</strong><h1>Nos maisons</h1><a href="/reserver">Réserver</a><a href="/carnet?categorie=restaurants#guides">Carnet</a><img alt="La chambre des enfants"></body></html>`;

for (const locale of ["en", "de", "es", "nl"] as const) {
  test(`le HTML initial ${locale} est traduit côté serveur`, () => {
    const html = translateInitialHtml(source, locale, "/maisons");
    assert.match(html, new RegExp(`<html lang="${locale}"`));
    assert.match(
      html,
      new RegExp(`canonical" href="https://www.beaux-rivages.com/${locale}/maisons`),
    );
    assert.doesNotMatch(html, />Nos maisons</);
    assert.doesNotMatch(html, />Réserver</);
    assert.match(html, new RegExp(`href="/${locale}/reserver"`));
    assert.match(html, new RegExp(`href="/${locale}/carnet\\?categorie=restaurants#guides"`));
    assert.match(html, /<strong>Beaux Rivages<\/strong>/);
  });
}
