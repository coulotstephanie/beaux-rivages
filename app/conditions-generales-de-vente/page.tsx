import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
const path = "/conditions-generales-de-vente";
export const metadata = createPageMetadata({
  title: "Conditions Générales de Vente | Beaux Rivages",
  description: legalDocuments.cgv.description,
  path,
});
export default function Page() {
  return <LegalPage document={legalDocuments.cgv} path={path} />;
}
