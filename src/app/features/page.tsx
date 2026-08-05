import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageSquareText,
  Tags,
  Target,
  CalendarClock,
  ShieldCheck,
  WifiOff,
  Search,
  Wallet,
  Smartphone,
} from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";

export const metadata: Metadata = {
  title: "Expense Tracker Features",
  description:
    "Chat-first expense tracking, auto-categorization, budgets, bills, offline PWA and private-by-design local storage. Explore every Hisaabi feature.",
};

const FEATURES = [
  {
    icon: MessageSquareText,
    title: "Chat to record",
    body: "Type “spent 200 on coffee” or “paid 800 for the electric bill” and it’s logged — no forms, no dropdowns, no category pickers. The chat understands amounts, dates and payment methods in plain language.",
  },
  {
    icon: Tags,
    title: "Auto-categorization",
    body: "Every expense is sorted into the right category automatically. When something doesn’t fit, the AI asks before creating a new one — so your data stays tidy and you stay in control.",
  },
  {
    icon: Search,
    title: "Ask about your spending",
    body: "“How much did I spend on food this month?” gets a real answer computed from your own data — not a guess. Chat doubles as the report you never have to build.",
  },
  {
    icon: Target,
    title: "Budgets & goals",
    body: "Set monthly limits per category and watch a live rollup. Clear alerts show when a category is trending over, before the month ends.",
  },
  {
    icon: CalendarClock,
    title: "Bills & salary",
    body: "Tell Hisaabi about recurring bills and your salary date, and it reminds you when a bill is due or your salary should have landed — confirm in a tap.",
  },
  {
    icon: Wallet,
    title: "Cash & bank balances",
    body: "Track cash and bank money separately, with the ability to adjust balances manually. Expenses default to the bank account unless you say cash.",
  },
  {
    icon: WifiOff,
    title: "Offline PWA",
    body: "Install Hisaabi like a native app. The shell works offline — you can log and review spending without a connection. With local Ollama, even the AI works offline.",
  },
  {
    icon: Smartphone,
    title: "Installable on any device",
    body: "A proper PWA with an app icon and manifest. Add it to your home screen on Android, iOS or desktop and it behaves like an app.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Every expense lives in your browser’s IndexedDB. No account, no server, no cloud sync, no analytics. The only outbound request is your prompt to your chosen AI provider.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Add your AI key",
    body: "Open the app and connect your provider — OpenAI, Anthropic, Gemini, Groq, or a local Ollama. Takes about a minute.",
  },
  {
    n: "2",
    title: "Chat your expenses",
    body: "Type what you spent, like you’d text a friend. The AI extracts the amount, category and date, and shows you an approval card.",
  },
  {
    n: "3",
    title: "Confirm & done",
    body: "Tap to confirm. Each entry can be edited or undone instantly, and the dashboard, budgets and insights update live.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <MarketingHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-6 pb-8 pt-14 text-center sm:pt-20">
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            Features
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Expense tracking that feels like texting
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            No forms. No spreadsheets to update. Hisaabi turns natural-language chat into a tidy,
            private expense tracker — and answers your money questions from your own data.
          </p>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <f.icon className="size-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">{f.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <p className="mt-3 text-muted-foreground">
              From first key to first entry in three steps.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full brand-gradient text-sm font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl px-6 py-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Private by architecture</h2>
          <p className="mt-3 text-muted-foreground">
            Your financial data never touches a Hisaabi server — because there are none. Open the
            Network tab and see for yourself.
          </p>
          <Link
            href="/app"
            className="brand-gradient mt-8 inline-block rounded-xl px-8 py-3.5 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Try it free
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            No signup. Read the{" "}
            <Link href="/privacy" className="text-brand hover:underline">privacy policy</Link>.
          </p>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
