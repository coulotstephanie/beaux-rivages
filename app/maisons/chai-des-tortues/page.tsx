import { LocalizedPropertyPage } from "@/components/LocalizedPropertyPage";
import { getProperty } from "@/data";
import { createPageMetadata, createPropertySeo } from "@/seo";
import { GuestBookPreview } from "@/components/guestbook/GuestBookPreview";
import { getPublishedProperty } from "@/platform/property-editor/public";
import { getServerLocale, localize, localizeDeep } from "@/i18n/server";

const property = getProperty("chai-des-tortues");
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
  const managedProperty = await getPublishedProperty("chai-des-tortues");
  return (
    <LocalizedPropertyPage property={managedProperty}>
      <GuestBookPreview />
    </LocalizedPropertyPage>
  );
}
