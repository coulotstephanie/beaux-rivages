import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
const path = "/charte-qualite";
export const metadata = createPageMetadata({
  title: "Charte qualité | Beaux Rivages",
  description: legalDocuments.quality.description,
  path,
});
export default function Page() {
  return <LegalPage document={legalDocuments.quality} path={path} />;
}
