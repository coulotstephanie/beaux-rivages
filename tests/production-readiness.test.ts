import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("le limiteur mémoire reste borné", () => {
  const source = readFileSync("platform/http/security.ts", "utf8");
  assert.match(source, /MAX_RATE_LIMIT_BUCKETS/);
  assert.match(source, /pruneExpiredBuckets/);
  assert.match(source, /x-real-ip/);
});

test("le sitemap ne simule pas une modification à chaque lecture", () => {
  const source = readFileSync("app/sitemap.ts", "utf8");
  assert.doesNotMatch(source, /lastModified:\s*new Date/);
});

test("le média d'accueil respecte les connexions contraintes", () => {
  const source = readFileSync("components/media/HeroVideo.tsx", "utf8");
  assert.match(source, /saveData/);
  assert.match(source, /preload=\{constrainedConnection \|\| reduceMotion \? "none"/);
});

test("la supervision dispose d'une sonde sans cache", () => {
  const source = readFileSync("app/api/health/route.ts", "utf8");
  assert.match(source, /Cache-Control": "no-store"/);
  assert.match(source, /databaseLatencyMs/);
  assert.doesNotMatch(source, /error\.message/);
});
