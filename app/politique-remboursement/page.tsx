import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
const path = "/politique-remboursement";
export const metadata = createPageMetadata({
  title: "Politique de remboursement | Beaux Rivages",
  description: legalDocuments.refunds.description,
  path,
});
export default function Page() {
  return <LegalPage document={legalDocuments.refunds} path={path} />;
}
