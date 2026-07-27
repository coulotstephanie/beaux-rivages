import { PropertyPage } from "@/components/PropertyPage";
import { getProperty } from "@/data";
import { createPageMetadata, createPropertySeo } from "@/seo";

const property = getProperty("nid-d-ete");
const pageSeo = createPropertySeo(property);

export const metadata = createPageMetadata({
  ...pageSeo,
  image: property.hero,
  openGraphTitle: `${property.title} · ${property.location}`,
});

export default function Page() {
  return <PropertyPage property={property} />;
}
