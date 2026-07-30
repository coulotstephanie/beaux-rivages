import { BookingExperience } from "@/components/BookingExperience";
import { BookingHero } from "@/components/BookingHero";
import { BookingTrustPanel } from "@/components/BookingTrustPanel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { createPageMetadata } from "@/seo";
import { PageStructuredData } from "@/components/PageStructuredData";
import { staticPageSeo } from "@/content/fr/seo";
import { siteMedia } from "@/media/site";
import type { StayOptionId } from "@/booking";
import { getExperience } from "@/experiences";

const pageSeo = staticPageSeo["/reserver"];
export const metadata = createPageMetadata({
  ...pageSeo,
  image: siteMedia.destination.sea,
});

const optionIds: StayOptionId[] = [
  "signature",
  "linen",
  "beach-towels",
  "robes",
  "slippers",
  "personal-arrival",
  "late-checkout",
  "pet",
  "aperitif-basket",
  "basket",
];

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{
    maison?: string;
    option?: string;
    options?: string;
    experience?: string;
    experiences?: string;
  }>;
}) {
  const { maison, option, options, experience, experiences } = await searchParams;
  const initialOptions = [...new Set([option, ...(options?.split(",") ?? [])])].filter(
    (id): id is StayOptionId => optionIds.includes(id as StayOptionId),
  );
  const requestedExperiences = [...new Set([experience, ...(experiences?.split(",") ?? [])])]
    .map((slug) => getExperience(slug)?.slug)
    .filter((slug): slug is string => Boolean(slug));
  return (
    <main className="premium-booking-page">
      <PageStructuredData {...pageSeo} />
      <Header />
      <BookingHero />
      <BookingTrustPanel />
      <BookingExperience
        initialProperty={maison}
        initialOptions={initialOptions}
        initialExperiences={requestedExperiences}
      />
      <Footer />
    </main>
  );
}
