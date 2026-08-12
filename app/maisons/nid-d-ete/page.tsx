import { LocalizedPropertyPage } from "@/components/LocalizedPropertyPage";
import { NidHeritageTeaser } from "@/components/NidHeritageTeaser";
import { getProperty } from "@/data";
import { createPageMetadata, createPropertySeo } from "@/seo";
import { getPublishedProperty } from "@/platform/property-editor/public";
import { getServerLocale, localize, localizeDeep } from "@/i18n/server";

const property = getProperty("nid-d-ete");
export async function generateMetadata() {
  const locale = await getServerLocale();
  const localizedProperty = localizeDeep(locale, property);
  const localizedSeo = localizeDeep(locale, createPropertySeo(localizedProperty));
  return createPageMetadata({
    ...localizedSeo,
    locale,
    image: property.hero,
    openGraphTitle: localize(locale, `${localizedProperty.title} · ${localizedProperty.location}`),
  });
}

export default async function Page() {
  const managedProperty = await getPublishedProperty("nid-d-ete");
  return (
    <LocalizedPropertyPage property={managedProperty}>
      <NidHeritageTeaser />
    </LocalizedPropertyPage>
  );
}
