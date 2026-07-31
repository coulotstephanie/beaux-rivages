import assert from "node:assert/strict";
import test from "node:test";
import { ConfigurableEmailProvider } from "../platform/email/contracts";
import { ownerRequestEmail, travelerRequestEmail } from "../platform/email/reservation-request";

test("Resend receives a restricted, idempotent transactional request", async () => {
  process.env.EMAIL_PROVIDER = "resend";
  process.env.EMAIL_PROVIDER_API_KEY = "re_test_key";
  process.env.EMAIL_FROM = "Beaux Rivages <reservations@beaux-rivages.com>";
  let captured: { url: string; init?: RequestInit } | undefined;
  const request = (async (url: string | URL | Request, init?: RequestInit) => {
    captured = { url: String(url), init };
    return new Response(JSON.stringify({ id: "email_test_123" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;

  const result = await new ConfigurableEmailProvider(request).send({
    to: "traveler@example.com",
    subject: "Votre demande",
    html: "<p>Bonjour</p>",
    idempotencyKey: "reservation-123-traveler",
  });

  assert.deepEqual(result, { messageId: "email_test_123", status: "queued" });
  assert.equal(captured?.url, "https://api.resend.com/emails");
  const headers = captured?.init?.headers as Record<string, string>;
  assert.equal(headers.Authorization, "Bearer re_test_key");
  assert.equal(headers["Idempotency-Key"], "reservation-123-traveler");
  assert.deepEqual(JSON.parse(String(captured?.init?.body)), {
    from: "Beaux Rivages <reservations@beaux-rivages.com>",
    to: ["traveler@example.com"],
    subject: "Votre demande",
    html: "<p>Bonjour</p>",
  });
});

test("reservation emails escape traveler-controlled content", () => {
  const input = {
    reference: "BR-TEST-001",
    propertySlug: "villa-raie-manta",
    arrival: "2026-09-10",
    departure: "2026-09-13",
    total: 990,
    guest: {
      firstName: "<script>alert(1)</script>",
      lastName: "Martin",
      email: "camille@example.com",
      phone: "+33600000000",
    },
  };
  const traveler = travelerRequestEmail(input);
  const owner = ownerRequestEmail(input);
  assert.doesNotMatch(traveler.html, /<script>/);
  assert.match(traveler.html, /&lt;script&gt;/);
  assert.match(owner.subject, /Villa Raie Manta/);
  assert.match(owner.html, /camille@example.com/);
});
