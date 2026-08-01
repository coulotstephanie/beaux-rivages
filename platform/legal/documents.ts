import "server-only";
import { getDatabaseClient, isDatabaseConfigured } from "@/platform/database/client";
export type LegalDocument = {
  title: string;
  description: string;
  sections: readonly (readonly [string, string])[];
};
const pathKeys: Record<string, string> = {
  "/conditions-generales-de-vente": "cgv",
  "/mentions-legales": "mentions",
  "/politique-de-confidentialite": "privacy",
  "/politique-de-cookies": "cookies",
  "/conditions-generales-utilisation": "cgu",
  "/politique-annulation": "cancellation",
  "/politique-remboursement": "refunds",
  "/charte-qualite": "quality",
  "/engagements-environnement": "environment",
  "/charte-animaux": "animals",
  "/charte-bon-voisinage": "neighborhood",
  "/accessibilite": "accessibility",
  "/faq-juridique": "legalFaq",
};

export async function getPublishedLegalDocument(path: string, fallback: LegalDocument) {
  const documentKey = pathKeys[path];
  if (!documentKey || !isDatabaseConfigured())
    return { document: fallback, version: null, effectiveFrom: null };
  const { data, error } = await getDatabaseClient()
    .from("legal_documents")
    .select("title,description,sections,version,effective_from")
    .eq("document_key", documentKey)
    .eq("published", true)
    .maybeSingle();
  if (error || !data || !Array.isArray(data.sections))
    return { document: fallback, version: null, effectiveFrom: null };
  const sections = data.sections.filter(
    (section): section is [string, string] =>
      Array.isArray(section) &&
      section.length === 2 &&
      section.every((value) => typeof value === "string"),
  );
  if (!sections.length) return { document: fallback, version: null, effectiveFrom: null };
  return {
    document: { title: data.title, description: data.description, sections },
    version: data.version,
    effectiveFrom: data.effective_from,
  };
}
