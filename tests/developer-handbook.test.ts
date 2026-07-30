import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("le Developer Handbook conserve les standards obligatoires", () => {
  const handbook = readFileSync("docs/DEVELOPER_HANDBOOK.md", "utf8");
  for (const standard of [
    "250 lignes",
    "Repository",
    "Supabase",
    "TypeScript",
    "80 %",
    "WCAG",
    "GitHub → Actions → Preview → Validation → Production",
    "Définition de « Done »",
  ]) {
    assert.match(handbook, new RegExp(standard, "i"));
  }
});

test("la traçabilité ne présente pas les objectifs comme déjà acquis", () => {
  const traceability = readFileSync(
    "docs/DEVELOPER_HANDBOOK_TRACEABILITY.md",
    "utf8",
  );
  for (const gap of [
    "Feature First",
    "Tests E2E",
    "Couverture minimale 80 %",
    "Rate limiting",
    "Monitoring et rollback",
  ]) {
    assert.match(traceability, new RegExp(gap, "i"));
  }
  assert.match(traceability, /Non mesuré/);
  assert.match(traceability, /n’est jamais présentée comme déjà conforme/);
});

