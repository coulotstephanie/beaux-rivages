import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import QRCode from "qrcode";
import type { StayAccessPayload } from "@/platform/traveler/contracts";
import { commitments, rentalClauses } from "./clauses";

const pageSize: [number, number] = [595.28, 841.89];
const colors = { deep: rgb(.04, .15, .19), gold: rgb(.71, .58, .39), shell: rgb(.98, .97, .94), muted: rgb(.32, .4, .42), white: rgb(1, 1, 1) };
const propertyInformation: Record<string, { address: string; registration?: string; image: string; map: string }> = {
  "chai-des-tortues": { address: "165 rue de la Fontaine, 17940 Rivedoux-Plage", image: "public/images/properties/chai-des-tortues/living-room/salon-charpente.jpeg", map: "https://www.google.com/maps/search/?api=1&query=165+rue+de+la+Fontaine+Rivedoux-Plage" },
  "villa-raie-manta": { address: "Rivedoux-Plage, Île de Ré — adresse complète à valider", registration: "17297000225A1", image: "public/images/properties/villa-raie-manta/salon-lumiere.jpeg", map: "https://www.google.com/maps/search/?api=1&query=Rivedoux-Plage" },
  "nid-d-ete": { address: "355 route des Saumonards, 17190 Saint-Georges-d’Oléron", image: "public/images/properties/nid-d-ete/peupliers.jpeg", map: "https://www.google.com/maps/search/?api=1&query=355+route+des+Saumonards+Saint-Georges-d%27Oléron" },
};

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > width && line) {
      lines.push(line);
      line = word;
    } else line = candidate;
  }
  if (line) lines.push(line);
  return lines;
}
function paragraph(page: PDFPage, text: string, x: number, y: number, font: PDFFont, size = 10, width = 490, color = colors.muted) {
  const lines = wrap(text, font, size, width);
  lines.forEach((line, index) => page.drawText(line, { x, y: y - index * (size + 4), size, font, color }));
  return y - lines.length * (size + 4);
}
function basePage(pdf: PDFDocument, label: string, pageNumber: number, serif: PDFFont, sans: PDFFont) {
  const page = pdf.addPage(pageSize);
  page.drawRectangle({ x: 0, y: 0, width: pageSize[0], height: pageSize[1], color: colors.shell });
  page.drawText("BEAUX RIVAGES", { x: 42, y: 800, size: 13, font: serif, color: colors.deep });
  page.drawText(label.toUpperCase(), { x: 42, y: 780, size: 7, font: sans, color: colors.gold });
  page.drawText(String(pageNumber).padStart(2, "0"), { x: 525, y: 32, size: 8, font: sans, color: colors.muted });
  return page;
}

export async function createContractPdf(stay: StayAccessPayload) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Contrat ${stay.reference} — ${stay.propertyName}`);
  pdf.setAuthor("Beaux Rivages — Stéphanie Coulot");
  pdf.setSubject("Contrat de location saisonnière");
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const property = propertyInformation[stay.propertySlug] ?? propertyInformation["chai-des-tortues"];

  const cover = pdf.addPage(pageSize);
  cover.drawRectangle({ x: 0, y: 0, width: pageSize[0], height: pageSize[1], color: colors.deep });
  try {
    const image = await pdf.embedJpg(await readFile(join(process.cwd(), property.image)));
    cover.drawImage(image, { x: 0, y: 330, width: pageSize[0], height: 512 });
    cover.drawRectangle({ x: 0, y: 330, width: pageSize[0], height: 512, color: colors.deep, opacity: .28 });
  } catch { /* La couverture reste lisible même si l’image est indisponible. */ }
  cover.drawText("BEAUX RIVAGES", { x: 42, y: 790, size: 18, font: serifBold, color: colors.white });
  cover.drawText("CONTRAT DE LOCATION SAISONNIERE", { x: 42, y: 765, size: 8, font: sans, color: colors.gold });
  cover.drawText(stay.propertyName, { x: 42, y: 258, size: 35, font: serif, color: colors.white });
  cover.drawText(property.address, { x: 42, y: 230, size: 10, font: sans, color: colors.white });
  cover.drawText(`${stay.arrival}  —  ${stay.departure}`, { x: 42, y: 185, size: 16, font: serif, color: colors.white });
  cover.drawText(`${stay.travelerName} · ${stay.guests} voyageur(s)`, { x: 42, y: 158, size: 11, font: sans, color: colors.white });
  cover.drawText(`Reservation ${stay.reference} · Emise le ${stay.contractDetails?.issuedOn ?? new Date().toISOString().slice(0, 10)}`, { x: 42, y: 72, size: 8, font: sans, color: colors.gold });

  const booking = basePage(pdf, "Réservation", 2, serifBold, sans);
  booking.drawText("Les parties et le sejour", { x: 42, y: 730, size: 28, font: serif, color: colors.deep });
  const detail = stay.contractDetails;
  let y = 680;
  const facts = detail ? [
    ["Voyageur", `${detail.travelerFirstName} ${detail.travelerLastName}`], ["Adresse", detail.address], ["Téléphone", detail.phone], ["Email", detail.email],
    ["Composition", `${detail.adults} adulte(s), ${detail.children} enfant(s), ${detail.babies} bébé(s), ${detail.pets} animal(aux)`],
    ["Séjour", `${stay.arrival} au ${stay.departure}`], ["Options", stay.options.join(", ") || "Aucune"],
  ] : [["Voyageur", stay.travelerName], ["Séjour", `${stay.arrival} au ${stay.departure}`], ["Attention", "Coordonnées et décompte à compléter avant signature"]];
  for (const [label, value] of facts) {
    booking.drawText(label.toUpperCase(), { x: 42, y, size: 7, font: sans, color: colors.gold });
    y = paragraph(booking, value, 155, y, sans, 10, 395, colors.deep) - 10;
    booking.drawLine({ start: { x: 42, y }, end: { x: 553, y }, thickness: .4, color: rgb(.82, .8, .75) });
    y -= 20;
  }
  if (detail) {
    y -= 10;
    booking.drawText("Decompte financier", { x: 42, y, size: 20, font: serif, color: colors.deep }); y -= 32;
    const financial = [["Nuits", detail.nightsPrice], ["Ménage", detail.cleaningFee], ["Taxe de séjour", detail.touristTax], ["Options", detail.optionsTotal], ["Total", detail.total], ["Acompte", stay.depositPaid], ["Solde restant", stay.balanceRemaining]];
    financial.forEach(([label, amount]) => { booking.drawText(String(label), { x: 42, y, size: 10, font: sans, color: colors.muted }); booking.drawText(`${amount} EUR`, { x: 475, y, size: 10, font: sans, color: colors.deep }); y -= 22; });
  }

  const conditions = basePage(pdf, "Conditions de location", 3, serifBold, sans);
  conditions.drawText("Conditions de location", { x: 42, y: 730, size: 28, font: serif, color: colors.deep });
  y = 690;
  rentalClauses.forEach((clause, index) => {
    conditions.drawText(`${String(index + 1).padStart(2, "0")}  ${clause.title}`, { x: 42, y, size: 11, font: serifBold, color: colors.deep });
    y = paragraph(conditions, clause.text, 42, y - 18, sans, 8.2, 510) - 8;
  });

  const promise = basePage(pdf, "Engagements et contacts", 4, serifBold, sans);
  promise.drawText("Les engagements Beaux Rivages", { x: 42, y: 730, size: 28, font: serif, color: colors.deep });
  y = 680;
  commitments.forEach((item) => { promise.drawText("-", { x: 42, y, size: 9, font: sans, color: colors.gold }); y = paragraph(promise, item, 62, y, sans, 10, 470, colors.deep) - 12; });
  promise.drawText("Vos hotes", { x: 42, y: 410, size: 22, font: serif, color: colors.deep });
  paragraph(promise, "Stéphanie Coulot · +33 6 17 26 00 94 · coulotstephanie@gmail.com", 42, 380, sans, 10, 490);
  promise.drawText("Contacts utiles", { x: 42, y: 320, size: 18, font: serif, color: colors.deep });
  paragraph(promise, "Urgence européenne : 112 · SAMU : 15 · Pompiers : 18. Les médecins et pharmacies de garde doivent être vérifiés localement au moment du besoin.", 42, 290, sans, 9, 490);

  const annexes = basePage(pdf, "Annexes et signatures", 5, serifBold, sans);
  annexes.drawText("Annexes et signatures", { x: 42, y: 730, size: 28, font: serif, color: colors.deep });
  const annexItems = ["Inventaire", "État des lieux", "Plan du logement", "Consignes d’arrivée", "Consignes de départ", "Règlement intérieur"];
  annexItems.forEach((item, index) => annexes.drawText(`[ ]  ${item}`, { x: 42 + (index % 2) * 250, y: 680 - Math.floor(index / 2) * 30, size: 10, font: sans, color: colors.deep }));
  annexes.drawText("Le locataire", { x: 42, y: 500, size: 14, font: serifBold, color: colors.deep });
  annexes.drawText("Le propriétaire", { x: 320, y: 500, size: 14, font: serifBold, color: colors.deep });
  annexes.drawLine({ start: { x: 42, y: 360 }, end: { x: 250, y: 360 }, thickness: .6, color: colors.muted });
  annexes.drawLine({ start: { x: 320, y: 360 }, end: { x: 553, y: 360 }, thickness: .6, color: colors.muted });
  annexes.drawText("Nom, date et signature", { x: 42, y: 340, size: 8, font: sans, color: colors.muted });
  annexes.drawText("Stéphanie Coulot, date et signature", { x: 320, y: 340, size: 8, font: sans, color: colors.muted });
  paragraph(annexes, "Signature électronique préparée pour Yousign, DocuSign ou un prestataire équivalent. Le présent modèle doit être complété avec les identifiants réglementaires et validé juridiquement avant signature.", 42, 280, sans, 8.5, 510);

  const qrPage = basePage(pdf, "Accès numériques", 6, serifBold, sans);
  qrPage.drawText("Vos reperes numeriques", { x: 42, y: 730, size: 28, font: serif, color: colors.deep });
  const qrValues = [
    ["Guide numérique", "https://www.beaux-rivages.com/carnet"],
    ["Carnet Beaux Rivages", "https://www.beaux-rivages.com/carnet"],
    ["Position Google Maps", property.map],
    ["Livret d’accueil", "https://www.beaux-rivages.com/carnet-voyageur"],
    ...(detail?.wifiQrValue ? [["Wi-Fi", detail.wifiQrValue]] : []),
  ];
  for (let index = 0; index < qrValues.length; index += 1) {
    const [label, value] = qrValues[index];
    const png = await QRCode.toBuffer(value, { type: "png", width: 240, margin: 1, errorCorrectionLevel: "M" });
    const image = await pdf.embedPng(png);
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 70 + column * 260;
    const qrY = 560 - row * 210;
    qrPage.drawImage(image, { x, y: qrY, width: 120, height: 120 });
    qrPage.drawText(label, { x, y: qrY - 22, size: 10, font: serifBold, color: colors.deep });
  }
  return pdf.save({ useObjectStreams: true });
}
