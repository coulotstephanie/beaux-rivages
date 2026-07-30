import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("l’architecture système conserve les couches et flux officiels", () => {
  const architecture = readFileSync("docs/SYSTEM_ARCHITECTURE.md", "utf8");
  for (const concept of [
    "Cloudflare",
    "Vercel Edge Network",
    "Repository Interfaces",
    "Row Level Security",
    "PaymentSucceeded",
    "Notification Engine",
    "Channel Manager",
    "Validation humaine",
  ]) {
    assert.match(architecture, new RegExp(concept, "i"));
  }
});

test("la traçabilité sépare la cible des services activés", () => {
  const traceability = readFileSync(
    "docs/SYSTEM_ARCHITECTURE_TRACEABILITY.md",
    "utf8",
  );
  assert.match(traceability, /Cloudflare CDN \+ WAF \| Non vérifié/);
  assert.match(traceability, /Supabase Edge Functions \| Non activé/);
  assert.match(traceability, /Stripe \| Mode test/);
  assert.match(traceability, /SMS et Push \| Absent/);
  assert.match(traceability, /Multi-tenant \| Préparé, non activé/);
  assert.match(traceability, /Une sauvegarde n’est validée qu’après un exercice de restauration/);
});

