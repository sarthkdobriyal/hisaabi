import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";

export const metadata: Metadata = {
  title: "Privacy Policy — Your data never leaves this browser",
  description:
    "Hisaabi stores your expenses only in your browser. Nothing leaves your device except the prompt you send to your own AI provider. Open the Network tab and check.",
};

export default function PrivacyPage() {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-muted-foreground">
          Hisaabi is a local-first expense tracker. This policy is short because the honest answer
          is short: your financial data stays in your browser, on your device.
        </p>

        <h2 className="mt-10 text-xl font-semibold">What leaves your device</h2>
        <p className="mt-3 text-muted-foreground">
          Nothing — except one thing, and only when you use it. When you send a message in chat,
          Hisaabi assembles a prompt (your message plus the small summary of your data needed to
          answer it) and sends it directly from your browser to the AI provider you chose, using
          your own API key. With a local <strong>Ollama</strong> setup, nothing leaves your machine
          at all.
        </p>
        <ul className="mt-4 flex list-disc flex-col gap-2 pl-6 text-muted-foreground">
          <li>
            <strong>No accounts, no server, no cloud sync.</strong> There is nothing to sign in to
            and no backend to receive your data.
          </li>
          <li>
            <strong>No telemetry, no analytics, no error reporting</strong> on the app. The app
            loads zero third-party scripts.
          </li>
          <li>
            <strong>Your API key is stored only in your browser</strong> and sent only to the
            provider you configured.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">Where your data lives</h2>
        <p className="mt-3 text-muted-foreground">
          Expenses, income, budgets, memories and chat history are stored in{" "}
          <strong>IndexedDB</strong>, a database that lives in your browser. The app badge shows a
          live count of those records — they are on this device, not on our servers. Clearing your
          browser data erases them, so we recommend using the export feature in Settings to keep a
          backup.
        </p>

        <h2 className="mt-10 text-xl font-semibold">Prove it yourself</h2>
        <p className="mt-3 text-muted-foreground">
          Open <Link href="/app" className="text-brand hover:underline">the app</Link>, open
          DevTools, switch to the <em>Network</em> tab, and send a message. You will see exactly one
          request — to the AI provider you chose. That is the whole network story. Hisaabi is also{" "}
          <strong>open source</strong>, so anyone can read exactly what the app does.
        </p>

        <h2 className="mt-10 text-xl font-semibold">Your AI provider</h2>
        <p className="mt-3 text-muted-foreground">
          The prompt you send is handled under your chosen provider&apos;s privacy policy. We
          recommend picking a provider that doesn&apos;t train on your data, or disabling data
          retention where the provider allows it.
        </p>

        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" />
          <p className="text-sm text-muted-foreground">
            In short: <strong>the app is the product, and the product is the privacy.</strong> Your
            money is yours, and so is the record of it.
          </p>
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Questions? Read the <Link href="/terms" className="text-brand hover:underline">Terms of
          Service</Link> or open an issue on the project repository.
        </p>
      </main>
      <MarketingFooter />
    </>
  );
}
