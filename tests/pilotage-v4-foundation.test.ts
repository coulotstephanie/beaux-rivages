import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getPilotageModule, pilotageModules } from "../platform/admin/module-registry";

const migration = readFileSync(
  new URL("../supabase/migrations/20260810100000_pilotage_v4_cms_foundation.sql", import.meta.url),
  "utf8",
);

test("the V4 registry has unique stable module identifiers", () => {
  const ids = pilotageModules.map((module) => module.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(getPilotageModule("media").domain, "content");
});

test("the V4 CMS foundation covers dynamic content and reversible history", () => {
  for (const table of [
    "cms_pages",
    "cms_blocks",
    "cms_media_assets",
    "cms_galleries",
    "cms_gallery_items",
    "cms_page_versions",
    "site_settings",
    "managed_links",
    "cms_audit_log",
  ]) {
    assert.match(migration, new RegExp(`create table public\\.${table}`));
  }
  assert.match(migration, /cms_capture_page_version/);
  assert.match(migration, /cms_save_page/);
  assert.match(migration, /cms_restore_page/);
  assert.match(migration, /cms-media/);
  assert.match(migration, /enable row level security/g);
  assert.match(migration, /'admin', 'editor'/);
});

test("public CMS reads expose published content only", () => {
  assert.match(migration, /status = 'published'/);
  assert.match(migration, /public settings are readable/);
  assert.doesNotMatch(migration, /for all\s+using \(true\)/i);
});
