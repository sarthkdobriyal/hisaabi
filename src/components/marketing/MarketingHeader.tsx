import Image from "next/image";
import Link from "next/link";

export function MarketingHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/hisaabi-icon.svg" alt="Hisaabi" width={32} height={32} className="rounded-lg" />
        <span className="text-lg font-bold tracking-tight">Hisaabi</span>
      </Link>
      <nav className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/features"
          className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-brand/5 hover:text-foreground sm:inline-block"
        >
          Features
        </Link>
        <Link
          href="/pricing"
          className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-brand/5 hover:text-foreground sm:inline-block"
        >
          Pricing
        </Link>
        <Link
          href="/app"
          className="rounded-lg px-4 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand/5"
        >
          Open app
        </Link>
      </nav>
    </header>
  );
}
