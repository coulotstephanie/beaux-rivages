import { NextRequest } from "next/server";
import { createContractHtml } from "@/platform/contracts/html";
import { createContractPdf } from "@/platform/contracts/pdf";
import { rateLimit } from "@/platform/http/security";
import { verifyStayAccessToken } from "@/platform/traveler/access";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 10);
  if (limited) return limited;
  const token = request.nextUrl.searchParams.get("token");
  const documentId = request.nextUrl.searchParams.get("document");
  const format = request.nextUrl.searchParams.get("format");
  if (!token || !documentId) return new Response("Accès requis", { status: 401 });
  try {
    const stay = verifyStayAccessToken(token);
    if (!stay.documents.some((document) => document.id === documentId)) return new Response("Document indisponible", { status: 404 });
    if (format === "html") return new Response(createContractHtml(stay), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store" } });
    const bytes = await createContractPdf(stay);
    const familyName = (stay.contractDetails?.travelerLastName ?? stay.travelerName).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").toUpperCase();
    const year = new Date(stay.contractDetails?.issuedOn ?? Date.now()).getFullYear();
    return new Response(Buffer.from(bytes), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="Reservation-BEAUX-RIVAGES-${year}-${familyName}.pdf"`, "Cache-Control": "private, no-store" } });
  } catch {
    return new Response("Lien invalide ou expiré", { status: 401 });
  }
}
