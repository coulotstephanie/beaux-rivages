import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    // Keep property media available when the hosting image-transformation quota is exhausted.
    // Originals are already web-sized and cached through the /images headers below.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    qualities: [85, 88, 90, 95],
    minimumCacheTTL: 2_592_000,
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];
    const publicHtmlCacheHeaders = [
      { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
      {
        key: "CDN-Cache-Control",
        value: "public, s-maxage=300, stale-while-revalidate=86400",
      },
      {
        key: "Vercel-CDN-Cache-Control",
        value: "public, s-maxage=300, stale-while-revalidate=86400",
      },
    ];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source:
          "/:path((?!api(?:/|$)|_next(?:/|$)|administration(?:/|$)|reserver(?:/|$)|carnet-voyageur(?:/|$)|images(?:/|$)|videos(?:/|$)|icon(?:/|\\.|$)|apple-touch-icon(?:/|\\.|$)|manifest(?:/|\\.|$)|robots(?:/|\\.|$)|sitemap(?:/|\\.|$)).*)",
        headers: publicHtmlCacheHeaders,
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
