import type { Metadata } from "next";
import Link from "next/link";
import { FileCode2, LockKeyhole, MessageSquareText } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { TealNoirBackground } from "@/components/marketing/TealNoirBackground";
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
    title: "Tracking shouldn't be homework",
    body: "Expense apps feel like filing taxes. Chat does not. If the fastest way to record a purchase is to text a friend about it, the tracker should work the same way.",
  },
  {
    icon: FileCode2,
    title: "Open source, so you can check",
    body: "\u201CTrust us\u201D is a weak privacy guarantee. The code is open for anyone to read. What we claim is what the code does.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <TealNoirBackground />
      <MarketingHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14">
        <div className="text-center">
          <span className="inline-block rounded-full border border-teal-500/20 bg-teal-500/5 px-3 py-1 text-xs font-medium text-teal-400">
            About
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Built to get your money out of the cloud
          </h1>
        </div>

        <p className="mt-8 text-lg text-zinc-400">
          Hisaabi started with a simple frustration: every expense tracker wanted two things we
          weren&apos;t willing to give — an account, and our financial history. Bank-level data, sitting
          on someone&apos;s servers, governed by a privacy policy we&apos;d never fully read.
        </p>
        <p className="mt-4 text-lg text-zinc-400">
          The fix isn&apos;t a better privacy policy. It&apos;s{" "}
          <strong className="text-white">no servers at all</strong>. Hisaabi is a local-first
          expense tracker: everything lives in your browser, works offline, and disappears if you
          clear it. The only thing that ever leaves your device is a prompt you send to an AI
          provider you chose, with your own key — and even that stops entirely with a local Ollama
          setup.
        </p>

        <h2 className="mt-12 text-2xl font-bold tracking-tight text-white">What we believe</h2>
        <div className="mt-6 grid gap-4">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="flex gap-4 rounded-3xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10 text-teal-400">
                <p.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{p.title}</h3>
                <p className="mt-1 text-sm text-zinc-400">{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-bold tracking-tight text-white">
          What we don&apos;t do
        </h2>
        <ul className="mt-6 flex list-disc flex-col gap-2 pl-6 text-zinc-400">
          <li>No accounts, no signup, no email capture.</li>
          <li>No cloud storage, sync, or backup of your data on our side.</li>
          <li>No analytics, telemetry, or ad trackers in the app.</li>
          <li>No selling or sharing of data — there is no data to sell.</li>
        </ul>

        <h2 className="mt-12 text-2xl font-bold tracking-tight text-white">Open source</h2>
        <p className="mt-4 text-zinc-400">
          Hisaabi is{" "}
          <Link
            href="https://github.com/sarthkdobriyal/hisaabi"
            target="_blank"
            rel="noreferrer"
            className="text-teal-400 hover:underline"
          >
            open source
          </Link>
          . The privacy claim isn&apos;t a promise you have to take on faith — read the code, run it
          yourself, or audit exactly what the app sends. That&apos;s the strongest guarantee we can
          offer, and we think it&apos;s the only one that matters for something as sensitive as your
          finances.
        </p>

        <div className="mt-12 rounded-3xl border border-teal-500/30 bg-zinc-900/50 p-8 text-center backdrop-blur-sm">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Keep your data. Start today.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-zinc-400">
            Free, private, and open source — the AI expense tracker that doesn&apos;t own your history.
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
    </div>
  );
}
