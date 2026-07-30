import type { Metadata } from "next";
import { InternalCms } from "@/features/back-office";

export const metadata: Metadata = {
  title: "CMS et Carnet | Beaux Rivages",
  robots: { index: false, follow: false },
};

export default function CmsPage() {
  return <InternalCms />;
}
