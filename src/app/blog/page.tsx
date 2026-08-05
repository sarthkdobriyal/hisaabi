import type { Metadata } from "next";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — AI expense tracking & money",
  description:
    "Practical notes on tracking expenses, keeping your finances private, and the AI that ties it together. From the Hisaabi team.",
};

export default function BlogPage() {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6">
        <div className="mx-auto max-w-2xl pb-16 pt-16 text-center">
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            Money, AI & privacy
          </span>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">The Blog</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Practical notes on tracking expenses, keeping your finances private, and the AI that
            ties it together.
          </p>
        </div>
        <BlogGrid posts={BLOG_POSTS} />
      </main>
      <div className="pt-16">
        <MarketingFooter />
      </div>
    </>
  );
}
