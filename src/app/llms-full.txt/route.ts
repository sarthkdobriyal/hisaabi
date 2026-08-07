import { getPost, readAllPosts } from "@/lib/posts";
import { FEATURES } from "@/lib/features";

export const revalidate = 3600;

export async function GET() {
  const posts = readAllPosts();
  const l: string[] = [];

  l.push("# Hisaabi");
  l.push("");
  l.push("> Chat your expenses. Keep your data.");
  l.push("");
  l.push("A free, privacy-first, **local-first** AI expense tracker. You log spending by chatting (\"spent 450 on groceries\"), and every record lives in your browser's IndexedDB. There is no server, no account, no cloud sync, and no telemetry. You bring your own AI API key — OpenAI, Anthropic, Gemini, Groq, or a fully offline local Ollama — and the only outbound request the app ever makes is your prompt to the provider you chose.");
  l.push("");
  l.push("Optional passcode lock encrypts the sensitive stores (expenses, income, profile, memories, chat) at rest with AES-256-GCM. The key is derived from your passcode via PBKDF2-HMAC-SHA256 at 600,000 iterations with a random salt, and is never stored. While locked, only ciphertext remains on the device; plaintext is wiped on lock, refresh and close. Auto-lock (default 15 minutes) seals the app when idle. A lost passcode means unrecoverable data by design — encrypted backups with the same passcode are supported.");
  l.push("");
  l.push("Target user: privacy-conscious individuals (India-first, INR default) who want to track spending without handing their financial data to a cloud service.");
  l.push("");

  // ---------------------------------------------------------------- features
  l.push("## Features");
  l.push("");
  for (const f of FEATURES) {
    l.push(`### ${f.name}`);
    l.push("");
    l.push(`${f.tagline} (URL: /features/${f.slug})`);
    l.push("");
    l.push(f.description);
    l.push("");
    for (const s of f.sections) {
      l.push(`**${s.h}**`);
      l.push("");
      for (const p of s.p) l.push(p);
      l.push("");
    }
    if (f.faqs.length) {
      l.push("FAQ:");
      for (const faq of f.faqs) {
        l.push(`- Q: ${faq.q}`);
        l.push(`  A: ${faq.a}`);
      }
      l.push("");
    }
  }

  // ---------------------------------------------------------------- blog
  l.push("## Blog");
  l.push("");
  for (const meta of posts) {
    const post = getPost(meta.slug);
    l.push(`### ${meta.title}`);
    l.push("");
    l.push(`- Published: ${meta.date} | Author: ${meta.author} | ${meta.readingTime} read`);
    l.push(`- Description: ${meta.description}`);
    l.push(`- URL: /blog/${meta.slug}`);
    l.push("");
    if (post) {
      l.push(post.content.trim());
      l.push("");
    }
  }

  // ---------------------------------------------------------------- guides
  l.push("## Guides");
  l.push("");
  l.push("- [Private expense tracking: keep your finances out of the cloud](/guides/private-expense-tracking) — A complete spending history is one of the most sensitive documents you own. Why cloud trackers are a bad home for it, how local-first apps fix the problem, and how to verify a privacy claim yourself (Network tab, accounts, open source).");
  l.push("- [What is an AI expense tracker?](/guides/ai-expense-tracker) — How chat-based AI expense tracking works: parsing, categorizing, and answering questions from your data; the privacy trade-offs; how to pick a tracker.");
  l.push("- [Budgeting with AI: budgets that actually hold](/guides/budgeting-with-ai) — Budgets fail because tracking is a chore. How AI budgeting automates logging and warns you before you overspend, not after.");
  l.push("- [How to track expenses in India: UPI, cash, and salary](/guides/track-expenses-in-india) — Indian spending spans UPI, cash and multiple accounts. A practical system for tracking in rupees from salary date to the kirana trip.");
  l.push("");

  // ---------------------------------------------------------------- vs
  l.push("## Alternatives & comparisons");
  l.push("");
  l.push("- [Mint alternative](/vs/mint-alternative) — Mint closed in 2024. A private, free replacement with no ad platform and no cloud.");
  l.push("- [Splitwise alternative](/vs/splitwise-alternative) — Splitwise is for splitting shared bills; Hisaabi tracks your own spending privately.");
  l.push("- [Notion expense tracker alternative](/vs/notion-expense-tracker) — Chat-first logging instead of templates and formulas to maintain.");
  l.push("- [Excel expense tracker alternative](/vs/excel-expense-tracker) — Log expenses like you'd text a friend instead of maintaining spreadsheet columns.");
  l.push("");

  // ---------------------------------------------------------------- product
  l.push("## Product details");
  l.push("");
  l.push("- **Pricing:** Free forever, open source. No subscription, no account. You bring an AI key and pay only your provider's usage (typically a few cents a month).");
  l.push("- **Privacy:** Data never leaves your device except the assembled prompt you send to your chosen AI provider when you chat — and nothing at all with local Ollama. The app loads zero third-party scripts on app routes. You can verify with your browser's Network tab.");
  l.push("- **Security:** Optional passcode lock (AES-256-GCM + PBKDF2, 600k iterations); API key stored locally and masked in the UI; JSON exports never include the API key; encrypted backups with the same passcode.");
  l.push("- **Tech:** Next.js 16 (App Router) + TypeScript strict, Tailwind CSS v4, Dexie.js (IndexedDB), Vercel AI SDK, Recharts, installable PWA.");
  l.push("- **Offline:** Installable PWA; app shell, dashboard, budgets and balances work offline. Chat works offline with a local Ollama model.");
  l.push("- **Open source:** GitHub at https://github.com/sarthkdobriyal/hisaabi");

  return new Response(l.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
