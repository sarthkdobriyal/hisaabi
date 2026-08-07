import { readAllPosts } from "@/lib/posts";
import { FEATURES } from "@/lib/features";

export const revalidate = 3600;

const GUIDES = [
  { href: "/guides/private-expense-tracking", title: "Private expense tracking: keep your finances out of the cloud", desc: "Why cloud trackers are a bad home for your spending history, how local-first fixes it, and how to verify a privacy claim." },
  { href: "/guides/ai-expense-tracker", title: "What is an AI expense tracker?", desc: "How chat-based AI expense tracking works, the privacy trade-offs, and how to pick one." },
  { href: "/guides/budgeting-with-ai", title: "Budgeting with AI: budgets that actually hold", desc: "How AI budgeting automates the tracking and warns you before you overspend." },
  { href: "/guides/track-expenses-in-india", title: "How to track expenses in India: UPI, cash, and salary", desc: "Tracking in rupees from salary date to the kirana trip, covering UPI, cash and banks." },
];

const ALTERNATIVES = [
  { href: "/vs/mint-alternative", title: "Mint alternative", desc: "Private replacement for the closed-down Mint." },
  { href: "/vs/splitwise-alternative", title: "Splitwise alternative", desc: "For your own spending, not shared bill splitting." },
  { href: "/vs/notion-expense-tracker", title: "Notion expense tracker alternative", desc: "No templates or formulas to maintain." },
  { href: "/vs/excel-expense-tracker", title: "Excel expense tracker alternative", desc: "Chat-first logging instead of spreadsheet columns." },
];

export async function GET() {
  const posts = readAllPosts();
  const l: string[] = [];
  l.push("# Hisaabi");
  l.push("");
  l.push("> Chat your expenses. Keep your data. A free, privacy-first, local-first AI expense tracker.");
  l.push("");
  l.push("Key facts:");
  l.push("- All data lives in the browser (IndexedDB). No account, no server, no cloud sync, no telemetry.");
  l.push("- You bring your own AI key (OpenAI, Anthropic, Gemini, Groq, or a local Ollama). The only outbound request is your prompt to your chosen provider.");
  l.push("- Optional passcode lock encrypts stores at rest with AES-256-GCM; key derived via PBKDF2 (600,000 iterations), never stored.");
  l.push("");
  l.push("## Key pages");
  l.push("");
  l.push("- [Homepage](/)");
  l.push("- [App](/app)");
  l.push("- [Features](/features)");
  l.push("- [Pricing](/pricing)");
  l.push("- [Privacy](/privacy)");
  l.push("- [Terms](/terms)");
  l.push("- [About](/about)");
  l.push("");
  l.push("## Features");
  for (const f of FEATURES) {
    l.push(`- [${f.name}](/features/${f.slug}): ${f.tagline}`);
  }
  l.push("");
  l.push("## Blog");
  for (const p of posts) {
    l.push(`- [${p.title}](/blog/${p.slug}): ${p.description}`);
  }
  l.push("");
  l.push("## Guides");
  for (const g of GUIDES) {
    l.push(`- [${g.title}](${g.href}): ${g.desc}`);
  }
  l.push("");
  l.push("## Alternatives");
  for (const a of ALTERNATIVES) {
    l.push(`- [${a.title}](${a.href}): ${a.desc}`);
  }

  return new Response(l.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
