import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// Single source of truth for the per-feature pages under /features/<slug>.
// Every feature page is interlinked with the others and carries its own
// canonical/OG/Twitter metadata + FAQPage schema (see FeaturePage.tsx).

export type FeatureSection = { h: string; p: string[] };

export type Feature = {
  slug: string;
  name: string;
  tagline: string;
  description: string; // ≤155 chars, used for the meta description
  sections: FeatureSection[];
  faqs: { q: string; a: string }[];
  related: string[]; // other feature slugs
};

export const FEATURES: Feature[] = [
  {
    slug: "chat-expense-logging",
    name: "Chat to record expenses",
    tagline: "Log spending by typing a sentence, the way you'd text a friend.",
    description:
      "Log expenses by chatting: 'spent 450 on groceries' saves and categorizes it instantly. No forms, no dropdowns, no category pickers.",
    sections: [
      {
        h: "The fastest way to record a purchase",
        p: [
          "Every expense tracker solves the same problem twice: it has to capture a purchase, and it has to do it fast enough that you actually keep doing it. Forms fail at the second part. By the time you've opened the app, found the right menu, and filled four fields, the habit is already dead.",
          "Chat removes the friction. You type what you'd say anyway: 'spent 200 on coffee', 'paid 800 for the electric bill', 'gave 500 cash to mom'. The app reads the sentence, pulls out the amount, category, date and payment method, and shows you a confirmation card before saving anything.",
        ],
      },
      {
        h: "Understands how people actually talk about money",
        p: [
          "The parser handles real-world phrasing: 'yesterday', 'last week', 'UPI', 'cash', amount in words or digits. If something is ambiguous — you say 'spent 500' without saying what on — it asks instead of guessing.",
          "Every entry is confirmed with a card you approve or undo in one tap, so chat speed never comes at the cost of accuracy. Everything stays on your device; the AI only needs your own key.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does chat work without an AI key?",
        a: "Chat needs your AI provider (OpenAI, Anthropic, Gemini, Groq, or a local Ollama). With a local Ollama model, chat works fully offline.",
      },
      {
        q: "What happens if the AI parses something wrong?",
        a: "You approve every entry from a confirmation card before it's saved, and anything you save can be edited or undone instantly.",
      },
    ],
    related: ["auto-categorization", "spending-insights", "cash-and-bank-balances"],
  },
  {
    slug: "auto-categorization",
    name: "Automatic categorization",
    tagline: "Every expense sorted into the right category — and asked about before inventing a new one.",
    description:
      "Auto-categorization sorts every expense the moment you log it. Categories stay clean, budgets stay accurate, and nothing is guessed.",
    sections: [
      {
        h: "A tidy ledger without the upkeep",
        p: [
          "Manual trackers quietly fall apart at the categorizing step, because nobody wants to pick from a dropdown forty times a month. Auto-categorization removes the decision: the AI reads the merchant and amount and places the expense where it belongs.",
          "The default set covers the categories that matter — food, groceries, transport, rent, shopping, entertainment, health and more — and you can add your own.",
        ],
      },
      {
        h: "It asks before inventing",
        p: [
          "When something genuinely doesn't fit, the tracker asks you rather than silently creating a junk category. That keeps your categories stable and your monthly category totals trustworthy.",
          "Because categories are consistent, budgets, trends and the 'vs last month' comparisons on the dashboard all stay meaningful.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I fix a wrong category?",
        a: "Yes. Edit any expense and change its category from the Expenses page or dashboard; the dashboard and budgets update immediately.",
      },
      {
        q: "Can I add my own categories?",
        a: "Yes — add custom categories in Settings, and budgets can be set per category including your custom ones.",
      },
    ],
    related: ["chat-expense-logging", "budgets-and-goals", "spending-insights"],
  },
  {
    slug: "spending-insights",
    name: "Ask about your spending",
    tagline: "Chat doubles as your reporting tool: 'how much did I spend on food this month?'",
    description:
      "Ask questions about your money in plain language and get real answers computed from your own local data — never a guess.",
    sections: [
      {
        h: "Reports you never have to build",
        p: [
          "Instead of clicking through charts, ask: 'how much did I spend on food this month?', 'what was my biggest category in June?', 'how did spending compare to last month?' The answers are computed from your actual data, which stays on your device.",
          "The dashboard shows the same numbers visually — monthly totals, category breakdowns, and a multi-month trend — so chat and dashboard agree, because they read from the same local database.",
        ],
      },
      {
        h: "Answers from your data, not guesses",
        p: [
          "The assistant works over aggregates, not raw rows: it sums, groups and compares your own records. Your full transaction history is never needed or sent anywhere for an answer to make sense.",
          "With a local model like Ollama, even the summarization happens on your machine.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does the AI need to see all my transactions?",
        a: "No. Questions are answered from computed totals and category summaries, not raw rows. Only the prompt you choose to send goes to your provider.",
      },
      {
        q: "Are insights available offline?",
        a: "The dashboard is fully offline. Chat insights need a connection to your AI provider, unless you run Ollama locally.",
      },
    ],
    related: ["budgets-and-goals", "auto-categorization", "chat-expense-logging"],
  },
  {
    slug: "budgets-and-goals",
    name: "Budgets & goals",
    tagline: "Monthly limits per category with live rollups and early warnings.",
    description:
      "Set monthly budgets per category and watch a live rollup, with alerts when a category is trending over before the month ends.",
    sections: [
      {
        h: "Budgets that tell you early",
        p: [
          "Set a limit per category and the dashboard shows a live progress bar against it. When you're heading over mid-month, you see it while there's still time to adjust — not in a month-end surprise.",
          "Budgets are stored in your profile, so the AI also knows your limits when you ask about spending.",
        ],
      },
      {
        h: "Goals, not guilt",
        p: [
          "The point of a budget is a target to aim at, not a verdict on your month. Category limits, a savings view, and month-over-month deltas give you the steering, not the lecture.",
          "Everything is local: limits, progress and alerts are computed in your browser.",
        ],
      },
    ],
    faqs: [
      {
        q: "What happens when I exceed a budget?",
        a: "The dashboard highlights the overage and the chat can tell you exactly where you stand. Nothing blocks spending — budgets inform, they don't judge.",
      },
      {
        q: "Are budgets per month?",
        a: "Yes, limits reset monthly and compare against the current month's spending.",
      },
    ],
    related: ["spending-insights", "auto-categorization", "bills-and-salary-reminders"],
  },
  {
    slug: "bills-and-salary-reminders",
    name: "Bills & salary reminders",
    tagline: "Reminders when a recurring bill is due or your salary should have landed — confirm in a tap.",
    description:
      "Recurring bills and salary reminders: tell Hisaabi when rent is due and when payday lands, and confirm each one in a tap.",
    sections: [
      {
        h: "Bills that remind you, not the other way around",
        p: [
          "Add monthly bills in Settings — rent, internet, subscriptions — and on the due day the app asks 'was it deducted?'. One tap logs the expense. No entry forms, no missed months.",
          "Similarly, on your salary day it asks whether the credit landed and records it as income in a tap.",
        ],
      },
      {
        h: "Fits how Indian pay cycles work",
        p: [
          "Salary dates vary, and monthly budgets usually ignore when money actually arrives. The reminders anchor to your real salary date, so balances and budgets line up with how money actually moves.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I change the due day?",
        a: "Yes — each bill and your salary date are editable in Settings at any time.",
      },
      {
        q: "Does this need the internet?",
        a: "No. Reminders are computed locally from your stored profile.",
      },
    ],
    related: ["cash-and-bank-balances", "budgets-and-goals", "chat-expense-logging"],
  },
  {
    slug: "cash-and-bank-balances",
    name: "Cash & bank balances",
    tagline: "Track cash and bank money separately, with running balances that adjust as you log.",
    description:
      "Track cash and bank balances separately. Expenses default to the bank account unless you say cash, and running balances update automatically.",
    sections: [
      {
        h: "Two balances, one honest picture",
        p: [
          "UPI and card purchases leave a digital trail; cash doesn't. That's why budgets silently break for people who pay cash. Tracking cash and bank separately means the gap in the middle — the money that moved without a UPI record — stops hiding from your budget.",
          "Set starting balances once, and every logged expense or income adjusts the right balance automatically.",
        ],
      },
      {
        h: "Say when it's cash",
        p: [
          "Expenses default to the bank account (UPI/card). When you pay cash, just say so: 'spent 200 cash on coffee'. The right balance moves, and your totals stay truthful.",
        ],
      },
    ],
    faqs: [
      {
        q: "Why do my balances not match my bank?",
        a: "Balances only move when you log money in or out. Any transfer you don't log (an old loan repaid, a gift) creates a gap — log both sides to keep them aligned.",
      },
      {
        q: "Can I adjust a balance manually?",
        a: "Yes, you can correct cash or bank balances directly on the dashboard.",
      },
    ],
    related: ["bills-and-salary-reminders", "chat-expense-logging", "budgets-and-goals"],
  },
  {
    slug: "offline-pwa",
    name: "Offline PWA",
    tagline: "Log and review spending with no internet. Your data doesn't need a connection to be yours.",
    description:
      "Hisaabi is an installable PWA whose app shell works offline — log expenses, check the dashboard and budgets without a connection.",
    sections: [
      {
        h: "Offline by architecture, not accident",
        p: [
          "Because your data lives in the browser, it's readable with zero connectivity. The app shell, the dashboard, budgets, expenses and balances all work on a flight, in a lift, or anywhere with no signal.",
          "Chat needs a network only to reach your AI provider — and with a local Ollama model, even chat works offline.",
        ],
      },
      {
        h: "An app, without an app store",
        p: [
          "A PWA (Progressive Web App) installs to your home screen like a native app — icon, standalone window, no store submission, no account. The offline shell is what makes a 'local-first' tracker genuinely yours to keep.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does offline logging sync later?",
        a: "There's no sync — there's no server. Everything you log offline is already exactly where it belongs: in your browser.",
      },
      {
        q: "Which devices support it?",
        a: "Android, iOS and desktop browsers that support PWAs, including 'Add to Home Screen' flows.",
      },
    ],
    related: ["installable-app", "private-by-design", "export-and-backups"],
  },
  {
    slug: "installable-app",
    name: "Installable app",
    tagline: "Add Hisaabi to your home screen and use it like a native app.",
    description:
      "Install Hisaabi like a native app from your browser — home-screen icon, standalone window, fast launch, no store or account required.",
    sections: [
      {
        h: "Feels native, stays local",
        p: [
          "With a proper manifest and app icons, Hisaabi installs to your phone's or desktop's home screen and launches in its own window. No app store, no permissions wall, no account creation.",
          "Installed apps launch faster and behave like the rest of your phone's apps, which makes the tracking habit easier to keep.",
        ],
      },
      {
        h: "The install prompt appears when it should",
        p: [
          "The app offers an install prompt once the browser supports it, and the header shows an 'Install app' action when available. Everything you install lives entirely on your device.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I install it?",
        a: "Open the app, tap 'Install app' in the menu when it appears, and confirm. Or use your browser's 'Add to Home Screen' option.",
      },
      {
        q: "Is it on the Play Store or App Store?",
        a: "No. It's a PWA, so you install it straight from the browser — which is also what keeps it free, open and serverless.",
      },
    ],
    related: ["offline-pwa", "private-by-design", "export-and-backups"],
  },
  {
    slug: "private-by-design",
    name: "Private by design",
    tagline: "No account, no server, no cloud sync. Privacy is the architecture, not a promise.",
    description:
      "Private by design: every expense lives in your browser. No account, no server, no cloud — nothing for anyone to leak.",
    sections: [
      {
        h: "No server means nothing to leak",
        p: [
          "Most finance apps copy your spending to their servers, where it feeds profiles, loan models and breach lists. Hisaabi has no servers at all. There is no company database holding your expenses, because there is no database to hold them in.",
          "The only outbound request the app ever makes is your prompt to your chosen AI provider when you chat — with your key. With local Ollama, nothing leaves at all.",
        ],
      },
      {
        h: "Prove it, don't promise it",
        p: [
          "Open the app, open your browser's Network tab, and watch. The only requests you'll see go to the AI provider you configured. The code is open source, so the claim is auditable line by line. Privacy isn't a policy you trust — it's a design you can verify.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do I need an account?",
        a: "No. There's no signup, no login, no email. Open the app and start tracking.",
      },
      {
        q: "Can you see my data?",
        a: "No. Data lives in your browser and never reaches a Hisaabi server — because none exist.",
      },
    ],
    related: ["encryption-at-rest", "offline-pwa", "export-and-backups"],
  },
  {
    slug: "encryption-at-rest",
    name: "Encryption at rest",
    tagline: "A passcode seals your data with AES-256 encryption whenever the app is locked.",
    description:
      "Optional passcode lock encrypts your expenses, income and chat with AES-256-GCM and PBKDF2. When locked, only ciphertext remains.",
    sections: [
      {
        h: "A sealed safe in your pocket",
        p: [
          "With the passcode lock enabled, your financial data is encrypted at rest with AES-256-GCM, and the key is derived from your passcode via PBKDF2 at 600,000 iterations. The key is never stored — it exists only in memory while you're unlocked.",
          "When the app is locked, the plaintext copies are wiped; the only thing on disk is unreadable ciphertext. Auto-lock seals the app after a few idle minutes.",
        ],
      },
      {
        h: "Honest about what it protects",
        p: [
          "Encryption protects data at rest — a lost phone, a copied browser profile, someone picking up your locked device. It doesn't protect against someone using your already-unlocked browser or a weak passcode. We say so plainly, because a security claim you can't verify is just marketing.",
        ],
      },
    ],
    faqs: [
      {
        q: "What happens if I forget my passcode?",
        a: "The data stays encrypted and can't be recovered — by design, there's no backdoor. Keep an encrypted backup (same passcode) exported to stay safe.",
      },
      {
        q: "Can I turn it off?",
        a: "Yes, disable encryption from Settings whenever you like. Data stays on your device either way.",
      },
    ],
    related: ["private-by-design", "export-and-backups", "offline-pwa"],
  },
  {
    slug: "export-and-backups",
    name: "Export, import & backups",
    tagline: "Your data is yours: full JSON export, CSV, encrypted backups, and one-click restore.",
    description:
      "Export everything as JSON or CSV, keep encrypted backups with your passcode, and restore on any device. Your data is always yours.",
    sections: [
      {
        h: "Data you can always take with you",
        p: [
          "Export your complete data as JSON, or expenses as CSV, from Settings — one click, no account, no requests. Backups can be plain JSON or encrypted with your passcode, so a backup is exactly as private as your device.",
          "Import restores everything on any browser, making backups the portability story that cloud sync usually claims but local-first actually delivers.",
        ],
      },
      {
        h: "Built for durability",
        p: [
          "Local data survives as long as your browser does — which is why backups matter. Export before clearing browser data, and keep an encrypted backup somewhere safe alongside your passcode.",
          "JSON exports never include your API key, so a backup file is safe to share or store.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does export include my API key?",
        a: "No. JSON backups deliberately strip the API key to keep backups safe to store or share.",
      },
      {
        q: "Can I move to another device?",
        a: "Yes — export, open Hisaabi on the new device, and import. With encryption enabled, use an encrypted backup and your passcode.",
      },
    ],
    related: ["private-by-design", "encryption-at-rest", "offline-pwa"],
  },
  {
    slug: "bring-your-own-ai",
    name: "Bring your own AI",
    tagline: "OpenAI, Anthropic, Gemini, Groq — or fully offline with local Ollama. Your key, your choice.",
    description:
      "Bring your own AI key: OpenAI, Claude, Gemini, Groq, or a fully offline Ollama setup. Your key, your provider, your choice.",
    sections: [
      {
        h: "The AI is yours, not a hidden cost",
        p: [
          "Instead of bundling an AI service (and, inevitably, your data) into the product, Hisaabi lets you connect your own provider. You pay only your provider's usage — typically a few cents a month — and the key stays in your browser.",
          "The app supports OpenAI, Anthropic, Google Gemini, Groq, and any OpenAI-compatible endpoint. Switch anytime from Settings.",
        ],
      },
      {
        h: "Local-first even for the AI",
        p: [
          "With Ollama running on your machine, the entire experience — chat included — works offline. No request ever leaves your device, which makes this the most private configuration possible: local storage plus a local model.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do I have to pay for AI?",
        a: "You bring a key and pay your provider's usage, usually pennies a month. The app itself is free and open source.",
      },
      {
        q: "Can I use it with no AI at all?",
        a: "Logging, dashboards, budgets and balances all work without AI. Chat needs a provider — or run Ollama locally.",
      },
    ],
    related: ["chat-expense-logging", "private-by-design", "spending-insights"],
  },
];

export function getFeature(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}

export function relatedFeatures(feature: Feature): Feature[] {
  return feature.related
    .map((s) => getFeature(s))
    .filter((f): f is Feature => Boolean(f));
}

export function featureMetadata(feature: Feature): Metadata {
  return pageMetadata({
    path: `/features/${feature.slug}`,
    title: feature.name,
    description: feature.description,
  });
}
