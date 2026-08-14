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
import { headers } from "next/headers";

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
  "early-checkin",
  "late-checkout",
  "pet",
  "aperitif-basket",
  "basket",
  "signature-aperitif",
  "signature-sweet",
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
    demo?: string;
  }>;
}) {
  const { maison, option, options, experience, experiences, demo } = await searchParams;
  const requestHeaders = await headers();
  const requestHost = (
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    ""
  ).toLowerCase();
  const isCalendarPreview =
    process.env.VERCEL_ENV === "preview" ||
    process.env.VERCEL_TARGET_ENV === "preview" ||
    requestHost.includes("git-agent-calend") ||
    requestHost.startsWith("127.0.0.1:") ||
    requestHost.startsWith("localhost:");
  const calendarDemo = isCalendarPreview && demo === "calendrier";
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
        calendarDemo={calendarDemo}
      />
      <Footer />
    </main>
  );
}
