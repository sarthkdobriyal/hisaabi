import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App",
  robots: { index: false }, // app routes are private client-side, not for indexing
};

const NAV = [
  { href: "/app", label: "Chat" },
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/settings", label: "Settings" },
];

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-background/80 backdrop-blur dark:border-slate-800">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/app" className="flex items-center gap-2 font-semibold">
            <Image src="/hisaabi-icon.svg" alt="" width={28} height={28} className="rounded-md" />
            Hisaabi
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">{children}</div>
    </div>
  );
}
