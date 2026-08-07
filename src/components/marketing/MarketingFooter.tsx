import Image from "next/image";
import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-zinc-950 pt-24 pb-12 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12 mb-24">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src="/hisaabi-icon.svg" alt="" width={32} height={32} className="rounded-lg" />
              <span className="text-xl font-bold tracking-tighter text-white">Hisaabi</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">Chat your expenses. Keep your data. Privacy-first tracking for the modern era.</p>
          </div>
          <div>
            <h4 className="text-teal-500 text-xs font-bold uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/app" className="hover:text-white transition-colors">Open App</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-teal-500 text-xs font-bold uppercase tracking-widest mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/guides/ai-expense-tracker" className="hover:text-white transition-colors">Guides</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-teal-500 text-xs font-bold uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 select-none pointer-events-none">
            <span className="text-[15vw] font-bold text-white/[0.03] tracking-tighter uppercase whitespace-nowrap" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)", color: "transparent" }}>HISAABI</span>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col items-center justify-between gap-4 text-xs text-zinc-600 md:flex-row" style={{ fontFamily: "var(--font-mono)" }}>
            <span>&copy; {new Date().getFullYear()} HISAABI. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-teal-500 transition-colors uppercase tracking-widest">Privacy</Link>
              <Link href="/terms" className="hover:text-teal-500 transition-colors uppercase tracking-widest">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
