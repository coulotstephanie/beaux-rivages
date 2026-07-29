import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  "supabase/migrations/20260730001000_guest_premium_space.sql",
  "utf8",
);

test("le CMS versionne les contenus et protège les brouillons", () => {
  assert.match(migration, /create table public\.carnet_entry_versions/);
  assert.match(migration, /status = 'published'/);
  assert.match(migration, /version_carnet_entry/);
});

test("la recherche éditoriale possède ses index", () => {
  assert.match(migration, /using gin/);
  assert.match(migration, /carnet_entries_tags_idx/);
  assert.match(migration, /carnet_entries_highlights_idx/);
});

test("les favoris sont liés au voyageur et protégés par RLS", () => {
  assert.match(migration, /create table public\.carnet_favorites/);
  assert.match(migration, /traveler manages own carnet favorites/);
  assert.match(migration, /guest\.user_id = auth\.uid\(\)/);
});
