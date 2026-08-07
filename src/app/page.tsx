import Link from "next/link";
import {
  MessageSquareText,
  Tags,
  Target,
  CalendarClock,
  ShieldCheck,
  WifiOff,
  LockKeyhole,
  ArrowRight,
  Check,
} from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { TealNoirBackground } from "@/components/marketing/TealNoirBackground";

const SITE = "https://hisaabi.co.in";

const FEATURES = [
  {
    icon: MessageSquareText,
    title: "Chat to record",
    body: "Type \u201cspent 200 on coffee\u201d and it\u2019s logged. No forms, no dropdowns, no category pickers.",
  },
  {
    icon: Tags,
    title: "Auto-categorize",
    body: "The AI sorts each expense into the right category \u2014 and asks before inventing a new one.",
  },
  {
    icon: Target,
    title: "Budgets & goals",
    body: "Set monthly limits and watch a live rollup, with clear alerts when a category goes over.",
  },
  {
    icon: CalendarClock,
    title: "Bills & salary",
    body: "Reminders when a recurring bill is due or your salary should have landed \u2014 confirm in a tap.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Every expense lives in your browser. No account, no server, no cloud sync \u2014 ever.",
  },
  {
    icon: LockKeyhole,
    title: "Encrypted when locked",
    body: "Set a passcode and your data is sealed with AES-256 encryption whenever the app is locked \u2014 with automatic lock after a few idle minutes.",
  },
  {
    icon: WifiOff,
    title: "Offline PWA",
    body: "Install it like an app. Log and review spending offline; the shell works without a connection.",
  },
];

const FEATURE_ACCENTS = [
  "teal",
  "blue",
  "amber",
  "purple",
  "emerald",
  "orange",
  "cyan",
] as const;

const ACCENT_MAP: Record<
  (typeof FEATURE_ACCENTS)[number],
  { bg: string; text: string; glow: string }
> = {
  teal: { bg: "bg-teal-500/10", text: "text-teal-400", glow: "group-hover:shadow-teal-500/20" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", glow: "group-hover:shadow-blue-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", glow: "group-hover:shadow-amber-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", glow: "group-hover:shadow-purple-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", glow: "group-hover:shadow-emerald-500/20" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400", glow: "group-hover:shadow-orange-500/20" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", glow: "group-hover:shadow-cyan-500/20" },
};

const STEPS = [
  { n: "1", title: "Chat it", body: "Tell Hisaabi what you spent, like you\u2019d text a friend." },
  { n: "2", title: "Auto-categorized", body: "The AI extracts amount, category and date \u2014 you confirm." },
  { n: "3", title: "See insights", body: "A local dashboard shows spend, budgets, trends and savings." },
];

const FAQ = [
  {
    q: "Is Hisaabi really free?",
    a: "Yes \u2014 free and open source. You bring your own AI API key (OpenAI, Anthropic, Gemini, Groq, or local Ollama) and pay only your provider\u2019s usage, which is typically a few cents a month.",
  },
  {
    q: "Where is my financial data stored?",
    a: "Entirely in your browser using IndexedDB. There\u2019s no account, no server, and no cloud sync. The only outbound network call is from your browser to your chosen AI provider when you chat.",
  },
  {
    q: "Is my data encrypted?",
    a: "You can turn on an optional passcode lock in Settings. It encrypts your expenses, income, profile, memories and chat with AES-256-GCM, and the key is derived from your passcode via PBKDF2 (600,000 iterations) and never stored. While the app is locked, only unreadable ciphertext remains on your device, with auto-lock after a few idle minutes. Encrypted backups with the same passcode are included.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. There\u2019s no signup, login, or password. Open the app and start tracking \u2014 it\u2019s a truly private expense tracker.",
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
    a: "Type naturally, like \u201cspent 450 on groceries\u201d. The AI reads the amount, picks a category, and records it \u2014 you approve with one tap, and can undo instantly.",
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

const PROVIDERS = ["OpenAI", "Anthropic", "Gemini", "Groq", "Ollama"];

const SECURITY_POSTS = [
  {
    href: "/blog/why-hisaabi-keeps-your-data-local",
    title: "Why Hisaabi keeps your money data local",
    body: "The copy problem with cloud trackers, and the fix that doesn\u2019t need a server.",
  },
  {
    href: "/blog/how-hisaabi-encrypts-your-data",
    title: "AES-256-GCM & PBKDF2, explained",
    body: "The full technical breakdown of the passcode lock \u2014 for people who like receipts.",
  },
  {
    href: "/blog/what-data-stays-on-your-device-means",
    title: "What \u2018data stays on your device\u2019 means",
    body: "The safe-in-your-pocket test, and what encryption can and can\u2019t do for you.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />

      <TealNoirBackground />
      <MarketingHeader />

      <div className="min-h-screen bg-black text-white relative selection:bg-teal-500/30">
        {/* Hero */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
            </span>
            <span className="font-mono">Private &middot; Local-first &middot; Open source</span>
          </span>

          <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tighter sm:text-6xl md:text-8xl">
            <span className="text-gradient block">Chat your expenses.</span>
            <span className="block">
              Keep your{" "}
              <span className="relative inline-block text-teal-400">
                data
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8 C50 2, 150 2, 198 8"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-teal-500/60"
                  />
                </svg>
              </span>
              .
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-zinc-400">
            Track expenses by chatting &mdash; type &ldquo;spent 450 on groceries&rdquo; and you&apos;re done. A free,
            private expense tracker with no signup and no cloud. Bring your own AI key.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link href="/app" className="group relative inline-flex items-center justify-center">
              <span className="absolute -inset-[1px] overflow-hidden rounded-xl">
                <span
                  className="absolute inset-[-200%] animate-border-spin"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0%, #14b8a6 25%, transparent 50%)",
                  }}
                />
              </span>
              <span className="relative inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 font-semibold text-white transition group-hover:bg-zinc-900">
                Start tracking &mdash; it&apos;s free
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
            <Link
              href="https://github.com/AhmadMayo/hisaabi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 font-semibold text-zinc-300 transition hover:border-white/20 hover:text-white"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
              GitHub
            </Link>
          </div>

          <p className="mt-8 font-mono text-xs tracking-widest text-zinc-600 uppercase">
            No account &middot; Works offline &middot; Open source
          </p>
        </section>

        {/* Provider Strip */}
        <div className="border-y border-white/5">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-5">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Works with:</span>
            {PROVIDERS.map((p) => (
              <span key={p} className="text-sm font-medium text-zinc-400">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Bento Features Grid */}
        <section className="mx-auto w-full max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-3 text-zinc-400">
              An expense tracker with chat at its core, and a private dashboard behind it.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => {
              const accent = ACCENT_MAP[FEATURE_ACCENTS[i % FEATURE_ACCENTS.length]];
              const isMain = i === 0;
              return (
                <div
                  key={f.title}
                  className={`group rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm transition-shadow hover:shadow-xl ${accent.glow} ${
                    isMain ? "lg:col-span-2 lg:row-span-2 lg:p-8" : ""
                  }`}
                >
                  <div className={`flex size-10 items-center justify-center rounded-lg ${accent.bg}`}>
                    <f.icon className={`size-5 ${accent.text}`} />
                  </div>
                  <h3 className={`mt-4 font-semibold ${isMain ? "text-xl" : "text-lg"}`}>{f.title}</h3>
                  <p className={`mt-2 text-zinc-400 ${isMain ? "text-base" : "text-sm"}`}>{f.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Screenshot Mockup */}
        <section className="mx-auto w-full max-w-5xl px-6 py-16">
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-teal-500/10">
            <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-900/80 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-zinc-700" />
                <span className="size-3 rounded-full bg-zinc-700" />
                <span className="size-3 rounded-full bg-zinc-700" />
              </div>
              <div className="mx-auto flex-1 max-w-xs">
                <div className="rounded-md bg-zinc-800 px-3 py-1 text-center text-xs text-zinc-500">
                  hisaabi.co.in/app
                </div>
              </div>
            </div>
            <div className="aspect-video bg-zinc-950 flex items-center justify-center">
              <div className="text-center">
                <MessageSquareText className="mx-auto size-12 text-teal-500/30" />
                <p className="mt-3 text-sm text-zinc-600">App preview</p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Banner */}
        <section className="bg-teal-600">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center md:flex-row md:text-left">
            <ShieldCheck className="size-12 shrink-0 text-white/90" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Your data lives here &mdash; not on our servers
              </h2>
              <p className="mt-2 text-teal-100/80">
                Hisaabi is a local-first, private expense tracker. Expenses, income, budgets and chat
                history are stored only in your browser. The single thing that ever leaves your device is
                the prompt you send to your own AI provider when you chat &mdash; and nothing at all with local
                Ollama. Open the Network tab and see for yourself.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm md:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-700/50 px-3 py-1.5 font-medium text-white/90">
                  <LockKeyhole className="size-3.5" /> Optional passcode lock
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-700/50 px-3 py-1.5 font-medium text-white/90">
                  AES-256 encryption at rest
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-700/50 px-3 py-1.5 font-medium text-white/90">
                  Auto-lock &middot; Encrypted backups
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto w-full max-w-5xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-3 text-zinc-400">Three steps, no learning curve.</p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full brand-gradient text-lg font-bold text-white shadow-lg shadow-teal-500/20">
                  {s.n}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security stories */}
        <section className="mx-auto w-full max-w-5xl px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How we keep your data safe</h2>
            <p className="mt-3 text-zinc-400">
              Three posts, one honest story: where your money data lives, how it&apos;s locked, and what that
              really protects.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {SECURITY_POSTS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm transition hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/10"
              >
                <LockKeyhole className="size-5 text-teal-400" />
                <h3 className="mt-4 text-lg font-semibold transition-colors group-hover:text-teal-400">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">{p.body}</p>
                <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-400">
                  Read the post
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-3xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-12 flex flex-col gap-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-5 backdrop-blur-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-zinc-100">
                  {f.q}
                  <span className="text-xl leading-none text-zinc-500 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-zinc-400">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mx-auto w-full max-w-lg px-6 py-16">
          <div className="rounded-2xl border border-teal-500/30 bg-zinc-900/50 p-8 text-center backdrop-blur-sm shadow-lg shadow-teal-500/10">
            <p className="text-sm font-medium text-teal-400 uppercase tracking-wider">Pricing</p>
            <p className="mt-3 text-4xl font-bold tracking-tight">$0</p>
            <p className="mt-1 text-zinc-400">Free forever. Open source.</p>
            <ul className="mt-6 space-y-3 text-left text-sm text-zinc-300">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-teal-400" />
                Unlimited expenses &amp; income
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-teal-400" />
                AI chat with your own key
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-teal-400" />
                AES-256 encryption &amp; passcode lock
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-teal-400" />
                Offline PWA &mdash; install like an app
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-teal-400" />
                No account, no cloud, no tracking
              </li>
            </ul>
            <Link
              href="/app"
              className="mt-8 inline-block w-full rounded-xl brand-gradient px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Start tracking &mdash; it&apos;s free
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto w-full max-w-3xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to <span className="text-teal-400">Track</span>?
          </h2>
          <p className="mt-3 text-zinc-400">
            Free, private, and open source. Your first expense is one message away.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-xl brand-gradient px-8 py-3.5 font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:opacity-90"
            >
              Open Hisaabi
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Want the details? We wrote the whole thing up &mdash;{" "}
            <Link href="/blog/how-hisaabi-encrypts-your-data" className="font-medium text-teal-400 hover:underline">
              the technical deep dive
            </Link>
            ,{" "}
            <Link href="/blog/what-data-stays-on-your-device-means" className="font-medium text-teal-400 hover:underline">
              what that means in practice
            </Link>
            , and{" "}
            <Link href="/blog/why-hisaabi-keeps-your-data-local" className="font-medium text-teal-400 hover:underline">
              why it&apos;s built this way
            </Link>
            .
          </p>
        </section>

        <MarketingFooter />
      </div>
    </main>
  );
}
