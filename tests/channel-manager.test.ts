import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { channelActionSchema } from "../platform/channel-manager/schemas";
import { channelConnector } from "../platform/channel-manager/connectors";

test("le registre expose les connecteurs actuels et futurs", () => {
  assert.equal(channelConnector("airbnb").provider, "airbnb");
  assert.equal(channelConnector("hometogo").provider, "hometogo");
});
test("les commandes sensibles sont strictement validées", () => {
  assert.equal(channelActionSchema.safeParse({ action:"retry_job",jobId:"53ef6a99-9a31-4557-bd7b-64de7beb7620" }).success,true);
  assert.equal(channelActionSchema.safeParse({ action:"retry_job",jobId:"bad",admin:true }).success,false);
});
test("la migration rend les jobs rejouables et les conflits traçables", () => {
  const sql=readFileSync("supabase/migrations/20260729133000_channel_manager_premium.sql","utf8");
  assert.match(sql,/idempotency_key text not null unique/);
  assert.match(sql,/rollback_of uuid references/);
  assert.match(sql,/channel_conflicts_range_idx/);
  assert.match(sql,/enable row level security/g);
});
test("l’API protège toutes les mutations", () => {
  const route=readFileSync("app/api/admin/channel-manager/route.ts","utf8");
  assert.match(route,/authorizeStaff/); assert.match(route,/\["admin"\]/); assert.match(route,/requireSameOrigin/); assert.match(route,/channelActionSchema/);
});
