import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Next's default is WebP only; AVIF is smaller for the same quality.
    formats: ["image/avif", "image/webp"],
    // Temporary stand-in photos for Story/Venue until the real art exists
    // (see docs/DECISIONS.md) - next/image refuses an unlisted remote host.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.wedissimo.com" },
      { protocol: "https", hostname: "www.brides.com" },
      { protocol: "https", hostname: "www.v3events.in" },
    ],
  },
  experimental: {
    agentFeedback: true,
    agentUpgrade: "security",
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
