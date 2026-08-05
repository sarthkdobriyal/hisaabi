import type { Metadata } from "next";
import type { ComponentProps } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { BlogCard } from "@/components/blog/BlogCard";
import { categoryOf, formatDate, type BlogPost } from "@/lib/blog";
import { BLOG_POSTS, getPost, readAllPosts, type PostMeta } from "@/lib/posts";

const SITE = "https://hisaabi.co.in";

export const dynamicParams = false;

export function generateStaticParams() {
  return readAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const { meta } = post;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `${SITE}/blog/${meta.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      url: `${SITE}/blog/${meta.slug}`,
      publishedTime: meta.date,
      authors: [meta.author],
    },
  };
}

const md = {
  h2: (p: ComponentProps<"h2">) => (
    <h2 {...p} className={`mt-10 text-2xl font-semibold tracking-tight ${p.className ?? ""}`} />
  ),
  h3: (p: ComponentProps<"h3">) => (
    <h3 {...p} className={`mt-8 text-xl font-semibold tracking-tight ${p.className ?? ""}`} />
  ),
  p: (p: ComponentProps<"p">) => (
    <p {...p} className={`mt-5 leading-relaxed text-muted-foreground ${p.className ?? ""}`} />
  ),
  a: (p: ComponentProps<"a">) => (
    <a
      {...p}
      className={`font-medium text-brand underline underline-offset-4 hover:text-brand-600 ${p.className ?? ""}`}
    />
  ),
  ul: (p: ComponentProps<"ul">) => (
    <ul {...p} className={`mt-5 list-disc space-y-2 pl-5 ${p.className ?? ""}`} />
  ),
  ol: (p: ComponentProps<"ol">) => (
    <ol {...p} className={`mt-5 list-decimal space-y-2 pl-5 ${p.className ?? ""}`} />
  ),
  li: (p: ComponentProps<"li">) => (
    <li {...p} className={`leading-relaxed text-muted-foreground ${p.className ?? ""}`} />
  ),
  blockquote: (p: ComponentProps<"blockquote">) => (
    <blockquote
      {...p}
      className={`mt-6 border-l-4 border-brand pl-4 italic text-muted-foreground ${p.className ?? ""}`}
    />
  ),
  strong: (p: ComponentProps<"strong">) => (
    <strong {...p} className={`font-semibold text-foreground ${p.className ?? ""}`} />
  ),
  hr: (p: ComponentProps<"hr">) => <hr {...p} className={`my-10 border-border ${p.className ?? ""}`} />,
  table: (p: ComponentProps<"table">) => (
    <div className="mt-6 overflow-x-auto">
      <table {...p} className={`w-full text-sm ${p.className ?? ""}`} />
    </div>
  ),
};

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function relatedPosts(meta: PostMeta): BlogPost[] {
  const bySlug = new Map(BLOG_POSTS.map((p) => [p.slug, p]));
  const fromRelated = meta.related
    .map((s) => bySlug.get(s))
    .filter((p): p is BlogPost => Boolean(p));
  const seen = new Set(fromRelated.map((p) => p.slug));
  const sameCategory = BLOG_POSTS.filter(
    (p) => p.slug !== meta.slug && !seen.has(p.slug) && p.category === categoryOf(meta.tags),
  );
  const rest = BLOG_POSTS.filter((p) => p.slug !== meta.slug && !seen.has(p.slug));
  return [...fromRelated, ...sameCategory, ...rest].slice(0, 3);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const { meta, content } = post;
  const related = relatedPosts(meta);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    author: { "@type": "Person", name: meta.author },
    publisher: { "@type": "Organization", name: "Hisaabi", url: SITE },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${meta.slug}` },
  };

  return (
    <>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6">
        <article className="mx-auto max-w-2xl py-12">
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            &larr; Back to blog
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>{categoryOf(meta.tags)}</span>
            <span className="text-muted-foreground/50">&middot;</span>
            <span>{formatDate(meta.date)}</span>
            <span className="text-muted-foreground/50">&middot;</span>
            <span>{meta.readingTime} read</span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{meta.title}</h1>
          {meta.description && (
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{meta.description}</p>
          )}
          <div className="mt-6 flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
              {initials(meta.author)}
            </div>
            <span className="text-sm font-medium">{meta.author}</span>
          </div>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
            {content}
          </ReactMarkdown>
        </article>

        {related.length > 0 && (
          <section className="border-t border-border py-12">
            <h2 className="text-2xl font-semibold tracking-tight">Related reading</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <div className="pt-16">
        <MarketingFooter />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
