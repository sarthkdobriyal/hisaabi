import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";

export const metadata: Metadata = {
  title: "Terms of Service — Free & open source",
  description:
    "Hisaabi is free and open source. Your data stays on your device; you are responsible for your API key and for reviewing AI-parsed entries.",
};

export default function TermsPage() {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: August 6, 2026</p>

        <p className="mt-8 text-muted-foreground">
          By using Hisaabi you agree to these terms. They are written in plain language; if
          something is unclear, read the{" "}
          <Link href="/privacy" className="text-brand hover:underline">Privacy Policy</Link> or ask.
        </p>

        <h2 className="mt-10 text-xl font-semibold">1. What Hisaabi is</h2>
        <p className="mt-3 text-muted-foreground">
          Hisaabi is a free, open-source, local-first expense tracker. It runs entirely in your
          browser. Your data is stored on your device and is never uploaded to Hisaabi servers —
          there are none. You supply your own AI API key to power chat features.
        </p>

        <h2 className="mt-10 text-xl font-semibold">2. No warranty on AI accuracy</h2>
        <p className="mt-3 text-muted-foreground">
          Chat-based expense tracking relies on an AI model you configure. AI can misread amounts,
          dates or categories. Hisaabi is provided “as is”, without warranty of any kind, and we
          make no guarantee that parsed entries are accurate. You are responsible for reviewing
          entries before relying on them — every write is shown to you for confirmation and can be
          undone or edited.
        </p>

        <h2 className="mt-10 text-xl font-semibold">3. Your data, your responsibility</h2>
        <p className="mt-3 text-muted-foreground">
          Because data lives only in your browser, you are responsible for keeping it safe. Hisaabi
          is not liable for data loss caused by clearing browser storage, a failed device, or an
          uninstall. Use the JSON export in Settings to keep backups, and consider enabling the
          optional app passcode and encrypted export.
        </p>

        <h2 className="mt-10 text-xl font-semibold">4. API keys</h2>
        <p className="mt-3 text-muted-foreground">
          You are responsible for any API keys you add. Store them only in the app, never share
          them, and prefer scoped or limited keys where your provider supports them. Usage and cost
          for your chosen AI provider is billed to you by that provider. Removing an app never
          revokes your key — revoke it with your provider if needed.
        </p>

        <h2 className="mt-10 text-xl font-semibold">5. Acceptable use</h2>
        <p className="mt-3 text-muted-foreground">
          Don&apos;t use Hisaabi for anything unlawful, to track others without consent, or to
          defraud anyone. You may use it for personal and business expense tracking of data you are
          entitled to process.
        </p>

        <h2 className="mt-10 text-xl font-semibold">6. Open source</h2>
        <p className="mt-3 text-muted-foreground">
          Hisaabi is{" "}
          <Link href="https://github.com/sarthkdobriyal/hisaabi" target="_blank" rel="noreferrer" className="text-brand hover:underline">
            open source
          </Link>
          , which means you can read, modify and run the code yourself. The project is provided
          under its open-source license; this page describes use of the hosted application and does
          not restrict your rights under that license.
        </p>

        <h2 className="mt-10 text-xl font-semibold">7. Limitation of liability</h2>
        <p className="mt-3 text-muted-foreground">
          To the maximum extent permitted by law, Hisaabi is not liable for any indirect,
          incidental or consequential damages arising from your use of the app, including financial
          losses from inaccurate entries or data loss.
        </p>

        <h2 className="mt-10 text-xl font-semibold">8. Changes</h2>
        <p className="mt-3 text-muted-foreground">
          We may update these terms as the product evolves. Material changes will be noted here.
          Continued use after a change means you accept the updated terms.
        </p>

        <p className="mt-10 text-sm text-muted-foreground">
          Questions? Read the <Link href="/privacy" className="text-brand hover:underline">Privacy
          Policy</Link> or{" "}
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
