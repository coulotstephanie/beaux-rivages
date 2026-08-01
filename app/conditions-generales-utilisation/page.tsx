import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
const path = "/conditions-generales-utilisation";
export const metadata = createPageMetadata({
  title: "Conditions Générales d’Utilisation | Beaux Rivages",
  description: legalDocuments.cgu.description,
  path,
});
export default function Page() {
  return <LegalPage document={legalDocuments.cgu} path={path} />;
}
