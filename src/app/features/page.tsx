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
  LockKeyhole,
  Download,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { pageMetadata } from "@/lib/seo";
import { FEATURES } from "@/lib/features";

export const metadata: Metadata = pageMetadata({
  path: "/features",
  title: "Features — Chat-first private expense tracker",
  description:
    "Chat-first expense tracking, auto-categorization, budgets, bills, offline PWA and private-by-design local storage. Explore every Hisaabi feature.",
});

const FEATURE_ICONS: Record<string, LucideIcon> = {
  "chat-expense-logging": MessageSquareText,
  "auto-categorization": Tags,
  "spending-insights": Search,
  "budgets-and-goals": Target,
  "bills-and-salary-reminders": CalendarClock,
  "cash-and-bank-balances": Wallet,
  "offline-pwa": WifiOff,
  "installable-app": Smartphone,
  "private-by-design": ShieldCheck,
  "encryption-at-rest": LockKeyhole,
  "export-and-backups": Download,
  "bring-your-own-ai": Sparkles,
};

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
            {FEATURES.map((f) => {
              const Icon = FEATURE_ICONS[f.slug] ?? Sparkles;
              return (
                <Link
                  key={f.slug}
                  href={`/features/${f.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-brand/40"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold group-hover:text-brand">{f.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{f.tagline}</p>
                  <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                    Learn more <ArrowRight className="size-3.5" />
                  </p>
                </Link>
              );
            })}
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
            <Link href="/privacy" className="text-brand hover:underline">privacy policy</Link>, or read the{" "}
            <Link href="/blog/how-hisaabi-encrypts-your-data" className="text-brand hover:underline">
              full technical write-up of the encryption
            </Link>
            .
          </p>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
