import Image from "next/image";
import Link from "next/link";
import {
  MessageSquareText,
  Tags,
  Target,
  CalendarClock,
  ShieldCheck,
  WifiOff,
} from "lucide-react";

const SITE = "https://hisaabi.co.in";

const FEATURES = [
  {
    icon: MessageSquareText,
    title: "Chat to record",
    body: "Type “spent 200 on coffee” and it’s logged. No forms, no dropdowns, no category pickers.",
  },
  {
    icon: Tags,
    title: "Auto-categorize",
    body: "The AI sorts each expense into the right category — and asks before inventing a new one.",
  },
  {
    icon: Target,
    title: "Budgets & goals",
    body: "Set monthly limits and watch a live rollup, with clear alerts when a category goes over.",
  },
  {
    icon: CalendarClock,
    title: "Bills & salary",
    body: "Reminders when a recurring bill is due or your salary should have landed — confirm in a tap.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Every expense lives in your browser. No account, no server, no cloud sync — ever.",
  },
  {
    icon: WifiOff,
    title: "Offline PWA",
    body: "Install it like an app. Log and review spending offline; the shell works without a connection.",
  },
];

const STEPS = [
  { n: "1", title: "Chat it", body: "Tell Hisaabi what you spent, like you’d text a friend." },
  { n: "2", title: "Auto-categorized", body: "The AI extracts amount, category and date — you confirm." },
  { n: "3", title: "See insights", body: "A local dashboard shows spend, budgets, trends and savings." },
];

const FAQ = [
  {
    q: "Is Hisaabi really free?",
    a: "Yes — free and open source. You bring your own AI API key (OpenAI, Anthropic, Gemini, Groq, or local Ollama) and pay only your provider’s usage, which is typically a few cents a month.",
  },
  {
    q: "Where is my financial data stored?",
    a: "Entirely in your browser using IndexedDB. There’s no account, no server, and no cloud sync. The only outbound network call is from your browser to your chosen AI provider when you chat.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. There’s no signup, login, or password. Open the app and start tracking — it’s a truly private expense tracker.",
  },
  {
    q: "Does it work offline?",
    a: "Yes. Hisaabi is an installable PWA with an offline app shell. Logging and reviewing work offline; the AI chat needs a connection to reach your provider, unless you run Ollama locally.",
  },
  {
    q: "Which AI providers are supported?",
    a: "OpenAI, Anthropic, Google Gemini, Groq, and local Ollama. Switch anytime in settings using your own key.",
  },
  {
    q: "How does chat expense tracking work?",
    a: "Type naturally, like “spent 450 on groceries”. The AI reads the amount, picks a category, and records it — you approve with one tap, and can undo instantly.",
  },
];

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Hisaabi",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: SITE,
        description:
          "A free, private AI expense tracker with chat. Log expenses in natural language; your data stays on your device.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

export default function Home() {
  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />

      {/* Header */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <Image src="/hisaabi-icon.svg" alt="Hisaabi" width={32} height={32} className="rounded-lg" />
          <span className="text-lg font-bold tracking-tight">Hisaabi</span>
        </div>
        <Link
          href="/app"
          className="rounded-lg px-4 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand/5"
        >
          Open app
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pb-16 pt-10 text-center sm:pt-16">
        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          Private · Local-first · Open source
        </span>
        <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          The AI expense tracker that keeps your data.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Track expenses by chatting — type “spent 450 on groceries” and you’re done. A free,
          private expense tracker with no signup and no cloud. Bring your own AI key.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/app"
            className="brand-gradient rounded-xl px-6 py-3 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Start tracking — it’s free
          </Link>
          <Link
            href="/app/settings"
            className="rounded-xl border border-border px-6 py-3 font-semibold transition hover:bg-muted"
          >
            Set up your AI key
          </Link>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">No account · Works offline · Open source</p>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Everything you need, nothing you don’t</h2>
          <p className="mt-3 text-muted-foreground">
            An expense tracker with chat at its core, and a private dashboard behind it.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
          <p className="mt-3 text-muted-foreground">Three steps, no learning curve.</p>
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

      {/* Privacy */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-brand/30 bg-brand/5 p-8 text-center sm:p-12">
          <ShieldCheck className="mx-auto size-8 text-brand" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Your data lives here — not on our servers</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Hisaabi is a local-first, private expense tracker. Expenses, income, budgets and chat
            history are stored only in your browser. The single thing that ever leaves your device is
            the prompt you send to your own AI provider when you chat — and nothing at all with local
            Ollama. Open the Network tab and see for yourself.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tight">Frequently asked questions</h2>
        <div className="mt-10 flex flex-col gap-3">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm [&_svg]:open:rotate-45"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {f.q}
                <span className="text-xl leading-none text-muted-foreground transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Start tracking in under a minute</h2>
        <p className="mt-3 text-muted-foreground">Free, private, and open source. Your first expense is one message away.</p>
        <Link
          href="/app"
          className="brand-gradient mt-8 inline-block rounded-xl px-8 py-3.5 font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          Open Hisaabi
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/hisaabi-icon.svg" alt="" width={20} height={20} className="rounded" />
            <span>Hisaabi — chat your expenses, keep your data.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/app" className="transition hover:text-foreground">
              Open app
            </Link>
            <Link href="/app/settings" className="transition hover:text-foreground">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
