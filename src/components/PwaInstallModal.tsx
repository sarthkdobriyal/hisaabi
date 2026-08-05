"use client";

import { useEffect, useState } from "react";
import { initInstallPrompt, useInstallPrompt } from "@/lib/pwa-install";

// iOS Safari has no one-click install (no `beforeinstallprompt`), so it gets
// manual instructions here. Chrome/Android install from the header menu instead.
export function PwaInstallModal() {
  const { manual } = useInstallPrompt();
  const [show, setShow] = useState(false);

  useEffect(() => {
    initInstallPrompt();
    if (!manual) return;
    const t = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(t);
  }, [manual]);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-title"
      onClick={() => setShow(false)}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-background p-6 shadow-xl dark:border-slate-800"
      >
        <h2 id="pwa-title" className="text-lg font-bold tracking-tight">
          Install Hisaabi
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Add it to your home screen for one-tap access and offline use. Your data stays on this device.
        </p>
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          iPhone/iPad: tap <strong>Share</strong> in Safari, then <strong>Add to Home Screen</strong>. Android:
          browser menu → <strong>Install app</strong>.
        </p>
        <button
          onClick={() => setShow(false)}
          className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
