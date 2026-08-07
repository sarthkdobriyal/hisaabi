import Image from "next/image";
import Link from "next/link";

export function MarketingHeader() {
  return (
    <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
      <div className="flex items-center justify-between w-full max-w-5xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/hisaabi-icon.svg" alt="Hisaabi" width={32} height={32} className="rounded-lg" />
          <span className="text-lg font-bold tracking-tighter text-white">Hisaabi</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="/blog" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Blog</Link>
        </nav>
        <Link href="/app" className="relative group">
          <span className="absolute -inset-[1px] bg-teal-500/50 rounded-full opacity-0 group-hover:opacity-100 transition blur-sm" />
          <span className="relative bg-teal-600 hover:bg-teal-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all inline-block">
            Open app
          </span>
        </Link>
      </div>
    </header>
  );
}
