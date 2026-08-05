import type { Metadata } from "next";
import { VsPage } from "@/components/marketing/VsPage";

export const metadata: Metadata = {
  title: "Splitwise Alternative for Personal Expenses",
  description:
    "Splitwise is great at splitting bills — less so at private tracking. Hisaabi is a free, local-first expense tracker for your own spending, with AI chat entry.",
};

const TABLE = [
  { feature: "Price", hisaabi: "$0, forever", them: "Free tier + premium subscription" },
  { feature: "Account required", hisaabi: "No", them: "Yes" },
  { feature: "Your personal spending", hisaabi: "Private, on-device", them: "Stored on their servers" },
  { feature: "Bill splitting", hisaabi: "Not built in", them: "Best in class" },
  { feature: "Data storage", hisaabi: "Your browser only", them: "Cloud" },
  { feature: "AI chat entry", hisaabi: "Yes", them: "No" },
  { feature: "Offline", hisaabi: "Full PWA", them: "Requires internet" },
];

const SWITCH = [
  {
    title: "Keep the splits, track the rest privately",
    body: "Use Splitwise for the trip — and Hisaabi for your real budget. Group debts are a social feature; your day-to-day spending is private and should be.",
  },
  {
    title: "Your whole budget, not just shared debts",
    body: "Splitwise shows you who owes whom. It won’t tell you you’re overspending on food. Hisaabi tracks everything you buy, and answers questions about it.",
  },
  {
    title: "No subscription for your own money",
    body: "Splitwise’s premium tier unlocks features. Hisaabi has one tier: free, forever, with no data to sell.",
  },
  {
    title: "Log in two seconds",
    body: "No friend graph, no account setup, no social feed. Open it and say what you spent.",
  },
];

const FAQS = [
  {
    q: "Does Hisaabi split bills?",
    a: "No. Hisaabi tracks your own spending; it doesn’t settle shared debts. If you and friends split rent or dinners, keep Splitwise for that and pair it with Hisaabi for your personal budget.",
  },
  {
    q: "Why would I use both?",
    a: "They do different jobs. Splitwise settles group debts; Hisaabi builds a private picture of your finances. Many people use Splitwise for trips and a real tracker for life.",
  },
  {
    q: "Can I see who owes me money?",
    a: "No — that’s a bill-splitting feature Hisaabi intentionally doesn’t have. If that’s your need, Splitwise or similar remains the right tool.",
  },
];

export default function SplitwiseAlternativePage() {
  return (
    <VsPage
      competitor="Splitwise"
      heroTitle="A Splitwise alternative for the part it doesn’t cover"
      heroBody="Splitwise is the best bill-splitter there is. But it’s a social tool, not a private budget. Hisaabi tracks your own spending — offline, on your device, with AI chat entry."
      table={TABLE}
      switchTitle="Why pair Hisaabi with Splitwise"
      switchPoints={SWITCH}
      faqs={FAQS}
      conclusion="Split the bills there. Track the money here."
    />
  );
}
