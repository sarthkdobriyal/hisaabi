import type { MetadataRoute } from "next";

const SITE = "https://hisaabi.co.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/app/", // client-side private app — nothing to index
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
