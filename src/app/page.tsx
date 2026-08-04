import Image from "next/image";
import Link from "next/link";

// Placeholder landing. Full marketing homepage (SEO copy, FAQ, JSON-LD) lands in a later milestone.
export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <Image src="/hisaabi-icon.svg" alt="Hisaabi" width={72} height={72} priority className="rounded-2xl" />
      <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        Track expenses by chatting.
        <br />
        <span className="bg-clip-text text-transparent brand-gradient">Your data never leaves your device.</span>
      </h1>
      <p className="mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-300">
        Type &ldquo;spent 450 on groceries&rdquo; and you&rsquo;re done. A free AI expense tracker — no signup, no
        cloud, no data collection. Bring your own AI key.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/app"
          className="brand-gradient rounded-xl px-6 py-3 font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          Start tracking — it&rsquo;s free
        </Link>
        <Link
          href="/app/settings"
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Set up your AI key
        </Link>
      </div>
      <p className="mt-6 text-sm text-slate-500">No account · Works offline · Open source</p>
    </main>
  );
}
