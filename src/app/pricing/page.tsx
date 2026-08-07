import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { TealNoirBackground } from "@/components/marketing/TealNoirBackground";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/pricing",
  title: "Pricing — Free, forever",
  description:
    "Hisaabi is a free expense tracker. No subscriptions, no accounts. You bring your own AI API key and pay only your provider's usage — typically a few cents a month.",
});

const INCLUDED = [
  "Unlimited expenses & income",
  "Chat-first expense logging",
  "Auto-categorization",
  "Budgets & goals",
  "Bills & salary reminders",
  "Cash & bank balances",
  "Insights dashboard",
  "Offline PWA app",
  "JSON export & backups",
  "Optional encryption with passcode",
];

const VS = [
  { feature: "Price", hisaabi: "$0, forever", cloud: "Free tier, then subscription" },
  { feature: "Account required", hisaabi: "No", cloud: "Yes" },
  { feature: "Where data lives", hisaabi: "Your browser", cloud: "Their servers" },
  { feature: "Offline", hisaabi: "Full PWA", cloud: "Requires internet" },
  { feature: "Sells your data", hisaabi: "No — nothing to sell", cloud: "May monetize or train on it" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <TealNoirBackground />
      <MarketingHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-14">
        <div className="text-center">
          <span className="inline-block rounded-full border border-teal-500/20 bg-teal-500/5 px-3 py-1 text-xs font-medium text-teal-400">
            Pricing
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Free forever. Your data isn&apos;t the price.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400">
            Most &ldquo;free&rdquo; finance apps make money from your data. Hisaabi has nothing to sell — it&apos;s
            open source, runs on your device, and costs nothing.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-lg">
          <div className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-zinc-900/50 p-8 backdrop-blur-sm">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 font-mono">
              The only plan
            </p>
            <p className="mt-4">
              <span className="text-5xl font-bold tracking-tight text-white">$0</span>
              <span className="text-zinc-400"> / forever</span>
            </p>
            <p className="mt-3 text-sm text-zinc-400">
              Bring your own AI key — OpenAI, Anthropic, Gemini, Groq, or a local Ollama. You pay
              your provider&apos;s usage only, typically a few cents a month.
            </p>
            <Link
              href="/app"
              className="brand-gradient mt-6 block rounded-xl py-3 text-center font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Start tracking
            </Link>
            <ul className="mt-8 grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-teal-400" />
                  <span className="text-zinc-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-center text-xs text-zinc-500">
            Open source — review the code yourself instead of trusting the pricing page.
          </p>
        </div>

        <section className="mx-auto mt-16 w-full max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-white">
            How &ldquo;free&rdquo; finance apps actually charge you
          </h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-zinc-900 text-zinc-400">
                  <th className="px-4 py-3 font-medium"> </th>
                  <th className="px-4 py-3 font-semibold text-white">Hisaabi</th>
                  <th className="px-4 py-3 font-medium">Typical cloud tracker</th>
                </tr>
              </thead>
              <tbody>
                {VS.map((row) => (
                  <tr key={row.feature} className="border-b border-white/10 last:border-0">
                    <td className="px-4 py-3 font-medium text-zinc-300">{row.feature}</td>
                    <td className="px-4 py-3 text-teal-400">
                      {row.hisaabi === "No" ? <Check className="inline size-4" /> : row.hisaabi}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {row.cloud === "Yes" ? (
                        <X className="inline size-4 text-red-500" />
                      ) : (
                        row.cloud
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-16 w-full max-w-3xl text-center">
          <div className="rounded-3xl border border-teal-500/30 bg-zinc-900/50 p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Ready to keep your data?
            </h2>
            <p className="mt-3 text-zinc-400">
              The free AI expense tracker with no signup and no cloud.
            </p>
            <Link
              href="/app"
              className="brand-gradient mt-6 inline-block rounded-xl px-8 py-3.5 font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Open the app
            </Link>
            <p className="mt-3 text-sm text-zinc-500">
              Read the{" "}
              <Link href="/privacy" className="text-teal-400 hover:underline">
                privacy policy
              </Link>{" "}
              or the{" "}
              <Link href="/terms" className="text-teal-400 hover:underline">
                terms of service
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
