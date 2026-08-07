import type { Metadata } from "next";
import Link from "next/link";
import { FileCode2, LockKeyhole, MessageSquareText } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About — the story behind Hisaabi",
  description:
    "Why Hisaabi exists: a private, local-first AI expense tracker built by someone tired of handing financial data to cloud apps. Free, open source, no account.",
});

const PILLARS = [
  {
    icon: LockKeyhole,
    title: "Your money is private",
    body: "A budget is one of the most intimate documents you own. No cloud company should get a copy of yours. Hisaabi stores it on your device — period.",
  },
  {
    icon: MessageSquareText,
    title: "Tracking shouldn’t be homework",
    body: "Expense apps feel like filing taxes. Chat does not. If the fastest way to record a purchase is to text a friend about it, the tracker should work the same way.",
  },
  {
    icon: FileCode2,
    title: "Open source, so you can check",
    body: "“Trust us” is a weak privacy guarantee. The code is open for anyone to read. What we claim is what the code does.",
  },
];

export default function AboutPage() {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14">
        <div className="text-center">
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            About
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Built to get your money out of the cloud
          </h1>
        </div>

        <p className="mt-8 text-lg text-muted-foreground">
          Hisaabi started with a simple frustration: every expense tracker wanted two things we
          weren’t willing to give — an account, and our financial history. Bank-level data, sitting
          on someone’s servers, governed by a privacy policy we’d never fully read.
        </p>
        <p className="mt-4 text-lg text-muted-foreground">
          The fix isn’t a better privacy policy. It’s <strong>no servers at all</strong>. Hisaabi is
          a local-first expense tracker: everything lives in your browser, works offline, and
          disappears if you clear it. The only thing that ever leaves your device is a prompt you
          send to an AI provider you chose, with your own key — and even that stops entirely with a
          local Ollama setup.
        </p>

        <h2 className="mt-12 text-2xl font-bold tracking-tight">What we believe</h2>
        <div className="mt-6 grid gap-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="flex gap-4 rounded-2xl border border-border bg-card p-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <p.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold tracking-tight">What we don’t do</h2>
        <ul className="mt-6 flex list-disc flex-col gap-2 pl-6 text-muted-foreground">
          <li>No accounts, no signup, no email capture.</li>
          <li>No cloud storage, sync, or backup of your data on our side.</li>
          <li>No analytics, telemetry, or ad trackers in the app.</li>
          <li>No selling or sharing of data — there is no data to sell.</li>
        </ul>

        <h2 className="mt-12 text-2xl font-bold tracking-tight">Open source</h2>
        <p className="mt-4 text-muted-foreground">
          Hisaabi is{" "}
          <Link href="https://github.com/sarthkdobriyal/hisaabi" target="_blank" rel="noreferrer" className="text-brand hover:underline">
            open source
          </Link>
          . The privacy claim isn’t a promise you have to take on faith — read the code, run it
          yourself, or audit exactly what the app sends. That’s the strongest guarantee we can
          offer, and we think it’s the only one that matters for something as sensitive as your
          finances.
        </p>

        <div className="mt-12 rounded-3xl border border-brand/30 bg-brand/5 p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Keep your data. Start today.</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Free, private, and open source — the AI expense tracker that doesn’t own your history.
          </p>
          <Link
            href="/app"
            className="brand-gradient mt-6 inline-block rounded-xl px-8 py-3.5 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Open the app
          </Link>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
