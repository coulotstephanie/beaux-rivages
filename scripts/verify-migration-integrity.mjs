import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";

const root = process.cwd();
const migrationsDirectory = join(root, "supabase", "migrations");
const rollbacksDirectory = join(root, "supabase", "rollbacks");
const migrationPattern = /^(\d{14})_(.+)\.sql$/;
const rollbackPattern = /^(\d{14})_(.+)\.down\.sql$/;

const migrations = (await readdir(migrationsDirectory)).filter((file) =>
  migrationPattern.test(file),
);
const rollbacks = (await readdir(rollbacksDirectory)).filter((file) => rollbackPattern.test(file));

const failures = [];
const versions = new Map();
const rollbackNames = new Set(rollbacks.map((file) => file.replace(/\.down\.sql$/, ".sql")));

for (const file of migrations) {
  const match = file.match(migrationPattern);
  if (!match) continue;
  const [, version] = match;
  const existing = versions.get(version);
  if (existing) failures.push(`Version dupliquée ${version}: ${existing}, ${file}`);
  versions.set(version, file);
  if (!rollbackNames.has(file)) failures.push(`Rollback absent: ${file}`);

  const source = await readFile(join(migrationsDirectory, file), "utf8");
  if (!source.trim()) failures.push(`Migration vide: ${file}`);
}

for (const file of rollbacks) {
  const migrationName = file.replace(/\.down\.sql$/, ".sql");
  if (!migrations.includes(migrationName)) failures.push(`Rollback orphelin: ${file}`);
  const source = await readFile(join(rollbacksDirectory, file), "utf8");
  if (!source.trim()) failures.push(`Rollback vide: ${file}`);
}

const manifest = [];
for (const file of migrations.sort()) {
  const source = await readFile(join(migrationsDirectory, file));
  manifest.push({
    file: basename(file),
    sha256: createHash("sha256").update(source).digest("hex"),
  });
}

console.log(
  JSON.stringify({ migrations: manifest, rollbacks: rollbacks.length, failures }, null, 2),
);
if (failures.length > 0) process.exitCode = 1;
