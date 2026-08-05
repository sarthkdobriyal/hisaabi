"use client";

import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { DataResidencyBadge } from "@/components/DataResidencyBadge";
import { SETTINGS_ID, type Provider, type Settings } from "@/lib/db";
import { providerMeta, testConnection, type TestResult } from "@/lib/providers";
import { readProfile, readSettings, saveProfile, saveSettings } from "@/lib/store";

// True when chat can't talk to the chosen provider yet — the chat page shows
// the setup screen instead of letting the first message error out.
export function needsSetup(s: Settings): boolean {
  if (s.provider === "ollama") return false; // local, no key needed
  if (s.provider === "anthropic") return true; // chat adapter not wired yet
  if (s.provider === "openai") return !s.apiKey && !s.baseUrl; // key or a gateway URL
  if (s.provider === "custom") return !s.baseUrl; // base URL required, key optional
  return !s.apiKey; // gemini, groq, nvidia all require a key
}

const CONFIGURABLE: Provider[] = ["groq", "openai", "gemini", "ollama", "nvidia", "custom"];

export default function SetupScreen() {
  const settings = useLiveQuery(() => readSettings(), [], null);
  const profile = useLiveQuery(() => readProfile(), [], null);
  const [provider, setProvider] = useState<Provider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [cash, setCash] = useState("0");
  const [bank, setBank] = useState("0");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [saved, setSaved] = useState(false);
  const seeded = useRef(false);
  const balancesSeeded = useRef(false);

  // Seed form fields from the stored settings once, after the live query loads.
  useEffect(() => {
    if (settings && !seeded.current) {
      seeded.current = true;
      setProvider(settings.provider === "anthropic" ? "openai" : settings.provider);
      setApiKey(settings.apiKey ?? "");
      setBaseUrl(settings.baseUrl ?? "");
    }
  }, [settings]);

  // Seed the balance fields from the stored profile once it loads.
  useEffect(() => {
    if (profile && !balancesSeeded.current) {
      balancesSeeded.current = true;
      setCash(String(profile.cashBalance ?? 0));
      setBank(String(profile.bankBalance ?? 0));
    }
  }, [profile]);

  if (!settings) {
    return <div className="py-16 text-center text-sm text-slate-500">Loading…</div>;
  }

  const meta = providerMeta(provider);
  const isAnthropic = settings.provider === "anthropic";
  const usesBaseUrl = provider === "openai" || provider === "custom";
  const needsKey = provider !== "ollama";
  const keyOk =
    provider === "openai" ? Boolean(apiKey.trim() || baseUrl.trim()) : // key or a gateway URL
    provider === "custom" ? Boolean(baseUrl.trim()) : // base URL required, key optional
    Boolean(apiKey.trim());
  const saveable = provider === "ollama" || keyOk;

  async function onTest() {
    if (!saveable) return;
    setTesting(true);
    setTestResult(null);
    const s: Settings = {
      id: SETTINGS_ID,
      provider,
      apiKey: apiKey.trim(),
      model: "",
      ...(usesBaseUrl ? { baseUrl: baseUrl.trim() } : {}),
    };
    setTestResult(await testConnection(s));
    setTesting(false);
  }

  async function onSave() {
    if (!saveable) return;
    setSaved(false);
    await saveSettings({
      provider,
      apiKey: apiKey.trim(),
      ...(usesBaseUrl ? { baseUrl: baseUrl.trim() } : { baseUrl: undefined }),
    });
    // Starting balances are optional — only write valid, non-negative numbers.
    const nCash = Number(cash);
    const nBank = Number(bank);
    await saveProfile({
      ...(Number.isFinite(nCash) && nCash >= 0 ? { cashBalance: nCash } : {}),
      ...(Number.isFinite(nBank) && nBank >= 0 ? { bankBalance: nBank } : {}),
    });
    setSaved(true);
    // The chat page's live query picks up the new settings and swaps to chat.
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DataResidencyBadge />
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-6 py-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Connect your AI</h1>
          <p className="mt-2 text-sm text-slate-500">
            Hisaabi chats to a model you choose, with your own key. Your data never leaves this browser.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-background p-6 shadow-sm dark:border-slate-800">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">AI provider</span>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as Provider)}
              className="rounded-lg border border-slate-300 bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700"
            >
              {CONFIGURABLE.map((id) => (
                <option key={id} value={id}>
                  {providerMeta(id).label}
                </option>
              ))}
            </select>
          </label>

          {isAnthropic && (
            <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
              You had Anthropic selected — its chat adapter isn&apos;t wired yet. Pick one below.
            </p>
          )}

          {needsKey && (
            <label className="flex flex-col gap-1.5">
              <span className="flex items-center justify-between text-sm font-medium">
                API key
                {meta.keyUrl && (
                  <a
                    href={meta.keyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-normal text-brand hover:underline"
                  >
                    Get a key
                  </a>
                )}
              </span>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={meta.keyHint}
                className="rounded-lg border border-slate-300 bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700"
              />
            </label>
          )}

          {usesBaseUrl && (
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">
                Base URL{provider === "openai" ? " (optional)" : ""}
              </span>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.openai.com/v1"
                className="rounded-lg border border-slate-300 bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700"
              />
              <p className="text-xs text-slate-500">
                {provider === "custom"
                  ? "Any OpenAI-compatible endpoint. API key is optional."
                  : "For a proxy or gateway — OpenRouter, a local omniroute, etc."}
              </p>
            </label>
          )}

          {provider === "ollama" && (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Fully offline. Requires Ollama running locally (default{" "}
              <span className="font-mono">http://localhost:11434</span>). No key, nothing leaves your machine.
            </p>
          )}

          <div className="rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
            <p className="text-sm font-medium">Starting balances</p>
            <p className="mt-0.5 text-xs text-slate-500">
              How much money do you have right now? Skip for now and set it on the dashboard later — expenses default to the bank account unless you say cash.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Cash</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={cash}
                  onChange={(e) => setCash(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-background px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Bank</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-background px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onTest}
              disabled={!saveable || testing}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {testing ? "Testing…" : "Test connection"}
            </button>
            <button
              onClick={onSave}
              disabled={!saveable}
              className="brand-gradient inline-flex flex-1 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-40"
            >
              {saved ? "Saved ✓" : "Continue to chat"}
            </button>
          </div>

          {testResult && (
            <p className={`text-xs ${testResult.ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {testResult.message}
            </p>
          )}
        </div>

        <p className="text-center text-xs text-slate-500">
          Change your provider, key, or add your salary anytime in Settings. All data is stored only in this browser.
        </p>
      </div>
    </div>
  );
}
