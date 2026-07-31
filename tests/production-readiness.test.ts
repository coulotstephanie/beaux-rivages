import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { configuredStripeMode } from "../platform/payments/stripe";

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

test("le média d'accueil respecte les connexions contraintes et reste lisible sur Safari", () => {
  const source = readFileSync("components/media/HeroVideo.tsx", "utf8");
  assert.match(source, /saveData/);
  assert.match(source, /preload="metadata"/);
  assert.match(source, /video\.load\(\)/);
  assert.ok(source.indexOf('type="video/mp4"') < source.indexOf('type="video/webm"'));
});

test("la supervision dispose d'une sonde sans cache", () => {
  const source = readFileSync("app/api/health/route.ts", "utf8");
  assert.match(source, /Cache-Control": "no-store"/);
  assert.match(source, /databaseLatencyMs/);
  assert.doesNotMatch(source, /error\.message/);
});

test("Stripe reste fermé par défaut et distingue test et production", () => {
  const previous = {
    key: process.env.STRIPE_SECRET_KEY,
    webhook: process.env.STRIPE_WEBHOOK_SECRET,
    allowLive: process.env.STRIPE_ALLOW_LIVE,
  };
  try {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    assert.equal(configuredStripeMode(), null);

    process.env.STRIPE_SECRET_KEY = "sk_test_example";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_example";
    assert.equal(configuredStripeMode(), "test");

    process.env.STRIPE_SECRET_KEY = "sk_live_example";
    process.env.STRIPE_ALLOW_LIVE = "false";
    assert.equal(configuredStripeMode(), null);
    process.env.STRIPE_ALLOW_LIVE = "true";
    assert.equal(configuredStripeMode(), "live");
  } finally {
    if (previous.key === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = previous.key;
    if (previous.webhook === undefined) delete process.env.STRIPE_WEBHOOK_SECRET;
    else process.env.STRIPE_WEBHOOK_SECRET = previous.webhook;
    if (previous.allowLive === undefined) delete process.env.STRIPE_ALLOW_LIVE;
    else process.env.STRIPE_ALLOW_LIVE = previous.allowLive;
  }
});
