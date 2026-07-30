import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const decisions = [
  ["ADR-0002-database.md", "Supabase PostgreSQL"],
  ["ADR-0003-frontend.md", "Server Component"],
  ["ADR-0004-authentication.md", "Supabase Auth"],
  ["ADR-0005-event-driven.md", "ReservationCreated"],
    ["ADR-0006-media.md", "Supabase\\s+Storage"],
  ["ADR-0007-ui.md", "Design System"],
  ["ADR-0008-documentation.md", "Developer Handbook"],
] as const;

test("les ADR-0002 à ADR-0008 sont indexés et conservent leur décision", () => {
  const base = "docs/03_ARCHITECTURE/decisions";
  const index = readFileSync(`${base}/README.md`, "utf8");
  for (const [filename, decision] of decisions) {
    assert.equal(existsSync(`${base}/${filename}`), true);
    assert.match(readFileSync(`${base}/${filename}`, "utf8"), new RegExp(decision));
    assert.match(index, new RegExp(filename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("les décisions cibles ne sont pas confondues avec leur déploiement", () => {
  const status = readFileSync(
    "docs/03_ARCHITECTURE/decisions/IMPLEMENTATION_STATUS.md",
    "utf8",
  );
  assert.match(status, /ADR-0005 .* outbox commune non implémentée/);
  assert.match(status, /ADR-0006 .* Non conforme actuellement/);
  assert.match(status, /ADR-0007 .* En convergence/);
  assert.match(status, /ne constitue pas\s+une preuve de migration terminée/);
});
