import type { Metadata } from "next";

// Shared page metadata factory so every marketing page emits a full SEO set:
// exact (≤60-char) title, canonical URL, Open Graph and Twitter tags. The root
// layout sets a title template + base OG; pages must override canonical or they
// inherit "/", which is why every page goes through here.

export const SITE = "https://hisaabi.co.in";

export type PageSeo = {
  path: string;
  title: string; // ≤60 chars, rendered verbatim (no " — Hisaabi" suffix)
  description: string; // ≤155 chars
  type?: "website" | "article";
  image?: string; // absolute URL for og:image / twitter:image (blog covers)
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
};

export function pageMetadata(seo: PageSeo): Metadata {
  const url = `${SITE}${seo.path}`;
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: seo.path },
    openGraph: {
      type: seo.type ?? "website",
      url,
      siteName: "Hisaabi",
      title: seo.title,
      description: seo.description,
      ...(seo.image ? { images: [{ url: seo.image }] } : {}),
      ...(seo.type === "article"
        ? {
            publishedTime: seo.publishedTime,
            modifiedTime: seo.modifiedTime,
            authors: seo.authors,
            tags: seo.tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      ...(seo.image ? { images: [seo.image] } : {}),
    },
  };
}
