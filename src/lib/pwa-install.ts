"use client";

import { useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Shared install state so the header dropdown and the modal can both react to
// the one `beforeinstallprompt` event Chrome fires per load. `native` means a
// one-click install is possible; `manual` means iOS-style instructions only.
let deferred: BeforeInstallPromptEvent | null = null;
let inited = false;
let state = { native: false, manual: false };
const subs = new Set<() => void>();

function setState(next: { native?: boolean; manual?: boolean }) {
  state = { ...state, ...next };
  subs.forEach((s) => s());
}

function subscribe(fn: () => void) {
  subs.add(fn);
  return () => subs.delete(fn);
}

const serverState = { native: false, manual: false };

export function useInstallPrompt() {
  return useSyncExternalStore(subscribe, () => state, () => serverState);
}

// Idempotent — safe to call from any component. Chrome/Android and iOS only;
// already-installed and desktop browsers get nothing.
export function initInstallPrompt() {
  if (inited) return;
  inited = true;
  if (window.matchMedia("(display-mode: standalone)").matches) return;
  if ((navigator as Navigator & { standalone?: boolean }).standalone) return;
  if (!window.matchMedia("(pointer: coarse)").matches) return;

  const onPrompt = (e: Event) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    setState({ native: true, manual: false });
  };
  window.addEventListener("beforeinstallprompt", onPrompt);

  if (!("onbeforeinstallprompt" in window)) {
    setState({ native: false, manual: true }); // iOS Safari has no native prompt
  }
}

export async function installNow(): Promise<void> {
  if (!deferred) return;
  const d = deferred;
  deferred = null;
  await d.prompt();
  await d.userChoice;
  setState({ native: false, manual: false });
}
