import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";

export const metadata: Metadata = {
  title: "Pricing — Free forever",
  description:
    "Hisaabi is a free expense tracker. No subscriptions, no accounts. You bring your own AI API key and pay only your provider’s usage — typically a few cents a month.",
};

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
    <>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-14">
        <div className="text-center">
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            Pricing
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Free forever. Your data isn’t the price.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Most “free” finance apps make money from your data. Hisaabi has nothing to sell — it’s
            open source, runs on your device, and costs nothing.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-lg">
          <div className="rounded-3xl border border-brand/30 bg-card p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Hisaabi</h2>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                No account
              </span>
            </div>
            <p className="mt-4">
              <span className="text-5xl font-bold tracking-tight">$0</span>
              <span className="text-muted-foreground"> / forever</span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Bring your own AI key — OpenAI, Anthropic, Gemini, Groq, or a local Ollama. You pay
              your provider’s usage only, typically a few cents a month.
            </p>
            <Link
              href="/app"
              className="brand-gradient mt-6 block rounded-xl py-3 text-center font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Start tracking
            </Link>
            <ul className="mt-8 grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
              {INCLUDED.map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Open source — review the code yourself instead of trusting the pricing page.
          </p>
        </div>

        <section className="mx-auto mt-16 w-full max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            How “free” finance apps actually charge you
          </h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                  <th className="px-4 py-3 font-medium"> </th>
                  <th className="px-4 py-3 font-semibold text-foreground">Hisaabi</th>
                  <th className="px-4 py-3 font-medium">Typical cloud tracker</th>
                </tr>
              </thead>
              <tbody>
                {VS.map((row) => (
                  <tr key={row.feature} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{row.feature}</td>
                    <td className="px-4 py-3 text-brand">
                      {row.hisaabi === "No" ? <Check className="inline size-4" /> : row.hisaabi}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.cloud === "Yes" ? <X className="inline size-4 text-red-500" /> : row.cloud}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-16 w-full max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight">Ready to keep your data?</h2>
          <p className="mt-3 text-muted-foreground">
            The free AI expense tracker with no signup and no cloud.
          </p>
          <Link
            href="/app"
            className="brand-gradient mt-6 inline-block rounded-xl px-8 py-3.5 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Open the app
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Read the <Link href="/privacy" className="text-brand hover:underline">privacy policy</Link> or the{" "}
            <Link href="/terms" className="text-brand hover:underline">terms of service</Link>.
          </p>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
