import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/administration/", "/api/", "/carnet-voyageur"],
    },
    sitemap: "https://www.beaux-rivages.com/sitemap.xml",
    host: "https://www.beaux-rivages.com",
  };
}
