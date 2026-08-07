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
