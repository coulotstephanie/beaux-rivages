import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { z } from "zod";
import { buildConciergePlan, durationLabels, interestLabels, profileLabels } from "@/conciergeEngine";

export const runtime = "nodejs";

const schema = z.object({
  profile: z.enum(["couple", "famille", "amis", "bebe", "chien"]),
  interests: z.array(z.enum(["plage", "gastronomie", "velo", "nature", "patrimoine", "nautique", "detente"])).max(7),
  duration: z.enum(["court", "semaine", "long"]),
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Préférences invalides." }, { status: 400 });
  const { profile, interests, duration } = parsed.data;
  const plan = buildConciergePlan(profile, interests, duration);
  const pdf = await PDFDocument.create();
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  let page = pdf.addPage([595, 842]);
  let y = 770;
  const drawHeader = () => {
    page.drawText("BEAUX RIVAGES", { x: 48, y: 802, size: 10, font: sans, color: rgb(.12, .25, .27) });
    page.drawLine({ start: { x: 48, y: 790 }, end: { x: 547, y: 790 }, thickness: 1, color: rgb(.73, .63, .43) });
  };
  drawHeader();
  page.drawText("Votre séjour Beaux Rivages", { x: 48, y, size: 29, font: serifBold, color: rgb(.08, .18, .2) }); y -= 38;
  page.drawText(`${profileLabels[profile]}  ·  ${durationLabels[duration]}`, { x: 48, y, size: 13, font: sans, color: rgb(.35, .4, .4) }); y -= 24;
  page.drawText(interests.map((item) => interestLabels[item]).join("  ·  ") || "Toutes les envies", { x: 48, y, size: 10, font: sans, color: rgb(.35, .4, .4), maxWidth: 450 }); y -= 44;
  for (const [index, item] of plan.entries()) {
    if (y < 125) { page = pdf.addPage([595, 842]); drawHeader(); y = 755; }
    page.drawText(`${String(index + 1).padStart(2, "0")}  ${item.title}`, { x: 48, y, size: 16, font: serifBold, color: rgb(.08, .18, .2), maxWidth: 490 }); y -= 22;
    page.drawText(item.description, { x: 48, y, size: 10, font: sans, color: rgb(.25, .3, .3), maxWidth: 490, lineHeight: 14 }); y -= 42;
  }
  const qr = await QRCode.toBuffer("https://www.beaux-rivages.com/conciergerie", { width: 220, margin: 1 });
  const qrImage = await pdf.embedPng(qr);
  page.drawImage(qrImage, { x: 48, y: 35, width: 62, height: 62 });
  page.drawText("Votre carnet reste vivant", { x: 124, y: 72, size: 12, font: serif, color: rgb(.08, .18, .2) });
  page.drawText("Scannez pour actualiser les conseils selon la météo et la saison.", { x: 124, y: 53, size: 9, font: sans, color: rgb(.35, .4, .4) });
  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="votre-sejour-beaux-rivages.pdf"', "Cache-Control": "no-store" },
  });
}
