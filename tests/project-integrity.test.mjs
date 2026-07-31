import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

const routes = [
  "/",
  "/avis",
  "/carnet",
  "/carnet-voyageur",
  "/choisir",
  "/coulisses",
  "/destinations",
  "/engagements",
  "/experiences",
  "/faq",
  "/inspiration",
  "/livre-d-or",
  "/maisons",
  "/personnaliser",
  "/phototheque",
  "/pourquoi-beaux-rivages",
  "/pourquoi-revenir",
  "/reserver",
  "/saisons",
  "/sejour",
];
const redirectedRoutes = ["/carnet-voyageur"];

test("all public routes have a page and centralized SEO configuration", () => {
  const seoConfig = read("content/fr/seo.ts");
  for (const route of routes) {
    const page = route === "/" ? "app/page.tsx" : `app${route}/page.tsx`;
    assert.ok(existsSync(join(root, page)), `Missing page for ${route}`);
    assert.match(
      seoConfig,
      new RegExp(`"${route === "/" ? "\\/" : route}"\\s*:`),
      `Missing SEO config for ${route}`,
    );
  }
});

test("property routes use the central property SEO and media manifests", () => {
  for (const slug of ["chai-des-tortues", "villa-raie-manta", "nid-d-ete"]) {
    const page = read(`app/maisons/${slug}/page.tsx`);
    const manifest = read(`media/properties/${slug}.ts`);
    assert.match(page, /createPropertySeo\(property\)/);
    assert.doesNotMatch(
      manifest,
      new RegExp(`/properties/(?!${slug.replaceAll("-", "\\-")})[^/]+/`),
    );
  }
});

test("Le Nid d’Été opens on the real interior and excludes the empty garden", () => {
  const manifest = read("media/properties/nid-d-ete.ts");
  const propertiesPage = read("app/maisons/page.tsx");
  assert.match(manifest, /hero: airbnbLivingRoom\[0\]/);
  assert.match(manifest, /salon-retouche-premium\.png/);
  assert.match(manifest, /originalLivingRoom/);
  assert.doesNotMatch(manifest, /propertyAsset\("airbnb-arriere-cour-3\.jpeg"/);
  assert.doesNotMatch(manifest, /airbnb-buanderie-1-1\.jpeg/);
  assert.doesNotMatch(manifest, /airbnb-buanderie-2-1\.jpeg/);
  assert.doesNotMatch(manifest, /airbnb-arriere-cour-5\.jpeg/);
  assert.match(manifest, /airbnb-toilettes\.jpeg/);
  assert.match(manifest, /arrival: \[arrivalEntrance, arrivalPlan\]/);
  assert.doesNotMatch(manifest, /"Les repères de l’arrivée autonome"/);
  assert.match(manifest, /\.\.\.airbnbBedrooms,[\s\S]*\.\.\.airbnbBathroom/);
  assert.match(propertiesPage, /image=\{property\.hero\}/);
});

test("the Chai ocean pause uses a sharp destination visual", () => {
  const manifest = read("media/properties/chai-des-tortues.ts");
  assert.match(manifest, /destinationMedia\.oceanBreakfast/);
  assert.doesNotMatch(manifest, /terrasse-plage\.jpeg/);
});

test("the Chai gallery follows the guest journey through the house", () => {
  const manifest = read("media/properties/chai-des-tortues.ts");
  const gallery = manifest.slice(
    manifest.indexOf("const propertyGallery"),
    manifest.indexOf("export const chaiDesTortuesMedia"),
  );
  const sections = [
    "// Ouverture et arrivée",
    "// Pièce de vie",
    "// Cuisine et grande table",
    "// Chambres",
    "// Salles d’eau",
    "// Matières et détails",
  ];
  let previous = -1;
  for (const section of sections) {
    const position = gallery.indexOf(section);
    assert.ok(position > previous, `${section} must follow the previous gallery section`);
    previous = position;
  }
});

test("all property galleries expose practical spaces in a logical sequence", () => {
  const chai = read("media/properties/chai-des-tortues.ts");
  const villa = read("media/properties/villa-raie-manta.ts");
  const nid = read("media/properties/nid-d-ete.ts");
  assert.match(chai, /utilities\/toilettes\.jpeg/);
  assert.match(chai, /utilities\/buanderie\.jpeg/);
  assert.match(villa, /\/\/ Salles d’eau et toilettes[\s\S]*\.\.\.airbnbBathrooms/);
  assert.doesNotMatch(villa, /airbnb-photos-supplementaires-1\.jpeg/);
  assert.match(nid, /\/\/ Salle d’eau et toilettes[\s\S]*\.\.\.airbnbBathroom/);
});

test("the ambient player uses the credited public-domain Vivaldi recording", () => {
  const component = read("components/AmbientSound.tsx");
  const credits = read("public/audio/README.md");
  assert.match(component, /vivaldi-spring-largo\.m4a/);
  assert.match(component, /vivaldi-spring-largo\.ogg/);
  assert.match(component, /Vivaldi · Le Printemps/);
  assert.match(component, /preload="metadata"/);
  assert.match(component, /Musique classique/);
  assert.match(credits, /domaine public/i);
  assert.ok(existsSync(join(root, "public/audio/vivaldi-spring-largo.m4a")));
  assert.ok(existsSync(join(root, "public/audio/vivaldi-spring-largo.ogg")));
});

test("the homepage video remains manually playable when autoplay is unavailable", () => {
  const component = read("components/media/HeroVideo.tsx");
  const styles = read("app/globals.css");
  assert.match(component, /className="hero-video__control"/);
  assert.match(component, /Lire la vidéo d’accueil/);
  assert.match(component, /<motion\.video[\s\S]*autoPlay=\{canAutoplay\}/);
  assert.doesNotMatch(styles, /\.premium-hero video\s*\{\s*display:\s*none/);
});

test("every property manifest exclusively references its own media directory", () => {
  for (const slug of ["chai-des-tortues", "villa-raie-manta", "nid-d-ete"]) {
    const manifest = read(`media/properties/${slug}.ts`);
    const propertyPaths = [...manifest.matchAll(/\/images\/properties\/([^/]+)\//g)].map(
      (match) => match[1],
    );
    assert.ok(
      propertyPaths.every((owner) => owner === slug),
      `${slug} contains a foreign property media path`,
    );
    assert.match(
      manifest,
      new RegExp(`owner:\\s*"${slug}"|owner:\\s*slug|owner:\\s*["']${slug}["']`),
    );
  }
  const propertyPage = read("components/PropertyPage.tsx");
  assert.match(propertyPage, /Media owned by another property/);
  assert.match(propertyPage, /presentation\.experiences/);
});

test("every media filename declared by a manifest exists in public", () => {
  const manifests = [
    ["media/destinations.ts", "public/images/destination"],
    ["media/properties/chai-des-tortues.ts", "public/images/properties/chai-des-tortues"],
    ["media/properties/villa-raie-manta.ts", "public/images/properties/villa-raie-manta"],
    ["media/properties/nid-d-ete.ts", "public/images/properties/nid-d-ete"],
  ];

  for (const [manifestPath, mediaDirectory] of manifests) {
    const source = read(manifestPath);
    const filenames = [
      ...source.matchAll(/["'`]([^"'`/]+\.(?:avif|webp|jpe?g|png|mp4))["'`]/gi),
    ].map((match) => match[1]);
    for (const filename of filenames) {
      assert.ok(
        existsSync(join(root, mediaDirectory, filename)),
        `${basename(manifestPath)} references missing media ${filename}`,
      );
    }
  }
});

test("all repository media are represented by the centralized media layer", () => {
  const mediaSource = [
    read("media/destinations.ts"),
    read("media/properties/chai-des-tortues.ts"),
    read("media/properties/villa-raie-manta.ts"),
    read("media/properties/nid-d-ete.ts"),
    read("media/site.ts"),
  ].join("\n");
  const directories = [
    "public/images/destination",
    "public/images/properties/chai-des-tortues",
    "public/images/properties/villa-raie-manta",
    "public/images/properties/nid-d-ete",
    "public/videos",
  ];

  for (const directory of directories) {
    for (const entry of readdirSync(join(root, directory), { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      assert.ok(mediaSource.includes(entry.name), `Unregistered media: ${directory}/${entry.name}`);
    }
  }
});

test("the canonical origin remains absolute and unique", () => {
  const seo = read("seo.ts");
  assert.equal(
    (seo.match(/export const SITE_URL = "https:\/\/www\.beaux-rivages\.com"/g) ?? []).length,
    1,
  );
  assert.match(seo, /alternates: \{ canonical \}/);
});

test("the Carnet exposes premium guides, interactive maps and ideal days", () => {
  const data = read("carnetPremiumData.ts");
  const page = read("app/carnet/page.tsx");
  const categories = [
    "restaurants",
    "plages",
    "producteurs",
    "fort-boyard",
    "marches",
    "velo",
    "parkings",
    "bornes-electriques",
  ];
  for (const category of categories) {
    assert.match(data, new RegExp(`id: "${category}"`), `Missing Carnet category ${category}`);
  }
  assert.match(page, /<PremiumPlaceCollection \/>/);
  assert.match(page, /<PremiumInteractiveMap \/>/);
  assert.match(page, /<IdealDays \/>/);
  assert.match(data, /export const idealDays/);
});

test("the premium experience collection includes all requested experiences", () => {
  const data = read("experiences.ts");
  const page = read("app/experiences/page.tsx");
  const slugs = [
    "pack-signature",
    "romance",
    "anniversaire",
    "demande-en-mariage",
    "plateau-fruits-de-mer",
    "atelier-macarons",
    "lever-de-soleil",
    "coucher-de-soleil",
    "peche-a-pied",
    "balade-velo",
    "bien-etre",
    "famille",
  ];
  for (const slug of slugs) {
    assert.match(data, new RegExp(`slug: "${slug}"`), `Missing experience ${slug}`);
  }
  assert.match(page, /<ExperienceCollection experiences=\{localExperiences\} \/>/);
  assert.match(page, /Inspirations locales · hors packs/);
  assert.match(read("components/ExperienceCollection.tsx"), /Demander cette suggestion/);
});

test("hospitality services expose seven visual, bookable or quote-ready journeys", () => {
  const catalog = read("hospitalityServices.ts");
  const booking = read("booking.ts");
  const migration = read("supabase/migrations/20260731193000_hospitality_experiences.sql");
  const requestApi = read("app/api/experience-requests/route.ts");
  for (const slug of [
    "essentiel",
    "bebe",
    "animaux",
    "experience-signature",
    "romance",
    "demande-en-mariage",
    "anniversaire",
  ]) {
    assert.match(catalog, new RegExp(`slug: "${slug}"`), `Missing hospitality service ${slug}`);
  }
  assert.match(catalog, /gallery:/);
  assert.match(booking, /id: "pet"[\s\S]{0,300}price: 25/);
  assert.match(booking, /id: "romance"[\s\S]{0,300}price: 149/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /revoke all on public\.experience_requests from public, anon/);
  assert.match(requestApi, /requireSameOrigin/);
});

test("every Carnet link to an experience anchor targets an existing experience", () => {
  const carnet = read("carnetData.ts");
  const experienceData = read("experiences.ts");
  const linkedSlugs = [...carnet.matchAll(/href:\s*"\/experiences#([^"]+)"/g)].map(
    (match) => match[1],
  );
  for (const slug of linkedSlugs) {
    assert.match(
      experienceData,
      new RegExp(`slug: "${slug}"`),
      `Broken Carnet experience anchor ${slug}`,
    );
  }
});

test("the sitemap includes every centralized static route", () => {
  const sitemap = read("app/sitemap.ts");
  for (const route of routes.filter(
    (route) => route !== "/" && !redirectedRoutes.includes(route),
  )) {
    assert.match(sitemap, new RegExp(`"${route}"`), `Sitemap missing ${route}`);
  }
  for (const route of redirectedRoutes) {
    assert.doesNotMatch(
      sitemap,
      new RegExp(`"${route}"`),
      `Redirected route should not be indexed: ${route}`,
    );
  }
});

test("the sitemap publishes every detailed experience", () => {
  const sitemap = read("app/sitemap.ts");
  assert.match(sitemap, /experiences\.map/);
  assert.match(sitemap, /\/experiences\/\$\{experience\.slug\}/);
});

test("personalization selections are preserved into the booking journey", () => {
  const composer = read("components/StayComposer.tsx");
  const bookingPage = read("app/reserver/page.tsx");
  assert.match(composer, /params\.set\("options"/);
  assert.match(composer, /params\.set\("experiences"/);
  assert.match(bookingPage, /options\?\.split/);
  assert.match(bookingPage, /experiences\?\.split/);
});

test("platform foundations keep external providers behind typed contracts", () => {
  assert.match(read("platform/content/repository.ts"), /interface ContentRepository/);
  assert.match(read("platform/admin/service.ts"), /AdminAuthorizer/);
  assert.match(read("platform/calendar/contracts.ts"), /interface CalendarConnector/);
  assert.match(read("platform/reservations/contracts.ts"), /interface ReservationRepository/);
  assert.match(read("platform/reservations/contracts.ts"), /interface PaymentGateway/);
  assert.match(read("platform/traveler/contracts.ts"), /type TravelerPortal/);
});

test("Stripe TEST verifies signatures and handles the complete payment lifecycle", () => {
  const adapter = read("platform/payments/stripe.ts");
  const checkout = read("app/api/payments/checkout/route.ts");
  const webhook = read("app/api/payments/webhook/route.ts");
  const refund = read("app/api/admin/payments/refund/route.ts");
  assert.match(adapter, /constructEvent/);
  assert.match(adapter, /payment_intent_data/);
  assert.match(checkout, /payableReservation/);
  assert.match(checkout, /amountDue/);
  for (const event of [
    "checkout.session.completed",
    "checkout.session.expired",
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "charge.refunded",
  ]) {
    assert.match(
      webhook,
      new RegExp(event.replaceAll(".", "\\.")),
      `Missing Stripe event ${event}`,
    );
  }
  assert.match(webhook, /claimEvent/);
  assert.match(refund, /authorizeStaff/);
  assert.match(refund, /requireSameOrigin/);
});

test("iCal normalization handles event boundaries, cancellation and deduplication", () => {
  const source = read("platform/calendar/ical.ts");
  assert.match(source, /BEGIN:VEVENT/);
  assert.match(source, /DTSTART/);
  assert.match(source, /DTEND/);
  assert.match(source, /status !== "cancelled"/);
  assert.match(source, /new Map/);
});

test("public availability includes manual and direct Supabase blocks", () => {
  const source = read("platform/calendar/service.ts");
  assert.match(source, /listOutboundBlocks\(propertySlug\)/);
  assert.match(source, /source: block\.source/);
  assert.match(source, /Date\.now\(\) \+ 60_000/);
});

test("deployment configuration never commits local secrets", () => {
  const ignored = read(".gitignore");
  const example = read(".env.example");
  const workflow = read(".github/workflows/ci.yml");
  assert.match(ignored, /^\.env$/m);
  assert.match(ignored, /^\.env\.local$/m);
  for (const secretKey of ["AUTH_SECRET", "DATABASE_URL", "PAYMENT_PROVIDER_SECRET"]) {
    assert.match(
      example,
      new RegExp(`^${secretKey}=$`, "m"),
      `${secretKey} must stay empty in .env.example`,
    );
  }
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run validate/);
});

test("internationalization publishes the four complete public locales", () => {
  const config = read("i18n/config.ts");
  const messages = read("i18n/messages.ts");
  const middleware = read("middleware.ts");
  const selector = read("components/LanguageSelector.tsx");
  assert.match(config, /\["fr", "en", "de", "es"\]/);
  assert.match(config, /productionLocales[^=]*=\s*\["fr", "en", "de", "es"\]/);
  assert.match(messages, /Record<SupportedLocale, MessageCatalog>/);
  assert.match(middleware, /NextResponse\.rewrite/);
  assert.match(selector, /🇫🇷/);
  assert.match(selector, /🇬🇧/);
  assert.match(selector, /🇩🇪/);
  assert.match(selector, /🇪🇸/);
  for (const locale of ["en", "de", "es"]) {
    const catalog = JSON.parse(read(`i18n/translations/${locale}.json`));
    assert.ok(
      Object.keys(catalog).length > 2_400,
      `${locale} catalog must cover the complete public site`,
    );
    assert.ok(catalog["Préparer votre séjour"]);
    assert.ok(catalog["Nos maisons"]);
  }
});

test("booking review prevents invalid navigation and capacity overflow", () => {
  const journey = read("components/BookingExperience.tsx");
  const stepper = read("components/BookingStepper.tsx");
  const guests = read("components/GuestSelector.tsx");
  assert.match(journey, /maxAccessible/);
  assert.match(stepper, /disabled=\{step > maxAccessible\}/);
  assert.match(journey, /selectedProperty\?\.capacity/);
  assert.match(guests, /countedGuests >= maxGuests/);
});

test("public review claims stay sourced and the direct request stays payment-free", () => {
  const reviews = read("reviews.ts");
  const reviewPage = read("app/avis/page.tsx");
  const bookingTrust = read("components/BookingTrustPanel.tsx");
  assert.match(reviews, /booking\.com\/hotel\/fr\/maison-vue-mer-ile-de-re-rivedoux-plage/);
  assert.match(reviews, /booking\.com\/hotel\/fr\/chai-renove-ile-de-re-250-m-de-la-plage/);
  assert.match(
    reviews,
    /booking\.com\/hotel\/fr\/maison-acces-plage-2-a-personnes-saint-georges-d-oleron/,
  );
  assert.match(reviews, /reviewsVerifiedOn/);
  assert.doesNotMatch(reviewPage, /99 %|98 %|97 %/);
  assert.match(bookingTrust, /Aucun débit n’a lieu avant/);
  assert.match(bookingTrust, /totalPublicPlatformReviews/);
});

test("direct booking exposes a verified quote and durable request confirmation", () => {
  const journey = read("components/BookingExperience.tsx");
  const form = read("components/DirectBookingForm.tsx");
  const reservation = read("app/api/reservation/route.ts");
  assert.match(journey, /DirectBookingForm/);
  assert.match(journey, /booking_quote_viewed/);
  assert.match(form, /\/api\/reservation/);
  assert.match(form, /Demande enregistrée/);
  assert.match(form, /Aucun\s+paiement n’a été débité/);
  assert.match(reservation, /SupabaseReservationRepository/);
  assert.match(reservation, /DATES_UNAVAILABLE/);
});

test("the persuasive galleries preserve every room type and lived-in family scenes", () => {
  const data = read("data.ts");
  assert.match(data, /curateGallery/);
  const livedInMedia = [
    read("media/properties/chai-des-tortues.ts"),
    read("media/properties/villa-raie-manta.ts"),
    read("media/properties/nid-d-ete.ts"),
  ].join("\n");
  assert.match(livedInMedia, /editorial\/enfants-bebe-et-chien/);
  assert.match(livedInMedia, /editorial\/retour-plage-en-famille/);
  for (const manifest of [
    "media/properties/chai-des-tortues.ts",
    "media/properties/villa-raie-manta.ts",
    "media/properties/nid-d-ete.ts",
  ]) {
    const source = read(manifest);
    assert.match(source, /bathroom|bathrooms|salle-de-bain|salle-eau/i);
    assert.match(source, /toilettes/i);
    assert.match(source, /kitchen|cuisine/i);
    assert.match(source, /bedroom|bedrooms|chambre/i);
    assert.match(source, /exterior|exterieur|extérieur/i);
  }
});

test("the useful map includes health, parking, charging and direct directions", () => {
  const data = read("carnetPremiumData.ts");
  const map = read("components/carnet/PremiumInteractiveMap.tsx");
  assert.match(data, /sante-rivedoux/);
  assert.match(data, /parking-lions/);
  assert.match(data, /parking-goelands/);
  assert.match(data, /bornes-electriques/);
  assert.match(map, /Itinéraire/);
});

test("premium concierge renders native German and Spanish dynamic content", () => {
  const concierge = read("components/ConciergePremium.tsx");
  assert.match(concierge, /option value="de"/);
  assert.match(concierge, /option value="es"/);
  assert.match(concierge, /const experienceDe/);
  assert.match(concierge, /const experienceEs/);
  assert.match(concierge, /pageLocale\(pathname/);
  assert.match(concierge, /data-no-translate/);
});

test("booking handoff clearly uses a native email action", () => {
  const button = read("components/ui/Button.tsx");
  const journey = read("components/BookingExperience.tsx");
  assert.match(button, /href\.startsWith\("mailto:"\)/);
  assert.match(journey, /emailBookingGateway/);
  assert.match(journey, /Préparer plutôt un e-mail/);
});

test("the Signature experience exposes its weather, planning and arrival journeys", () => {
  const weatherEngine = read("weatherEngine.ts");
  const stayBuilder = read("components/SignatureStayBuilder.tsx");
  const comparison = read("components/HouseComparisonTable.tsx");
  const arrival = read("app/avant-arrivee/page.tsx");

  for (const signal of ["precipitation", "windDirection", "temperature", "tide", "season"]) {
    assert.match(weatherEngine, new RegExp(signal), `weather engine should account for ${signal}`);
  }
  for (const interest of ["gastronomie", "velo", "plages", "patrimoine", "nature", "nautique"]) {
    assert.match(stayBuilder, new RegExp(interest), `stay builder should offer ${interest}`);
  }
  for (const property of ["chai-des-tortues", "villa-raie-manta", "nid-d-ete"]) {
    assert.match(comparison, new RegExp(property), `comparison should include ${property}`);
  }
  assert.doesNotMatch(
    comparison,
    /label: "Surface"/,
    "comparison should omit unavailable property surfaces",
  );
  assert.match(arrival, /ArrivalChecklist/);
  assert.match(arrival, /SmartWeatherAdvisor/);
  assert.match(arrival, /PremiumInteractiveMap/);
});

test("the Carnet map keeps addresses available when a tile provider fails", () => {
  const map = read("components/carnet/PremiumInteractiveMap.tsx");
  const loader = read("components/carnet/PremiumInteractiveMapLoader.tsx");

  assert.match(map, /rastertiles\/voyager/);
  assert.match(map, /localFallbackTiles/);
  assert.match(map, /<ImageOverlay/);
  assert.match(map, /tileerror/);
  assert.match(map, /tile\.openstreetmap\.org/);
  assert.match(map, /Toutes les adresses restent disponibles/);
  assert.match(loader, /MapRecoveryBoundary/);
  assert.match(loader, /premiumPlaces\.slice/);
});

test("premium media remains operable with keyboard, touch, zoom and video", () => {
  const lightbox = read("components/ImageLightbox.tsx");
  const fullscreenGallery = read("components/FullscreenGallery.tsx");
  const seasons = read("app/saisons/page.tsx");

  assert.match(lightbox, /ArrowLeft/);
  assert.match(lightbox, /ArrowRight/);
  assert.match(lightbox, /isZoomed/);
  assert.match(lightbox, /pointerStart/);
  assert.match(seasons, /<video/);
});

test("pricing plans configure every house without platform scraping", () => {
  const configuration = JSON.parse(read("content/rates.json"));
  const expected = new Set(["chai-des-tortues", "villa-raie-manta", "nid-d-ete"]);
  assert.equal(configuration.plans.length, 3);
  for (const plan of configuration.plans) {
    expected.delete(plan.propertySlug);
    for (const key of [
      "baseNightlyRate",
      "weekendNightlyRate",
      "minimumNights",
      "maximumNights",
      "cleaningFee",
      "securityDeposit",
    ]) {
      assert.equal(typeof plan[key], "number", `${plan.propertySlug}.${key} should be numeric`);
      assert.ok(plan[key] >= 0, `${plan.propertySlug}.${key} should be positive`);
    }
    assert.ok(plan.maximumNights >= plan.minimumNights);
    assert.ok(plan.seasons.length >= 3);
    assert.ok(plan.promotions.some((promotion) => promotion.kind === "long-stay"));
  }
  assert.equal(expected.size, 0);
  const pricingSource = read("platform/pricing/service.ts");
  assert.doesNotMatch(pricingSource, /airbnb|booking\.com|abritel|scrap/i);
});

test("pricing engine supports daily rates, stay rules, fees and promotions", () => {
  const contracts = read("platform/pricing/contracts.ts");
  const service = read("platform/pricing/service.ts");
  for (const capability of [
    "baseNightlyRate",
    "weekendNightlyRate",
    "minimumNights",
    "maximumNights",
    "cleaningFee",
    "securityDeposit",
    "touristTax",
    "optionPrices",
  ]) {
    assert.match(contracts, new RegExp(capability));
  }
  for (const promotion of ["long-stay", "last-minute", "early-booking", "code", "seasonal"]) {
    assert.match(contracts, new RegExp(promotion));
  }
  assert.match(service, /nightlyLines/);
  assert.match(service, /bestPromotion/);
  assert.match(service, /buildAnnualRates/);
});

test("availability and pricing APIs are documented and protected", () => {
  for (const route of [
    "calendar",
    "availability",
    "reservation",
    "pricing",
    "options",
    "ical",
    "rates",
    "promotions",
    "quote",
  ]) {
    assert.ok(existsSync(join(root, "app", "api", route, "route.ts")), `missing /api/${route}`);
  }
  const security = read("platform/http/security.ts");
  assert.match(security, /rateLimit/);
  assert.match(read("platform/auth/server.ts"), /authorizeStaff/);
  assert.match(read("docs/PRICING_AND_AVAILABILITY_API.md"), /Aucun\s+scraping/);
  assert.match(read("components/AvailabilityCalendar.tsx"), /features\/reservations\/components/);
  assert.match(read("features/reservations/hooks/use-availability-calendar.ts"), /api\/calendar/);
  assert.match(read("components/PriceSummary.tsx"), /api\/pricing/);
});
