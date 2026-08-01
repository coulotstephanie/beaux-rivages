import { LegalPage } from "@/components/LegalPage";
import { legalDocuments } from "@/content/legal";
import { createPageMetadata } from "@/seo";
const path = "/politique-de-cookies";
export const metadata = createPageMetadata({
  title: "Politique de cookies | Beaux Rivages",
  description: legalDocuments.cookies.description,
  path,
});
export default function Page() {
  return <LegalPage document={legalDocuments.cookies} path={path} />;
}
