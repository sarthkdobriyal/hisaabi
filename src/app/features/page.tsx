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
import { TealNoirBackground } from "@/components/marketing/TealNoirBackground";
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

const ICON_COLORS = [
  "teal",
  "cyan",
  "emerald",
  "sky",
  "violet",
  "amber",
  "rose",
  "indigo",
  "lime",
  "fuchsia",
  "orange",
  "blue",
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  teal: { bg: "bg-teal-500/10", border: "border-teal-500/20", text: "text-teal-400" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
  sky: { bg: "bg-sky-500/10", border: "border-sky-500/20", text: "text-sky-400" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-400" },
  indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400" },
  lime: { bg: "bg-lime-500/10", border: "border-lime-500/20", text: "text-lime-400" },
  fuchsia: { bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20", text: "text-fuchsia-400" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
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
    body: "Type what you spent, like you'd text a friend. The AI extracts the amount, category and date, and shows you an approval card.",
  },
  {
    n: "3",
    title: "Confirm & done",
    body: "Tap to confirm. Each entry can be edited or undone instantly, and the dashboard, budgets and insights update live.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <TealNoirBackground />
      <MarketingHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-6 pb-8 pt-14 text-center sm:pt-20">
          <span className="inline-block rounded-full border border-teal-500/20 bg-teal-500/5 px-3 py-1 text-xs font-medium text-teal-400">
            Features
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Expense tracking that feels like texting
          </h1>
          <p className="mt-5 text-lg text-zinc-400">
            No forms. No spreadsheets to update. Hisaabi turns natural-language chat into a tidy,
            private expense tracker — and answers your money questions from your own data.
          </p>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = FEATURE_ICONS[f.slug] ?? Sparkles;
              const color = ICON_COLORS[i % ICON_COLORS.length];
              const c = COLOR_MAP[color];
              return (
                <Link
                  key={f.slug}
                  href={`/features/${f.slug}`}
                  className="group flex flex-col rounded-3xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm transition hover:border-teal-500/50"
                >
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl border ${c.bg} ${c.border} ${c.text}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-white group-hover:text-teal-400">
                    {f.name}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400">{f.tagline}</p>
                  <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-400">
                    Learn more <ArrowRight className="size-3.5" />
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">How it works</h2>
            <p className="mt-3 text-zinc-400">
              From first key to first entry in three steps.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-3xl border border-white/10 bg-zinc-900/50 p-6 text-center backdrop-blur-sm"
              >
                <div className="mx-auto flex size-10 items-center justify-center rounded-full brand-gradient text-sm font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl px-6 py-12 text-center">
          <div className="rounded-3xl border border-teal-500/30 bg-zinc-900/50 p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Private by architecture
            </h2>
            <p className="mt-3 text-zinc-400">
              Your financial data never touches a Hisaabi server — because there are none. Open the
              Network tab and see for yourself.
            </p>
            <Link
              href="/app"
              className="brand-gradient mt-8 inline-block rounded-xl px-8 py-3.5 font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Try it free
            </Link>
            <p className="mt-3 text-sm text-zinc-400">
              No signup. Read the{" "}
              <Link href="/privacy" className="text-teal-400 hover:underline">
                privacy policy
              </Link>
              , or read the{" "}
              <Link
                href="/blog/how-hisaabi-encrypts-your-data"
                className="text-teal-400 hover:underline"
              >
                full technical write-up of the encryption
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
