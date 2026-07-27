/**
 * Point d’entrée éditorial français.
 *
 * Les exports conservent les modules historiques pendant la migration et
 * donnent aux futures locales une surface stable, indépendante des composants.
 */
export { properties, getProperty } from "@/data";
export { propertyPresentations, getPropertyPresentation } from "@/propertyPresentation";
export { reviewProfiles, totalAirbnbReviews } from "@/reviews";
export { hostRecommendations, recommendationCategories } from "@/recommendations";
export { carnetMapPoints, carnetNavigation, carnetSections } from "@/carnetData";
export { staticPageSeo } from "./seo";
