import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
const path = "/faq-juridique";
export const metadata = createPageMetadata({
  title: "FAQ juridique | Beaux Rivages",
  description: legalDocuments.legalFaq.description,
  path,
});
export default function Page() {
  return <LegalPage document={legalDocuments.legalFaq} path={path} accordion />;
}
