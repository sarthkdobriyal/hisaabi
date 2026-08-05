import type { MetadataRoute } from "next";
import { readAllPosts } from "@/lib/posts";

const SITE = "https://hisaabi.co.in";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...readAllPosts().map((p) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: SITE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/features`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/guides/ai-expense-tracker`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/guides/private-expense-tracking`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/guides/track-expenses-in-india`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/guides/budgeting-with-ai`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/vs/mint-alternative`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/vs/splitwise-alternative`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/vs/notion-expense-tracker`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/vs/excel-expense-tracker`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
