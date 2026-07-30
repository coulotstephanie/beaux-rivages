import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const shell = readFileSync("features/back-office/components/BackOfficeShell.tsx", "utf8");
const dashboard = readFileSync("features/back-office/components/PremiumDashboard.tsx", "utf8");

test("la Command Palette propose recherche, favoris et raccourcis", () => {
  assert.match(shell, /metaKey \|\| event\.ctrlKey/);
  assert.match(shell, /br-back-office-favorites/);
  assert.match(shell, /visibleCommands/);
  for (const shortcut of ['event.key === "1"', 'event.key === "2"', 'event.key === "3"']) assert.match(shell, new RegExp(shortcut.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("thème et favoris sont mémorisés sans appel réseau", () => {
  assert.match(shell, /br-back-office-theme/);
  assert.match(shell, /localStorage/);
  assert.doesNotMatch(shell, /fetch\(|axios|createClient/);
});

test("les widgets du tableau de bord sont configurables et persistants", () => {
  assert.match(dashboard, /br-dashboard-widgets/);
  for (const widget of ["weather", "metrics", "agenda", "houses", "priorities"]) assert.match(dashboard, new RegExp(widget));
  assert.match(dashboard, /Personnaliser le tableau de bord/);
});
