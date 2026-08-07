export type Category = "AI" | "Privacy" | "Money" | "Product" | "Open Source";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt?: string;
  category: Category;
  date: string;
  readTime: string;
  author: string;
  image?: "short" | "medium" | "tall";
  cover?: string; // image URL/path shown on the blog card and post hero
  quote?: boolean;
};

export const CATEGORIES: ("All" | Category)[] = ["All", "AI", "Privacy", "Money", "Product", "Open Source"];

export function categoryOf(tags: string[]): Category {
  return CATEGORIES.find((c): c is Category => c !== "All" && tags.includes(c)) ?? "Product";
}

// Parses YYYY-MM-DD without touching Date's timezone (dates stay the same day everywhere).
export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Design-proof posts. Shown only while /content/blog is empty; real posts
// (loaded in posts.ts) replace them the moment the first one lands.
export const SEED_POSTS: BlogPost[] = [
  {
    slug: "ai-expense-tracker-what-it-does",
    title: "What an AI expense tracker actually does",
    excerpt:
      "Parsing, categorizing, answering — the three jobs an AI does in a chat-based tracker, and which of them you should trust.",
    category: "AI",
    date: "Jul 28, 2026",
    readTime: "6 min",
    author: "Sarthak Dobriyal",
    image: "medium",
  },
  {
    slug: "budget-is-a-mirror",
    title: "A budget is a mirror, not a cage.",
    category: "Money",
    date: "Jul 21, 2026",
    readTime: "2 min",
    author: "Sarthak Dobriyal",
    image: "short",
    quote: true,
  },
  {
    slug: "spending-history-more-sensitive-than-password",
    title: "Your spending history is more sensitive than your password",
    excerpt:
      "A password you can change. Your transaction history is a permanent autobiography — here’s why it deserves local storage.",
    category: "Privacy",
    date: "Jul 15, 2026",
    readTime: "5 min",
    author: "Hisaabi Team",
    image: "tall",
  },
  {
    slug: "budget-payday-to-payday",
    title: "Budget from payday to payday, the Indian way",
    excerpt:
      "Monthly budgets ignore when your salary actually lands. Plan from salary date to salary date instead — and let the tracker remind you when it should have arrived.",
    category: "Money",
    date: "Jul 8, 2026",
    readTime: "4 min",
    author: "Sarthak Dobriyal",
    image: "short",
  },
  {
    slug: "cash-is-invisible",
    title: "Cash is invisible: track it or your budget is a lie",
    excerpt:
      "UPI and cards leave a trail. Cash doesn’t — and that missing third of your spending quietly breaks every insight your tracker produces.",
    category: "Money",
    date: "Jun 30, 2026",
    readTime: "5 min",
    author: "Hisaabi Team",
    image: "medium",
  },
  {
    slug: "best-tracker-is-the-one-you-open",
    title: "The best expense tracker is the one you open at the counter.",
    category: "Product",
    date: "Jun 24, 2026",
    readTime: "2 min",
    author: "Hisaabi Team",
    image: "short",
    quote: true,
  },
  {
    slug: "pwa-vs-native-local-first",
    title: "PWA vs native: why local-first wins for personal finance",
    excerpt:
      "An installable app shell, offline logging, no account — what the PWA approach actually buys a finance app that a store submission can’t.",
    category: "Product",
    date: "Jun 17, 2026",
    readTime: "6 min",
    author: "Sarthak Dobriyal",
    image: "tall",
  },
  {
    slug: "open-source-is-a-privacy-audit",
    title: "Open source isn’t a license — it’s a privacy audit",
    excerpt:
      "The strongest privacy guarantee isn’t a promise; it’s code anyone can read. Here’s why that matters when the data is your money.",
    category: "Open Source",
    date: "Jun 10, 2026",
    readTime: "4 min",
    author: "Hisaabi Team",
    image: "short",
  },
  {
    slug: "first-month-expense-tracking-mistakes",
    title: "5 mistakes people make when starting to track expenses",
    excerpt:
      "Over-categorized, backfill guilt, month-end catch-ups. The avoidable ways new trackers quit — and how to skip them from day one.",
    category: "Money",
    date: "Jun 2, 2026",
    readTime: "5 min",
    author: "Sarthak Dobriyal",
    image: "medium",
  },
];
