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

        <h2 className="mt-10 text-xl font-semibold">Encryption (optional, but recommended)</h2>
        <p className="mt-3 text-muted-foreground">
          You can lock the app with a passcode in <strong>Settings → Security &amp; encryption</strong>.
          When enabled, the sensitive stores (expenses, income, profile, memories, chat) are encrypted
          at rest with <strong>AES-256-GCM</strong>. The encryption key is derived from your passcode
          with <strong>PBKDF2-HMAC-SHA256 at 600,000 iterations</strong> and a random salt, and it is
          never stored on the device — it exists only in memory while you&apos;re unlocked.
        </p>
        <ul className="mt-4 flex list-disc flex-col gap-2 pl-6 text-muted-foreground">
          <li>
            <strong>While locked, only unreadable ciphertext remains</strong> on your device. The
            plaintext working copies are wiped on lock, refresh, and app close.
          </li>
          <li>
            <strong>Auto-lock</strong> seals the app after a configurable idle time (default 15
            minutes), so an unlocked device doesn&apos;t stay open indefinitely.
          </li>
          <li>
            <strong>Encrypted backups</strong> use the same passcode, so a backup is exactly as safe —
            and exactly as recoverable — as the passcode you remember.
          </li>
          <li>
            <strong>A lost passcode means unrecoverable data.</strong> By design there is no backdoor,
            no reset, no server to ask. Export a backup before you enable encryption.
          </li>
        </ul>
        <p className="mt-3 text-muted-foreground">
          Encryption protects data <strong>at rest</strong> — device off or app locked. It does not
          protect against someone using your already-unlocked browser, a keylogger, or a weak
          passcode; we state this plainly rather than overclaiming. For the full technical details,
          read{" "}
          <Link href="/blog/how-hisaabi-encrypts-your-data" className="text-brand hover:underline">
            AES-256-GCM and PBKDF2: how Hisaabi encrypts your data
          </Link>
          , or the non-technical version,{" "}
          <Link href="/blog/what-data-stays-on-your-device-means" className="text-brand hover:underline">
            what &ldquo;your data stays on your device&rdquo; actually means
          </Link>
          .
        </p>

        <h2 className="mt-10 text-xl font-semibold">Prove it yourself</h2>
        <p className="mt-3 text-muted-foreground">
          Open <Link href="/app" className="text-brand hover:underline">the app</Link>, open
          DevTools, switch to the <em>Network</em> tab, and send a message. You will see exactly one
          request — to the AI provider you chose. That is the whole network story. Hisaabi is also{" "}
          <Link href="https://github.com/sarthkdobriyal/hisaabi" target="_blank" rel="noreferrer" className="text-brand hover:underline">open source</Link>
          , so anyone can read exactly what the app does.
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
          Service</Link> or{" "}
          <Link href="https://github.com/sarthkdobriyal/hisaabi" target="_blank" rel="noreferrer" className="text-brand hover:underline">
            open an issue on GitHub
          </Link>
          .
        </p>
      </main>
      <MarketingFooter />
    </>
  );
}
