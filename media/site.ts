import { propertyMedia } from "./properties";
import { destinationMedia } from "./destinations";

export const siteMedia = {
  destination: {
    sea: destinationMedia.sea.src,
    food: destinationMedia.food.src,
    marsh: destinationMedia.marsh.src,
    beach: destinationMedia.beach.src,
    bridge: destinationMedia.bridge.src,
    lane: destinationMedia.lane.src,
    salt: destinationMedia.salt.src,
    village: destinationMedia.village.src,
    saintMartinPort: destinationMedia.saintMartinPort.src,
    chassiron: destinationMedia.chassiron.src,
    laRochelleOldPort: destinationMedia.laRochelleOldPort.src,
    flowerDunes: destinationMedia.flowerDunes.src,
    beachFishing: destinationMedia.beachFishing.src,
    familySunset: destinationMedia.familySunset.src,
    morningSurf: destinationMedia.morningSurf.src,
    familyForeshore: destinationMedia.familyForeshore.src,
    fortBoyard: destinationMedia.fortBoyard.src,
    fortBoyardAerial: destinationMedia.fortBoyardAerial.src,
    chassironPointAerial: destinationMedia.chassironPointAerial.src,
    chassironGardensAerial: destinationMedia.chassironGardensAerial.src,
    chassironCoastAerial: destinationMedia.chassironCoastAerial.src,
    oceanBreakfast: destinationMedia.oceanBreakfast.src,
    beachPicnic: destinationMedia.beachPicnic.src,
  },
  properties: propertyMedia,
  video: {
    homepageHero: "/videos/beaux-rivages-hero-v2.mp4",
    homepageHeroWebm: "/videos/beaux-rivages-hero-v2.webm",
    homepageHeroLegacy: "/videos/beaux-rivages-hero.mp4",
  },
} as const;
