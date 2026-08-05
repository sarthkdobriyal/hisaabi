"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { CATEGORIES, type BlogPost } from "@/lib/blog";

const INITIAL = 6;
const STEP = 3;

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [visible, setVisible] = useState(INITIAL);

  const filtered = category === "All" ? posts : posts.filter((p) => p.category === category);
  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <>
      <nav className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {CATEGORIES.map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setVisible(INITIAL);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                active
                  ? "bg-foreground text-background"
                  : "border border-border bg-background text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          );
        })}
      </nav>

      <div className="mt-8 columns-1 gap-8 sm:columns-2 lg:columns-3">
        {shown.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + STEP)}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3 text-sm font-medium text-muted-foreground transition duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-muted-foreground/50 hover:bg-muted hover:text-foreground"
          >
            Load more
            <ChevronDown className="size-4" />
          </button>
        </div>
      )}
    </>
  );
}
