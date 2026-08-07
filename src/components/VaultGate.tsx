"use client";

import { useEffect, useState } from "react";
import { Lock, LockOpen } from "lucide-react";
import {
  getVaultStatus,
  onVaultStatusChange,
  resolveVaultStatus,
  unlock,
  type VaultStatus,
} from "@/lib/vault";

// Gates the entire app behind the vault. Renders the unlock screen while
// locked; the normal app shell (header + pages) only mounts once unlocked.
export function VaultGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<VaultStatus>("disabled");
  const [resolved, setResolved] = useState(false);
  const [fatal, setFatal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const s = await resolveVaultStatus();
        if (cancelled) return;
        setStatus(s);
      } catch {
        if (cancelled) return;
        setFatal(true);
      } finally {
        if (!cancelled) setResolved(true);
      }
    })();
    const off = onVaultStatusChange(() => setStatus(getVaultStatus()));
    return () => {
      cancelled = true;
      off();
    };
  }, []);

  async function onUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!passcode || busy) return;
    setBusy(true);
    setError(null);
    try {
      await unlock(passcode);
      setPasscode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not unlock.");
    } finally {
      setBusy(false);
    }
  }

  if (!resolved && !fatal) {
    return (
      <div className="flex min-h-dvh flex-1 items-center justify-center bg-black">
        <div className="size-6 animate-spin rounded-full border-2 border-teal-500/30 border-t-teal-500" />
      </div>
    );
  }

  if (fatal) {
    return (
      <div className="flex min-h-dvh flex-1 items-center justify-center bg-black p-6">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold tracking-tight text-white">Couldn&apos;t read your vault</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Something went wrong while checking your encrypted storage. Reload to try again.
          </p>
          <button
            type="button"
            onClick={() => {
              setFatal(false);
              setResolved(false);
              void resolveVaultStatus().then(setStatus).catch(() => setFatal(true)).finally(() => setResolved(true));
            }}
            className="brand-gradient mt-5 inline-flex rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (status === "locked") {
    return (
      <div className="flex min-h-dvh flex-1 items-center justify-center bg-black p-6">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400">
              <Lock className="size-7" />
            </div>
            <h1 className="mt-5 text-center text-xl font-bold tracking-tight text-white">Hisaabi is locked</h1>
            <p className="mx-auto mt-1.5 max-w-xs text-center text-sm text-zinc-400">
              Your data is encrypted on this device. Enter your passcode to open it.
            </p>

            <form onSubmit={onUnlock} className="mt-6 grid gap-3">
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-zinc-300">Passcode</span>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  autoComplete="off"
                  className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </label>
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={busy || !passcode}
                className="brand-gradient inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:opacity-40"
              >
                <LockOpen className="size-4" />
                {busy ? "Unlocking…" : "Unlock"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-zinc-500">
              The passcode can&apos;t be recovered. Lost it? Your data stays encrypted — restore from a backup.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
