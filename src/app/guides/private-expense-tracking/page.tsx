import type { Metadata } from "next";
import { GuidePage } from "@/components/marketing/GuidePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/guides/private-expense-tracking",
  title: "Private Expense Tracking — Keep Your Finances Local",
  description:
    "Cloud trackers store your whole financial life on servers you don't control. Here's how private, local-first expense tracking works — and how to verify the privacy claim.",
});

const SECTIONS = [
  {
    h: "Why your spending is the most sensitive data you own",
    body: [
      "Your salary, your rent, your coffee habit, the subscription you forgot to cancel, the merchant you paid in a city you weren’t supposed to be in — a complete spending history is a detailed autobiography. It reveals income, lifestyle, habits, health purchases, and whereabouts. Credit history is regulated and protected; the raw, itemized version of your life is not.",
      "That asymmetry is why private expense tracking matters. Banks, insurers, and advertisers would all pay for the picture your tracker assembles. The question isn’t whether your data is valuable — it’s who ends up holding it.",
    ],
  },
  {
    h: "What “private” actually means in expense apps",
    body: [
      "Every tracker says it respects your privacy. The word is doing a lot of work. The meaningful question is architectural: where does your data physically live?",
      "A cloud tracker stores your expenses on servers operated by the company. Your privacy then depends on their database security, their employee access, their breach response, and their willingness not to share or sell what they hold. It also depends on the company surviving — when a free budget app shuts down, its data frequently becomes an asset to be monetized. This isn’t speculation; it has happened to some of the most popular trackers ever made.",
      "A local-first tracker stores nothing on a server, because there is no server. Expenses live in a database inside your browser. Privacy is not a policy the company promises to honor — it’s an architecture that makes it impossible for them to have your data in the first place.",
    ],
  },
  {
    h: "The one request every local tracker makes",
    body: [
      "Local-first isn’t “never sends anything,” and honest apps will say so. The single outbound request in a private AI tracker is the prompt you send to your chosen AI provider when you chat — your message plus the small summary of your data needed to answer it. That request goes directly from your browser to the provider you configured, using your own key. It does not pass through the tracker’s servers. And with a fully local model like Ollama, even that request never leaves your device.",
      "This is the honest version of the claim. When a privacy page says “your data never leaves your browser,” the truthful wording is “nothing leaves your device except the prompt you send to your own AI provider — and nothing at all with a local model.” A tool that refuses to state exactly what leaves is a tool hiding something.",
    ],
    list: [
      "Cloud tracker: your data lives on their servers. Privacy is a policy.",
      "Local tracker: your data lives in your browser. Privacy is an architecture.",
      "Local + your own AI key: the only request is your prompt to your provider.",
      "Local + Ollama: nothing leaves your machine, ever.",
    ],
  },
  {
    h: "How to verify a privacy claim",
    body: [
      "You don’t have to take anyone’s word for it. Three checks take minutes and settle the question.",
      "First, open the developer tools in your browser and watch the Network tab while using the app. A genuinely local tracker will show almost nothing leaving — and for a chat app, exactly one request to your AI provider. Second, look for an account system. Accounts require a database, and a database is a server. Zero-account apps are the only ones with nothing to compromise. Third, read the source. An open-source tracker lets anyone confirm the app isn’t phoning home — “trust us” becomes “read the code.”",
      "Combined, those checks move privacy from marketing to measurement. If an app fails any of them, you know exactly where it stands.",
    ],
  },
  {
    h: "Who should care most",
    body: [
      "Private tracking isn’t for the paranoid — it’s for anyone whose spending picture would be inconvenient in the wrong hands. Freelancers whose income varies and is easy to map. People with health-related spending. Anyone in a relationship, a family, or a workplace where money is sensitive. And people in countries where the data-privacy laws are weaker than the tech companies holding their data are powerful.",
      "There’s also the quieter reason: control. A private tracker returns ownership of your financial story to you. That feels different from a convenience store holding your records, even if nothing ever goes wrong.",
    ],
  },
  {
    h: "Getting started with local-first tracking",
    body: [
      "Start with a tool built local-first — Hisaabi is one: free, open source, no account, data in your browser, your own AI key. Set it up, log your next purchase as a sentence, and then do the Network-tab test yourself. Watch the only request that ever leaves point at the AI provider you chose.",
      "That’s the entire philosophy in one session: a tracker that keeps your money’s story where your money actually is — with you.",
    ],
  },
];

const RELATED = [
  { title: "AI expense tracker", href: "/guides/ai-expense-tracker", body: "How chat-based tracking works, and what to trust." },
  { title: "Track expenses in India", href: "/guides/track-expenses-in-india", body: "UPI, cash and bank — tracking in the Indian context." },
  { title: "Budgeting with AI", href: "/guides/budgeting-with-ai", body: "Budgets that hold, watched by an AI you control." },
];

export default function PrivateExpenseTrackingGuide() {
  return (
    <GuidePage
      eyebrow="Guide"
      title="Private expense tracking: keep your finances out of the cloud"
      description="A complete spending history is one of the most sensitive documents you own. Here’s why cloud trackers are a bad home for it, how local-first apps fix the problem, and how to verify the privacy claim yourself."
      updated="August 6, 2026"
      path="/guides/private-expense-tracking"
      sections={SECTIONS}
      related={RELATED}
      cta={{
        title: "Keep your money’s story with you",
        body: "Hisaabi is a private, local-first expense tracker. No account, no cloud, your own AI key — verify it in the Network tab.",
      }}
    />
  );
}
