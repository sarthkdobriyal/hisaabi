import Link from "next/link";
import { FileText, Quote } from "lucide-react";
import type { BlogPost, Category } from "@/lib/blog";

// Category accents reuse the app's chart palette (globals.css --chart-*)
// so the blog stays on-brand with the dashboard.
const ACCENT: Record<Category, { text: string; hoverText: string; borderHover: string }> = {
  AI: {
    text: "text-teal-600 dark:text-teal-400",
    hoverText: "group-hover:text-teal-600 dark:group-hover:text-teal-400",
    borderHover: "hover:border-teal-500/50 dark:hover:border-teal-400/40",
  },
  Privacy: {
    text: "text-emerald-600 dark:text-emerald-400",
    hoverText: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    borderHover: "hover:border-emerald-500/50 dark:hover:border-emerald-400/40",
  },
  Money: {
    text: "text-amber-600 dark:text-amber-400",
    hoverText: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    borderHover: "hover:border-amber-500/50 dark:hover:border-amber-400/40",
  },
  Product: {
    text: "text-indigo-600 dark:text-indigo-400",
    hoverText: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
    borderHover: "hover:border-indigo-500/50 dark:hover:border-indigo-400/40",
  },
  "Open Source": {
    text: "text-pink-600 dark:text-pink-400",
    hoverText: "group-hover:text-pink-600 dark:group-hover:text-pink-400",
    borderHover: "hover:border-pink-500/50 dark:hover:border-pink-400/40",
  },
};

const HEIGHT: Record<NonNullable<BlogPost["image"]>, string> = {
  short: "h-40",
  medium: "h-64",
  tall: "h-96",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function BlogCard({ post }: { post: BlogPost }) {
  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

  if (post.quote) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={`mb-8 flex min-h-[300px] break-inside-avoid flex-col items-center justify-center gap-6 rounded-xl border border-border bg-muted p-8 text-center transition duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-muted-foreground/50 ${focus}`}
      >
        <Quote className="size-8 text-muted-foreground/40" strokeWidth={1.5} />
        <blockquote className="text-3xl font-bold leading-tight tracking-tight">
          {post.title}
        </blockquote>
        <div className="flex items-center gap-3 text-sm font-medium">
          <span className="h-px w-8 bg-muted-foreground/40" aria-hidden />
          <span>{post.author}</span>
          <span className="h-px w-8 bg-muted-foreground/40" aria-hidden />
        </div>
      </Link>
    );
  }

  const a = ACCENT[post.category];
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group mb-8 block break-inside-avoid overflow-hidden rounded-xl border border-border bg-card shadow-sm transition duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${a.borderHover} ${focus}`}
    >
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground/50 ${HEIGHT[post.image ?? "medium"]}`}
      >
        <FileText className="size-6" strokeWidth={1.5} />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
          <span className={a.text}>{post.category}</span>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground">{post.date}</span>
        </div>
        <h3
          className={`mt-3 text-xl font-semibold tracking-tight transition-colors duration-200 ${a.hoverText}`}
        >
          {post.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <div className="mt-5 flex items-center gap-2.5 border-t border-border pt-4">
          <div className="flex size-8 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
            {initials(post.author)}
          </div>
          <div className="text-xs leading-tight">
            <p className="font-medium text-foreground">{post.author}</p>
            <p className="text-muted-foreground">{post.readTime} read</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
