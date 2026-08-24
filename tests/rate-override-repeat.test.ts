import assert from "node:assert/strict";
import test from "node:test";
import { planDailyRateOverrideWrites } from "../features/revenue-management/rate-override-plan";

test("un même tarif quotidien peut être modifié dix fois sans créer de doublon actif", () => {
  const date = "2027-06-12";
  let active = [
    {
      id: "override-1",
      begins_on: date,
      ends_on: date,
      kind: "manual",
      updated_at: "2026-08-03T08:00:00.000Z",
      nightlyRate: 120,
    },
  ];
  const history: number[] = [];

  for (let index = 0; index < 10; index += 1) {
    const nightlyRate = 130 + index;
    const plan = planDailyRateOverrideWrites(active, [{ date, nightlyRate }], "manual");
    assert.equal(plan.updates.length, 1);
    assert.equal(plan.inserts.length, 0);
    assert.deepEqual(plan.disableIds, []);
    active = active.map((row) =>
      row.id === plan.updates[0].id
        ? { ...row, nightlyRate, updated_at: `2026-08-03T08:00:${index + 10}.000Z` }
        : row,
    );
    history.push(nightlyRate);
  }

  assert.equal(active.length, 1);
  assert.equal(active[0].nightlyRate, 139);
  assert.deepEqual(history, [130, 131, 132, 133, 134, 135, 136, 137, 138, 139]);
});

test("les anciens doublons sont neutralisés lors de la modification suivante", () => {
  const date = "2027-06-12";
  const plan = planDailyRateOverrideWrites(
    [
      { id: "old", begins_on: date, ends_on: date, kind: "manual", updated_at: "2026-08-01" },
      { id: "new", begins_on: date, ends_on: date, kind: "manual", updated_at: "2026-08-02" },
    ],
    [{ date, nightlyRate: 145 }],
    "manual",
  );
  assert.equal(plan.updates[0].id, "new");
  assert.deepEqual(plan.disableIds, ["old"]);
});
