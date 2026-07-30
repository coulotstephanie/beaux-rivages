import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("le manuel confidentiel n’est pas copié dans le dépôt public", () => {
  const portal = readFileSync(
    "docs/05_OPERATIONS/OperationsManual.md",
    "utf8",
  );
  assert.match(portal, /dépôt GitHub public/);
  assert.match(portal, /manuel complet Beaux Rivages est confidentiel/);
  assert.doesNotMatch(portal, /<10 minutes/);
  assert.doesNotMatch(portal, /24 h avant/);
});

test("les documents privés locaux sont ignorés par Git", () => {
  const ignore = readFileSync(".gitignore", "utf8");
  assert.match(ignore, /^\/docs-private\/$/m);
  const classification = readFileSync(
    "docs/05_OPERATIONS/DocumentationClassification.md",
    "utf8",
  );
  assert.match(classification, /Secret .* Strictement interdit/);
  assert.match(classification, /gestionnaire de secrets/);
});

