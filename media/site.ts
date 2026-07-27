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
  },
  properties: propertyMedia,
  video: {
    homepageHero: "/videos/beaux-rivages-hero.mp4",
  },
} as const;
