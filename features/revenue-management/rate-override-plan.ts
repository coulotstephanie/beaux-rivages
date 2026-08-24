export type ExistingDailyRateOverride = {
  id: string;
  begins_on: string;
  ends_on: string;
  kind: string;
  updated_at?: string | null;
};

export type DailyRateOverrideEntry = {
  date: string;
  nightlyRate: number;
  minimumNights?: number;
};

export function planDailyRateOverrideWrites(
  existing: ExistingDailyRateOverride[],
  entries: DailyRateOverrideEntry[],
  kind: string,
) {
  const byDate = new Map<string, ExistingDailyRateOverride[]>();
  for (const row of existing) {
    if (row.begins_on !== row.ends_on || row.kind !== kind) continue;
    const rows = byDate.get(row.begins_on) ?? [];
    rows.push(row);
    byDate.set(row.begins_on, rows);
  }

  const updates: Array<{ id: string; entry: DailyRateOverrideEntry }> = [];
  const inserts: DailyRateOverrideEntry[] = [];
  const disableIds: string[] = [];
  for (const entry of entries) {
    const rows = (byDate.get(entry.date) ?? []).sort((left, right) =>
      String(right.updated_at ?? "").localeCompare(String(left.updated_at ?? "")),
    );
    if (rows[0]) {
      updates.push({ id: rows[0].id, entry });
      disableIds.push(...rows.slice(1).map((row) => row.id));
    } else inserts.push(entry);
  }
  return { updates, inserts, disableIds };
}
