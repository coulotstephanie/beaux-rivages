import { writeFile } from "node:fs/promises";
import { createContractPdf } from "../platform/contracts/pdf";
import type { StayAccessPayload } from "../platform/traveler/contracts";

const output = process.argv[2];
if (!output) throw new Error("Usage: tsx scripts/generate-contract-preview.ts <output.pdf>");
const stay: StayAccessPayload = {
  reservationId: "preview",
  reference: "BR-2026-PREVIEW",
  travelerName: "Camille Martin",
  propertySlug: "chai-des-tortues",
  propertyName: "Le Chai des Tortues",
  arrival: "2026-10-12",
  departure: "2026-10-19",
  guests: 4,
  depositPaid: 500,
  balanceRemaining: 1240,
  currency: "EUR",
  options: ["Pack Signature Beaux Rivages", "Linge complet"],
  guideSlugs: [],
  documents: [{ id: "contract", title: "Contrat de location", kind: "contract" }],
  expiresAt: "2030-01-01T00:00:00.000Z",
  contractDetails: {
    travelerFirstName: "Camille",
    travelerLastName: "Martin",
    address: "10 rue des Voyageurs, 75000 Paris",
    phone: "+33 6 00 00 00 00",
    email: "camille@example.com",
    adults: 2,
    children: 2,
    babies: 0,
    pets: 0,
    nightsPrice: 1540,
    cleaningFee: 95,
    touristTax: 35,
    optionsTotal: 170,
    total: 1840,
    issuedOn: "2026-07-27",
    wifiQrValue: "WIFI:T:WPA;S:BeauxRivages-Demo;P:demonstration;;",
  },
};
async function main() {
  await writeFile(output, await createContractPdf(stay));
}
void main();
