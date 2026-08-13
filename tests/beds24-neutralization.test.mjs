import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";

const root = process.cwd();
const retiredRoutes = [
  "app/api/admin/beds24-rates",
  "app/api/admin/beds24-airbnb-price2",
  "app/api/admin/beds24-permanent-sync",
  "app/api/admin/beds24-properties-audit",
];
const activeRoots = [
  "app",
  "components",
  "features",
  "hooks",
  "lib",
  "platform",
  "services",
  "scripts",
];
const sourceExtension = /\.(?:js|jsx|mjs|cjs|ts|tsx)$/;

function files(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? files(path) : sourceExtension.test(path) ? [path] : [];
  });
}

test("all retired Beds24 routes are absent and therefore resolve through Next.js 404", () => {
  for (const route of retiredRoutes) assert.equal(existsSync(join(root, route)), false, route);
});

test("active application code cannot call or expose Beds24", () => {
  const forbidden = /Beds24|BEDS24_|beds24_rate_sync_queue|beds24\.com|inventory\/rooms\/calendar/i;
  const matches = activeRoots.flatMap((directory) =>
    files(join(root, directory)).flatMap((file) =>
      forbidden.test(readFileSync(file, "utf8")) ? [relative(root, file)] : [],
    ),
  );
  assert.deepEqual(matches, []);
});

test("no cron or build command can trigger Beds24", () => {
  assert.doesNotMatch(readFileSync(join(root, "vercel.json"), "utf8"), /beds24/i);
  const scripts = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).scripts;
  for (const [name, command] of Object.entries(scripts)) {
    if (name === "test") continue;
    assert.doesNotMatch(String(command), /beds24/i, name);
  }
});

test("the active administration contains no Beds24 command", () => {
  for (const file of files(join(root, "components", "admin")))
    assert.doesNotMatch(readFileSync(file, "utf8"), /beds24/i, relative(root, file));
});
