import type { Metadata } from "next";
import { GuidePage } from "@/components/marketing/GuidePage";

export const metadata: Metadata = {
  title: "What Is an AI Expense Tracker & Why You Need One",
  description:
    "AI expense trackers log your spending from chat and answer questions about your money. Learn how they work, the privacy trade-offs, and how to pick one.",
};

const SECTIONS = [
  {
    h: "What is an AI expense tracker?",
    body: [
      "An AI expense tracker is an app that records your spending using natural language instead of forms. You type “spent 450 on groceries” and the app understands the amount, the category, and the date, logs it, and moves on. The same engine can answer questions about your money: “how much did I spend on food this month?” returns a real total computed from your data.",
      "Traditional expense trackers are database front-ends. You learn the form: pick a date, type an amount, choose a category from a dropdown, add a note. Every entry is six interactions. AI trackers collapse those six interactions into one sentence — and they do it well enough that you’ll actually keep using the app, which is the entire point.",
    ],
  },
  {
    h: "Why chat beats forms",
    body: [
      "Budgeting apps fail for one reason: people stop using them. Chat removes the friction that makes entry feel like data-entry work. You already know how to describe a purchase — you do it every time you tell someone about your day. The tracker just needs to meet you at that level.",
      "Consider the mental cost. With a form, every expense is a small administrative task: open the app, find the right screen, fill four fields, save. With chat, it’s one sentence at the moment you spend. Apps that let you record expenses in under five seconds get used after the first week; apps that don’t get abandoned. That single difference matters more than any feature list.",
    ],
  },
  {
    h: "What the AI actually does",
    body: [
      "An AI expense tracker does three jobs, and it’s worth knowing each so you understand what you can trust and what you should verify.",
      "First, parsing. The model reads a sentence and extracts a structured expense: amount, category, date, and payment method. This is where natural language shines — “spent 200 on coffee yesterday” and “paid the wifi bill today, 800 from bank” both become clean records. Second, categorization. The model assigns a category and asks before inventing a new one, so your data stays consistent without locking you into a fixed list. Third, answers. Because the app computes summaries from your actual records, you can ask questions about your own spending and get answers grounded in your data rather than guesses.",
    ],
    list: [
      "Parsing: turns “spent 200 on coffee” into a structured record.",
      "Categorizing: sorts entries automatically and asks before creating new categories.",
      "Answering: “how much on food this month?” returns a real total from your records.",
    ],
  },
  {
    h: "The privacy question: cloud vs local",
    body: [
      "Here is the trade-off most “AI expense tracker” roundups won’t spell out. Cloud trackers read your transactions, run them through their servers, and store the result — which means your entire financial picture exists on someone else’s infrastructure. Some monetize that data or use it to train models. The convenience is real; so is the exposure.",
      "A local-first tracker flips the architecture. Everything lives in your browser — expenses, income, budgets, chat history — in a local database like IndexedDB. There is no account, no server, and no sync. The only outbound request is the prompt you send to the AI provider you configured, using your own key. With a local model like Ollama, even that never leaves your machine.",
      "That distinction is the whole product for privacy-sensitive people. A tracker that “promises” privacy on a cloud backend is a marketing claim you can’t verify. A tracker that has no backend is a privacy guarantee you can audit.",
    ],
  },
  {
    h: "How to choose an AI expense tracker",
    body: [
      "The category is young and crowded, so filter on fundamentals before features.",
    ],
    list: [
      "Where is your data stored? If the answer is “their servers,” read what they do with it — and what happens if they shut down (see: every free budget app that sold your data or sunset).",
      "Is there an account? Accounts mean a database somewhere. If privacy matters, look for zero-account apps.",
      "Does it work offline? Your spending happens offline too. A tracker that needs a connection to log a coffee is a tracker you’ll skip at the counter.",
      "Does it confirm before writing? AI parses imperfectly. Good apps show you an approval card and let you undo — never silently commit.",
      "Is it open source? With financial data, open source lets you verify the privacy claim instead of trusting it.",
      "Can you export? Your data should never be trapped. Export is the minimum.",
    ],
  },
  {
    h: "Common mistakes when starting",
    body: [
      "Most people fail at expense tracking in the same few ways, and they’re all avoidable. First, over-engineering the categories. You don’t need thirty categories; ten covers 95% of spending. Let the tracker auto-categorize and merge later. Second, waiting until the end of the month to “catch up.” The point of chat entry is logging at the moment of spending — a five-second habit. Backfills breed guilt and die.",
      "Third, obsessing over the past. Don’t spend a week importing old transactions; start today and let the picture grow forward. Fourth, ignoring budgets until the overrun. Set rough monthly limits for your biggest categories up front, and the tracker will tell you before you blow them, not after.",
      "The consistent habit is worth more than perfect records. A tracker that’s easy enough to use daily beats a powerful one you open monthly.",
    ],
  },
  {
    h: "Getting started today",
    body: [
      "You don’t need to research for a month. Pick a local-first tracker (Hisaabi is one — free, open source, your own AI key), connect a provider, and log your next purchase as a sentence. Add your two biggest categories’ budgets, set your salary date, and let it run for two weeks.",
      "At the end of those two weeks you’ll have a small, honest picture of where your money goes — which is more than most people have. From there, tracking stops being a chore and starts being a mirror.",
    ],
  },
];

const RELATED = [
  { title: "Private expense tracking", href: "/guides/private-expense-tracking", body: "Why local-first apps beat cloud trackers for your money." },
  { title: "Budgeting with AI", href: "/guides/budgeting-with-ai", body: "Set budgets that hold, with an AI that watches them." },
  { title: "Track expenses in India", href: "/guides/track-expenses-in-india", body: "INR, UPI, cash and bank — tracking in the Indian context." },
];

export default function AiExpenseTrackerGuide() {
  return (
    <GuidePage
      eyebrow="Guide"
      title="What is an AI expense tracker — and why you need one"
      description="AI expense trackers turn “spent 450 on groceries” into a categorized record, and answer questions about your spending from your own data. Here’s how they work, the privacy trade-offs, and how to pick the right one."
      updated="August 6, 2026"
      sections={SECTIONS}
      related={RELATED}
      cta={{
        title: "Try it on your next purchase",
        body: "Hisaabi is a free, local-first AI expense tracker. No account, no cloud, your own AI key.",
      }}
    />
  );
}
