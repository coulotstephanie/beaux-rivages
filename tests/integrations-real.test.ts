import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getIntegrationStatuses } from "../platform/integrations/status";

test("les cinq intégrations exposent un état sans révéler de secret", () => {
  const statuses = getIntegrationStatuses();
  assert.deepEqual(statuses.map((item) => item.id), ["stripe", "email", "sms", "ical", "google-calendar"]);
  for (const status of statuses) assert.deepEqual(Object.keys(status).sort(), ["configured", "id", "label", "missing", "mode"]);
});

test("les connecteurs refusent explicitement les configurations incomplètes", () => {
  assert.match(readFileSync("platform/email/resend.ts", "utf8"), /if \(!apiKey \|\| !from\) throw/);
  assert.match(readFileSync("platform/sms/twilio.ts", "utf8"), /if \(!accountSid \|\| !authToken \|\| !messagingServiceSid\) throw/);
  assert.match(readFileSync("platform/calendar/google.ts", "utf8"), /if \(!input\.accessToken\) throw/);
});

test("email, SMS et Google Calendar appliquent les garde-fous réseau", () => {
  const email = readFileSync("platform/email/resend.ts", "utf8");
  const sms = readFileSync("platform/sms/twilio.ts", "utf8");
  const google = readFileSync("platform/calendar/google.ts", "utf8");
  assert.match(email, /idempotency-key/);
  assert.match(sms, /idempotency-key/);
  for (const source of [email, sms, google]) assert.match(source, /AbortSignal\.timeout\(8_000\)/);
  assert.match(sms, /E\.164/);
  assert.match(google, /encodeURIComponent/);
});

test("l’API de configuration exige une authentification administrateur", () => {
  const route = readFileSync("app/api/admin/integrations/route.ts", "utf8");
  assert.match(route, /requireAdmin\(request\)/);
  assert.match(route, /rateLimit\(request/);
  assert.match(route, /noStoreJson/);
});
