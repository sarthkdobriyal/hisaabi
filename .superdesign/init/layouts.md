# Layout Components

Shared layout/shell components. The app has two shells: a **marketing shell**
(`MarketingHeader` + `MarketingFooter`, composed per-page) and an **app shell**
(`src/app/app/layout.tsx` → `AppHeader` inside a `VaultGate`). The root layout
(`src/app/layout.tsx`) sets fonts, metadata, and the flex column body.

---

## MarketingHeader

- **File:** `src/components/marketing/MarketingHeader.tsx`
- **Description:** Centered top nav for marketing pages — logo + Features/Pricing/Blog links + "Open app" CTA.

```tsx
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
          href="/blog"
          className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-brand/5 hover:text-foreground sm:inline-block"
        >
          Blog
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
```

---

## MarketingFooter

- **File:** `src/components/marketing/MarketingFooter.tsx`
- **Description:** Bordered footer with the Hisaabi mark and a wrapped set of nav links.

```tsx
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
          <Link href="/blog" className="transition hover:text-foreground">
            Blog
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
```

---

## Root Layout

- **File:** `src/app/layout.tsx`
- **Description:** Root App Router layout — loads Geist Sans/Mono fonts, sets site metadata/viewport, renders children in a flex-column body, and mounts the service worker registrar.

```tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = "https://hisaabi.co.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Hisaabi — Free AI Expense Tracker With Chat, No Cloud",
    template: "%s — Hisaabi",
  },
  description:
    "Track expenses by chatting. Hisaabi is a free, private AI expense tracker — no signup, no cloud, your data stays on your device. Bring your own AI key.",
  applicationName: "Hisaabi",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-180.png",
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Hisaabi",
    title: "Hisaabi — Free AI Expense Tracker With Chat, No Cloud",
    description:
      "Chat your expenses. Keep your data. A private, local-first AI expense tracker.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hisaabi — Free AI Expense Tracker With Chat, No Cloud",
    description: "Chat your expenses. Keep your data.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
```

---

## App Layout

- **File:** `src/app/app/layout.tsx`
- **Description:** App shell for `/app/**` — wraps content in `VaultGate` (passcode lock), renders `AppHeader`, a centered max-w-3xl content column, and the `PwaInstallModal`; marks app routes `noindex`.

```tsx
import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";
import { PwaInstallModal } from "@/components/PwaInstallModal";
import { VaultGate } from "@/components/VaultGate";

export const metadata: Metadata = {
  title: "App",
  robots: { index: false }, // app routes are private client-side, not for indexing
};

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <VaultGate>
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-4 py-4">{children}</div>
        <PwaInstallModal />
      </div>
    </VaultGate>
  );
}
```

---

## AppHeader

- **File:** `src/components/AppHeader.tsx` (`"use client"`)
- **Description:** Sticky app nav — logo, Chat/Dashboard/Expenses/Settings links, a Lock button (when vault unlocked), an "Encryption off" warning (when disabled), a mobile hamburger menu, and a PWA install action.

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock, LockKeyhole } from "lucide-react";
import { initInstallPrompt, installNow, useInstallPrompt } from "@/lib/pwa-install";
import { getVaultStatus, lock, onVaultStatusChange, type VaultStatus } from "@/lib/vault";

const NAV = [
  { href: "/app", label: "Chat" },
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/expenses", label: "Expenses" },
  { href: "/app/settings", label: "Settings" },
];

const menuIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const closeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const { native } = useInstallPrompt();
  const [vault, setVault] = useState<VaultStatus>(getVaultStatus());
  const [locking, setLocking] = useState(false);

  useEffect(() => {
    initInstallPrompt();
    const off = onVaultStatusChange(() => {
      setVault(getVaultStatus());
      setLocking(false);
    });
    return off;
  }, []);

  async function onLock() {
    setLocking(true);
    try {
      await lock();
    } catch {
      setLocking(false);
    }
  }

  const showLock = vault === "unlocked";
  const showEncryptionOff = vault === "disabled";

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-background/80 backdrop-blur dark:border-slate-800">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/app" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
          <Image src="/hisaabi-icon.svg" alt="" width={28} height={28} className="rounded-md" />
          Hisaabi
        </Link>

        <nav className="hidden items-center gap-1 text-sm sm:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
          {showLock && (
            <button
              type="button"
              onClick={onLock}
              disabled={locking}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
              title="Lock the app now"
            >
              <Lock className="size-4" />
              {locking ? "Locking…" : "Lock"}
            </button>
          )}
          {showEncryptionOff && (
            <Link
              href="/app/settings"
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-950/50"
              title="Encryption is off — enable the passcode lock in Settings"
            >
              <LockKeyhole className="size-3.5" />
              Encryption off
            </Link>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 sm:hidden dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {open ? closeIcon : menuIcon}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-slate-200 px-4 py-2 sm:hidden dark:border-slate-800">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
          {showLock && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void onLock();
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Lock className="size-4" />
              {locking ? "Locking…" : "Lock now"}
            </button>
          )}
          {showEncryptionOff && (
            <Link
              href="/app/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-amber-700 dark:text-amber-300"
            >
              <LockKeyhole className="size-4" />
              Encryption off — enable passcode
            </Link>
          )}
          {native && (
            <button
              type="button"
              onClick={() => {
                void installNow();
                setOpen(false);
              }}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-brand transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Install app
            </button>
          )}
        </div>
      )}
    </header>
  );
}
```
