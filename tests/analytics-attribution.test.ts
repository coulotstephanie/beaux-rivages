import assert from "node:assert/strict";
import test from "node:test";
import { parseAttribution } from "../platform/analytics/attribution";

test("identifie une campagne partenaire avec des paramètres UTM", () => {
  assert.deepEqual(
    parseAttribution(
      "https://www.beaux-rivages.com/?utm_source=ile-oleron&utm_medium=partner&utm_campaign=annonce-2026",
    ),
    {
      traffic_source: "ile-oleron",
      traffic_medium: "partner",
      traffic_campaign: "annonce-2026",
    },
  );
});

test("utilise le domaine référent sans enregistrer l'URL complète", () => {
  assert.deepEqual(
    parseAttribution(
      "https://www.beaux-rivages.com/maisons",
      "https://www.google.fr/search?q=secret",
    ),
    {
      traffic_source: "google.fr",
      traffic_medium: "referral",
      referrer_host: "google.fr",
    },
  );
});

test("classe une visite sans provenance comme accès direct", () => {
  assert.deepEqual(parseAttribution("https://www.beaux-rivages.com/"), {
    traffic_source: "direct",
    traffic_medium: "none",
  });
});
