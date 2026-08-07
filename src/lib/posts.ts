import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { SEED_POSTS, categoryOf, formatDate, type BlogPost } from "@/lib/blog";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
  related: string[];
  cover?: string;
  readingTime: string;
};

export type Post = { meta: PostMeta; content: string };

function readingTime(words: number): string {
  return `${Math.max(1, Math.round(words / 200))} min`;
}

// gray-matter parses unquoted YAML dates into Date objects; normalize to YYYY-MM-DD.
function toIsoDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getUTCFullYear();
    const m = String(value.getUTCMonth() + 1).padStart(2, "0");
    const d = String(value.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(value ?? "").slice(0, 10);
}

function metaOf(slug: string, data: Record<string, unknown>, content: string): PostMeta {
  const cover = String(data.cover ?? "").trim();
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: toIsoDate(data.date),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    author: String(data.author ?? "Hisaabi Team"),
    related: Array.isArray(data.related) ? data.related.map(String) : [],
    cover: cover || undefined,
    readingTime: readingTime(content.trim().split(/\s+/).length),
  };
}

function readFile(slug: string): { data: Record<string, unknown>; content: string } | null {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { data, content };
}

export function readAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data, content } = readFile(slug)!;
      return metaOf(slug, data, content);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
  const parsed = readFile(slug);
  if (!parsed) return null;
  return { meta: metaOf(slug, parsed.data, parsed.content), content: parsed.content };
}

// Server-only: never import this into a client component.
export const BLOG_POSTS: BlogPost[] = (() => {
  const real = readAllPosts().map((m) => ({
    slug: m.slug,
    title: m.title,
    excerpt: m.description || undefined,
    category: categoryOf(m.tags),
    date: formatDate(m.date),
    readTime: m.readingTime,
    author: m.author,
    cover: m.cover,
  }));
  return real.length > 0 ? real : SEED_POSTS;
})();
