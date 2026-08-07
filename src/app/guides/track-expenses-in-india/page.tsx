import type { Metadata } from "next";
import { GuidePage } from "@/components/marketing/GuidePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/guides/track-expenses-in-india",
  title: "How to Track Expenses in India (INR, UPI, Cash)",
  description:
    "Track expenses in India with UPI, cash, and bank all accounted for. A practical guide to INR budgeting, salary-based planning, and an expense tracker built for it.",
});

const SECTIONS = [
  {
    h: "Why tracking in India is different",
    body: [
      "Indian spending doesn’t fit the template most finance apps were designed for. Money moves across UPI, cash, and multiple bank accounts; salaries arrive at varied dates; and a large share of daily life — auto rickshaws, the corner kirana, cash for the domestic help — happens entirely in cash that a bank statement never sees. Any tracker that only reads a linked bank account captures a fraction of the real picture.",
      "That’s the case for a tracker that starts from what you actually spend, wherever you spend it — which is exactly what a chat-based expense tracker does. You type the expense as it happens, in rupees, and it’s logged regardless of whether it left a UPI app or your wallet.",
    ],
  },
  {
    h: "Build a budget around your salary, not a calendar",
    body: [
      "The classic budget starts on the 1st and ends on the 30th. In India, income often lands on a salary date that doesn’t align with the month — the 5th, the 10th, or whenever your company’s payroll cycle lands. A monthly budget that ignores your salary date is a budget built on a calendar fiction.",
      "A tracker that supports a salary date lets you plan from payday to payday instead. Set your salary amount and date once; the app knows when it should have landed and reminds you if it hasn’t. Then allocate across the period: rent, groceries, transport, EMIs, discretionary. This matches how money actually flows in an Indian household — big inflows on a fixed date, constant small outflows in between.",
    ],
  },
  {
    h: "Account for cash — seriously",
    body: [
      "The single biggest gap in most expense tracking is cash. UPI and cards leave a digital trail; cash doesn’t. If your tracker only counts what your bank statement shows, your kirana trips, chai, vegetables, and petty cash vanish from the record. For many people that’s 30-40% of monthly spend simply missing — which makes every “insight” the tracker produces wrong.",
      "The fix is tracking both pockets. Keep a cash balance and a bank balance, and record which one each expense came from. “Paid the plumber 800 cash” and “spent 200 on groceries via UPI” should land in the same ledger but different balances. It’s a small discipline that makes your budget honest instead of optimistic.",
    ],
  },
  {
    h: "The UPI habit is already training you",
    body: [
      "Here’s the good news: you already narrate your spending. Every UPI payment is a sentence — “sent ₹250 to Vijay for lunch.” The mental model people already use for UPI transfers is exactly the natural-language model a chat expense tracker uses. You’re not learning a new skill; you’re pointing an existing one at your own records.",
      "“Paid 800 electricity bill today.” “Spent 120 on chai and snacks this week.” “Got my salary 80k.” Each is a complete expense or income entry with zero form-filling. The habit that makes UPI feel effortless is the habit that makes tracking effortless.",
    ],
  },
  {
    h: "Set goals that matter for Indian money",
    body: [
      "Generic budgeting advice — “save 20%” — is worse than useless when EMIs, school fees, and family obligations carve up your salary before you see it. A tracker works better when it mirrors your real obligations: recurring bills (rent, internet, insurance, subscriptions) and real goals (a travel fund, a down payment, a safety net).",
      "List the recurring bills once and the app reminds you when each is due. Set budget limits per category and get a warning before you cross them, not after. Track goals as actual numbers with progress. None of this requires a financial planner — it requires a record that reflects how your money actually moves.",
    ],
  },
  {
    h: "Get started: a two-week plan",
    body: [
      "Week one: set up your salary date and amount, add your recurring bills, and log every expense for seven days as you spend it — cash and UPI both. Don’t try to fix anything yet; just build the record. Week two: add budget limits for your top three categories, and watch where you actually land.",
      "At the end of two weeks you’ll have something most people never have: an honest answer to “where does my money go?” — in rupees, from your real spending, not a bank statement’s partial view. From there, tracking in India stops being a chore and starts being your financial mirror.",
    ],
  },
];

const RELATED = [
  { title: "AI expense tracker", href: "/guides/ai-expense-tracker", body: "What chat-based tracking does — and what to trust." },
  { title: "Private expense tracking", href: "/guides/private-expense-tracking", body: "Why local-first apps beat cloud trackers." },
  { title: "Budgeting with AI", href: "/guides/budgeting-with-ai", body: "Budgets that hold, watched by an AI you control." },
];

export default function TrackExpensesInIndiaGuide() {
  return (
    <GuidePage
      eyebrow="Guide"
      title="How to track expenses in India: UPI, cash, and salary"
      description="Indian spending spans UPI, cash, and multiple accounts — and most trackers only see a fraction. Here’s a practical system for tracking in rupees, from salary date to the kirana trip."
      updated="August 6, 2026"
      path="/guides/track-expenses-in-india"
      sections={SECTIONS}
      related={RELATED}
      cta={{
        title: "Track your next UPI payment",
        body: "Hisaabi is a free, local-first expense tracker built for INR — no account, no cloud, your own AI key.",
      }}
    />
  );
}
