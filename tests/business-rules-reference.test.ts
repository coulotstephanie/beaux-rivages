import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("la source métier conserve les invariants officiels", () => {
  const rules = readFileSync("docs/BUSINESS_RULES.md", "utf8");
  for (const invariant of [
    "Completed → Confirmed",
    "Cancelled → Checked-in",
    "Expired → Confirmed",
    "figé après signature",
    "Deux réservations ne peuvent jamais se chevaucher",
    "par animal",
    "suppression logique",
    "La règle métier prime toujours sur la technique",
  ]) {
    assert.match(rules, new RegExp(invariant, "i"));
  }
});

test("les écarts de statuts actuels sont explicitement tracés", () => {
  const traceability = readFileSync(
    "docs/BUSINESS_RULES_TRACEABILITY.md",
    "utf8",
  );
  for (const gap of [
    "checked_in",
    "checked_out",
    "expired",
    "requested",
    "declined",
    "requires_action",
    "partially_refunded",
  ]) {
    assert.match(traceability, new RegExp(gap, "i"));
  }
  assert.match(traceability, /migration additive/);
  assert.match(traceability, /sans perte de données/);
});

