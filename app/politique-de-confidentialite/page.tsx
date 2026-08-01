import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
const path = "/politique-de-confidentialite";
export const metadata = createPageMetadata({
  title: "Politique de confidentialité | Beaux Rivages",
  description: legalDocuments.privacy.description,
  path,
});
export default function Page() {
  return <LegalPage document={legalDocuments.privacy} path={path} />;
}
