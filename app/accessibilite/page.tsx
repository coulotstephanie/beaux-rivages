import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
const path = "/accessibilite";
export const metadata = createPageMetadata({
  title: "Accessibilité | Beaux Rivages",
  description: legalDocuments.accessibility.description,
  path,
});
export default function Page() {
  return <LegalPage document={legalDocuments.accessibility} path={path} />;
}
