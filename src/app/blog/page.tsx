import type { Metadata } from "next";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { TealNoirBackground } from "@/components/marketing/TealNoirBackground";
import { BLOG_POSTS, readAllPosts } from "@/lib/posts";
import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/blog",
  title: "The Blog — Expense tracking, money & privacy",
  description:
    "Practical notes on tracking expenses, keeping your finances private, and the AI that ties it together. From the Hisaabi team.",
});

export default function BlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "The Hisaabi Blog",
    description:
      "Practical notes on tracking expenses, keeping your finances private, and the AI that ties it together.",
    url: `${SITE}/blog`,
    blogPost: readAllPosts().map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE}/blog/${p.slug}`,
      datePublished: p.date,
      author: { "@type": "Person", name: p.author },
    })),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <TealNoirBackground />
      <MarketingHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-6">
        <div className="mx-auto max-w-2xl pb-16 pt-16 text-center">
          <span className="rounded-full border border-white/10 bg-zinc-900/50 px-3 py-1 text-xs font-medium text-zinc-400">
            Money, AI & privacy
          </span>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl">The Blog</h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Practical notes on tracking expenses, keeping your finances private, and the AI that
            ties it together.
          </p>
        </div>
        <BlogGrid posts={BLOG_POSTS} />
      </main>
      <div className="relative z-10 pt-16">
        <MarketingFooter />
      </div>
    </div>
  );
}
