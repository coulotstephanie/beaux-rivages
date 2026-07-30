import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("ADR-0001 fixe les principes fondateurs sans exception implicite", () => {
  const adr = readFileSync(
    "docs/03_ARCHITECTURE/decisions/ADR-0001-founding-principles.md",
    "utf8",
  );
  for (const principle of [
    "Domain Driven Design",
    "Clean Architecture",
    "Feature First",
    "Repository Pattern",
    "Event Driven",
    "TypeScript Strict",
    "Documentation First",
  ]) {
    assert.match(adr, new RegExp(principle));
  }
  assert.match(adr, /Aucune exception n’est autorisée sans un nouvel ADR/);
});

