#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required." >&2
  exit 1
fi
if [[ -z "${BR_BACKUP_DIR:-}" || "${BR_BACKUP_DIR}" == "/" ]]; then
  echo "Set BR_BACKUP_DIR to an explicit backup directory." >&2
  exit 1
fi
if ! command -v pg_dump >/dev/null 2>&1; then
  echo "pg_dump is required." >&2
  exit 1
fi

mkdir -p "${BR_BACKUP_DIR}"
backup_file="${BR_BACKUP_DIR}/beaux-rivages-$(date -u +%Y%m%dT%H%M%SZ).dump"
pg_dump "${DATABASE_URL}" --format=custom --no-owner --no-privileges --file="${backup_file}"
chmod 600 "${backup_file}"
echo "Encrypted off-site storage remains the operator's responsibility."
echo "${backup_file}"
