import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { demoGuestMessageData } from "../platform/guest-messaging/demo";
import { guestComposition, optionLabels, renderGuestMessage } from "../platform/guest-messaging/templates";
import { validateMessageSchedule } from "../platform/guest-messaging/scheduler";
import type { ArrivalSecrets, GuestMessageData, PropertyId } from "../platform/guest-messaging/contracts";

const propertyIds: PropertyId[] = ["chai-des-tortues", "villa-raie-manta", "nid-d-ete"];
const secrets: ArrivalSecrets = {
  keyBoxCode: "TEST-KEY-ONLY",
  pedestrianGateCode: "TEST-GATE-ONLY",
  wifiName: "TEST-NETWORK-ONLY",
  wifiPassword: "TEST-PASSWORD-ONLY",
};

for (const propertyId of propertyIds) {
  test(`renders booking and arrival HTML/text for ${propertyId}`, () => {
    const data = demoGuestMessageData(propertyId);
    const booking = renderGuestMessage(data, "booking_confirmation");
    const arrival = renderGuestMessage(data, "arrival", secrets);
    for (const message of [booking, arrival]) {
      assert.match(message.html, /<meta name="viewport"/);
      assert.match(message.html, /Une maison Beaux Rivages/);
      assert.match(message.html, /Stéphanie et Bruno/);
      assert.ok(message.text.length > 500);
    }
    assert.doesNotMatch(booking.html + booking.text, /TEST-(KEY|GATE|NETWORK|PASSWORD)-ONLY/);
    assert.match(arrival.text, /TEST-KEY-ONLY/);
  });
}

for (const level of ["essentiel", "confort", "signature"] as const) {
  test(`renders ${level} formula copy`, () => {
    const data = { ...demoGuestMessageData("chai-des-tortues"), experienceLevel: level };
    const message = renderGuestMessage(data, "booking_confirmation");
    assert.match(message.text, new RegExp(level === "signature" ? "Signature Beaux Rivages" : level[0].toUpperCase() + level.slice(1), "i"));
  });
}

test("formats families naturally without empty counters", () => {
  const data: GuestMessageData = { ...demoGuestMessageData("villa-raie-manta"), adults: 4, children: 1, childrenAges: [8], babies: 1, pets: 0 };
  assert.equal(guestComposition(data), "4 adultes, 1 enfant (8 ans) et 1 bébé");
  const couple = { ...data, adults: 2, children: 0, childrenAges: [], babies: 0, pets: 1 };
  assert.equal(guestComposition(couple), "2 adultes et leur chien");
  const message = renderGuestMessage(couple, "booking_confirmation");
  assert.doesNotMatch(message.text, /0 enfant|0 bébé|0 animal|Aucune option/i);
});

test("renders linen and only selected options", () => {
  const data = demoGuestMessageData("nid-d-ete");
  assert.deepEqual(optionLabels(data).slice(0, 2), ["Forfait linge pour 4 personnes", "Serviettes de plage"]);
  const empty = { ...data, selectedOptions: {} };
  const message = renderGuestMessage(empty, "booking_confirmation");
  assert.doesNotMatch(message.text, /VOS ATTENTIONS RÉSERVÉES/);
});

test("formats French dates and number of nights", () => {
  const message = renderGuestMessage(demoGuestMessageData("chai-des-tortues"), "booking_confirmation");
  assert.match(message.text, /15 août 2026/);
  assert.match(message.text, /7 nuits/);
});

test("keeps La Maison Heureuse as the residence and Le Nid d’Été as the lodging", () => {
  const message = renderGuestMessage(demoGuestMessageData("nid-d-ete"), "arrival", secrets);
  assert.match(message.text, /Le Nid d’Été\nLa Maison Heureuse — Appartement D12/);
  assert.match(message.text, /La Maison Heureuse est une résidence calme/);
});

test("rejects cancelled reservations and missing arrival secrets", () => {
  const data = demoGuestMessageData("chai-des-tortues");
  assert.throws(() => validateMessageSchedule({ data, type: "arrival", scheduledDate: "2026-08-14T16:00:00+02:00", reservationStatus: "cancelled", paymentValidated: true, accessSecretsAvailable: true }), /RESERVATION_INACTIVE/);
  assert.throws(() => validateMessageSchedule({ data, type: "arrival", scheduledDate: "2026-08-14T16:00:00+02:00", reservationStatus: "confirmed", paymentValidated: true, accessSecretsAvailable: false }), /ARRIVAL_SECRETS_REQUIRED/);
});

test("builds a stable idempotency key to prevent double sends", () => {
  const input = { data: demoGuestMessageData("villa-raie-manta"), type: "arrival" as const, scheduledDate: "2026-08-14T16:00:00+02:00", reservationStatus: "confirmed" as const, paymentValidated: true, accessSecretsAvailable: true };
  assert.equal(validateMessageSchedule(input).idempotencyKey, validateMessageSchedule(input).idempotencyKey);
});

test("repository contains no literal access credentials", () => {
  const paths = [
    "platform/guest-messaging/templates.ts",
    "components/admin/GuestMessagesAdmin.tsx",
    "app/api/admin/guest-messages/preview/route.ts",
  ];
  const source = paths.map((path) => readFileSync(path, "utf8")).join("\n");
  assert.doesNotMatch(source, /secure(KeyBoxCode|WifiName|WifiPassword|PedestrianGateCode)\s*[:=]\s*["'][^[]/);
});

for (const propertyId of propertyIds) {
  test(`renders premium departure preview for ${propertyId}`, () => {
    const data = demoGuestMessageData(propertyId);
    const message = renderGuestMessage(data, "departure");
    assert.equal(message.subject, "À bientôt… et merci pour votre séjour 🌊");
    assert.match(message.html, /<meta name="viewport"/);
    assert.match(message.text, /avant 10 h/);
    assert.match(message.text, /Forfait linge/);
    assert.match(message.text, /Votre avis compte énormément/);
    assert.match(message.text, /Stéphanie & Bruno/);
    assert.doesNotMatch(message.text + message.html, /TEST-(KEY|GATE|NETWORK|PASSWORD)-ONLY/);
    if (propertyId === "villa-raie-manta") assert.match(message.text, /🔥 Barbecue/);
    else assert.doesNotMatch(message.text, /🔥 Barbecue/);
  });
}

test("departure conditionals only render when applicable", () => {
  const base = demoGuestMessageData("chai-des-tortues");
  const empty = renderGuestMessage({ ...base, pets: 0, selectedOptions: {} }, "departure");
  assert.doesNotMatch(empty.text, /Forfait linge|compagnon à quatre pattes|accueillir personnellement/);
  const complete = renderGuestMessage({ ...base, pets: 1, selectedOptions: { linenPackage: true, personalizedArrival: true } }, "departure");
  assert.match(complete.text, /Forfait linge/);
  assert.match(complete.text, /compagnon à quatre pattes/);
  assert.match(complete.text, /accueillir personnellement/);
});

test("departure scheduling defaults to the eve and rejects same-day scheduling", () => {
  const data = demoGuestMessageData("nid-d-ete");
  assert.match(renderGuestMessage(data, "departure").idempotencyKey, /:departure:fr:2026-08-21$/);
  assert.throws(() => validateMessageSchedule({ data, type: "departure", scheduledDate: data.departureDate, reservationStatus: "confirmed", paymentValidated: true, accessSecretsAvailable: true }), /DEPARTURE_MESSAGE_TOO_LATE/);
});
