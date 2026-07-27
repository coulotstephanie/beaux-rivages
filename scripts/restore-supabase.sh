#!/usr/bin/env bash
set -euo pipefail

expected_project="ydqtqfkzmovjdkmldhqr"
restore_file="${1:-}"

if [[ "${BR_RESTORE_CONFIRM:-}" != "${expected_project}" ]]; then
  echo "Set BR_RESTORE_CONFIRM=${expected_project} after verifying the target." >&2
  exit 1
fi
if [[ -z "${DATABASE_URL:-}" || ! -f "${restore_file}" ]]; then
  echo "DATABASE_URL and an existing dump file are required." >&2
  exit 1
fi
if ! command -v pg_restore >/dev/null 2>&1; then
  echo "pg_restore is required." >&2
  exit 1
fi

pg_restore --dbname="${DATABASE_URL}" --clean --if-exists --no-owner --no-privileges "${restore_file}"
