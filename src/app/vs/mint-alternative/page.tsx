import type { Metadata } from "next";
import { VsPage } from "@/components/marketing/VsPage";

export const metadata: Metadata = {
  title: "Mint Alternative — Private Expense Tracker",
  description:
    "Looking for a Mint replacement? Hisaabi is a free, private expense tracker with AI chat — no account, no ads, no data to sell. Import your habit, not your history.",
};

const TABLE = [
  { feature: "Price", hisaabi: "$0, forever", them: "Shut down (2024)" },
  { feature: "Account required", hisaabi: "No", them: "Yes" },
  { feature: "Data storage", hisaabi: "Your browser only", them: "Cloud servers" },
  { feature: "Ads / monetization", hisaabi: "None — nothing to sell", them: "Ad platform & data use" },
  { feature: "Offline", hisaabi: "Full PWA", them: "Requires internet" },
  { feature: "Entry method", hisaabi: "Chat, in plain language", them: "Manual categories" },
  { feature: "Open source", hisaabi: "Yes", them: "No" },
];

const SWITCH = [
  {
    title: "You’re not chasing another shutdown",
    body: "Mint closed in 2024 and pushed users to a credit app. Hisaabi runs on your device — there’s no service to kill, so it keeps working as long as you keep it.",
  },
  {
    title: "Your budget is yours again",
    body: "Mint’s model traded your financial picture for ads. Hisaabi has no ads and no data to sell, because nothing ever leaves your browser.",
  },
  {
    title: "No forms, just text",
    body: "“Spent 300 on petrol” logs and categorizes it instantly. Rebuilding a Mint workflow took hours; switching to chat takes a minute.",
  },
  {
    title: "Free means free",
    body: "No upsell to a paid tier, no credit-card cross-sell. Just a tracker that works, with your own AI key if you want chat.",
  },
];

const FAQS = [
  {
    q: "Can I import my Mint data?",
    a: "Not automatically. Mint’s export format is a CSV you can review. Hisaabi is chat-first, so starting fresh is fast — but if you have a spreadsheet you love, you can keep using that flow for past data.",
  },
  {
    q: "Does Hisaabi connect to my bank?",
    a: "No. Mint read your transactions automatically; that requires a server and access to your accounts. Hisaabi is local-first, so you record spending by chatting or entering it — nothing can reach your bank.",
  },
  {
    q: "What if my AI provider is down?",
    a: "Chat needs a connection to your provider, but logging works either way. With a local Ollama setup, the entire app — chat included — works offline.",
  },
];

export default function MintAlternativePage() {
  return (
    <VsPage
      competitor="Mint"
      heroTitle="The private Mint alternative"
      heroBody="Mint is gone — and it took your data with it. Hisaabi gives you the same tracking habits with none of the ad platform, none of the account, and none of the cloud."
      table={TABLE}
      switchTitle="Why switch from Mint to Hisaabi"
      switchPoints={SWITCH}
      faqs={FAQS}
      conclusion="Skip the next Mint. Track where the last one kept your data."
    />
  );
}
