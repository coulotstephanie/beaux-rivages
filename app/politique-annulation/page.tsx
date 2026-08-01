import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
const path = "/politique-annulation";
export const metadata = createPageMetadata({
  title: "Politique d’annulation | Beaux Rivages",
  description: legalDocuments.cancellation.description,
  path,
});
export default function Page() {
  return <LegalPage document={legalDocuments.cancellation} path={path} />;
}
