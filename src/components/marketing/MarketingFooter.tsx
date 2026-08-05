import Image from "next/image";
import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <Image src="/hisaabi-icon.svg" alt="" width={20} height={20} className="rounded" />
          <span>Hisaabi — chat your expenses, keep your data.</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/features" className="transition hover:text-foreground">
            Features
          </Link>
          <Link href="/pricing" className="transition hover:text-foreground">
            Pricing
          </Link>
          <Link href="/about" className="transition hover:text-foreground">
            About
          </Link>
          <Link href="/privacy" className="transition hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-foreground">
            Terms
          </Link>
          <Link href="/app" className="transition hover:text-foreground">
            Open app
          </Link>
        </div>
      </div>
    </footer>
  );
}
