import assert from "node:assert/strict";
import test from "node:test";
import { createContractHtml } from "../platform/contracts/html";
import { createContractPdf } from "../platform/contracts/pdf";
import type { StayAccessPayload } from "../platform/traveler/contracts";

const properties = [
  ["chai-des-tortues", "Le Chai des Tortues"],
  ["villa-raie-manta", "Villa Raie Manta"],
  ["nid-d-ete", "Le Nid d’Été"],
] as const;

function fixture(propertySlug: string, propertyName: string, scenario: "solo" | "family" | "pets" | "signature"): StayAccessPayload {
  const family = scenario === "family";
  const pets = scenario === "pets" ? 1 : 0;
  const options = scenario === "signature" ? ["Pack Signature Beaux Rivages", "Linge complet"] : pets ? ["Animal"] : [];
  return {
    reservationId: `test-${propertySlug}-${scenario}`,
    reference: `BR-2026-${scenario.toUpperCase()}`,
    travelerName: family ? "Famille Martin" : "Camille Martin",
    propertySlug,
    propertyName,
    arrival: "2026-10-12",
    departure: "2026-10-19",
    guests: family ? 5 : 1,
    depositPaid: 500,
    balanceRemaining: 1240,
    currency: "EUR",
    options,
    guideSlugs: [],
    documents: [{ id: "contract", title: "Contrat de location", kind: "contract" }],
    expiresAt: "2030-01-01T00:00:00.000Z",
    contractDetails: {
      travelerFirstName: "Camille",
      travelerLastName: "Martin",
      address: "10 rue des Voyageurs, 75000 Paris",
      phone: "+33 6 00 00 00 00",
      email: "camille@example.com",
      adults: family ? 2 : 1,
      children: family ? 2 : 0,
      babies: family ? 1 : 0,
      pets,
      nightsPrice: 1540,
      cleaningFee: 95,
      touristTax: 35,
      optionsTotal: options.length * 50,
      total: 1740,
      issuedOn: "2026-07-27",
      wifiQrValue: "WIFI:T:WPA;S:BeauxRivages-Test;P:mot-de-passe-test;;",
    },
  };
}

for (const [propertySlug, propertyName] of properties) {
  for (const scenario of ["solo", "family", "pets", "signature"] as const) {
    test(`generates premium HTML and PDF for ${propertySlug} / ${scenario}`, async () => {
      const stay = fixture(propertySlug, propertyName, scenario);
      const html = createContractHtml(stay);
      assert.match(html, /<!doctype html>/);
      assert.match(html, new RegExp(propertyName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      assert.match(html, /Conditions de location/);
      assert.match(html, /signature/i);
      const pdf = await createContractPdf(stay);
      assert.equal(Buffer.from(pdf).subarray(0, 4).toString(), "%PDF");
      assert.ok(pdf.byteLength > 75_000, "premium PDF should contain the cover and QR assets");
      assert.ok(pdf.byteLength < 4_000_000, "PDF should remain email-friendly");
    });
  }
}
