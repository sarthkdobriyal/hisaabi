"use client";

import { useEffect, useState } from "react";
import type { Provider, Settings } from "@/lib/db";
import { PROVIDERS, providerMeta, testConnection, type TestResult } from "@/lib/providers";
import { CURRENCIES } from "@/lib/currencies";
import { getProfile, getSettings, saveSettings, setCurrency } from "@/lib/store";
import {
  download,
  exportAllJson,
  exportExpensesCsv,
  importJson,
  wipeAll,
} from "@/lib/backup";

type FormState = Pick<Settings, "provider" | "model" | "apiKey" | "ollamaUrl" | "baseUrl">;

function toFormState(s: Settings): FormState {
  return { provider: s.provider, model: s.model, apiKey: s.apiKey, ollamaUrl: s.ollamaUrl, baseUrl: s.baseUrl };
}

export default function SettingsPage() {
  const [form, setForm] = useState<FormState | null>(null);
  const [currency, setCurrencyState] = useState("INR");
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);

  useEffect(() => {
    void (async () => {
      const [s, p] = await Promise.all([getSettings(), getProfile()]);
      setForm(toFormState(s));
      setCurrencyState(p.currency);
      if (navigator.storage?.persisted) setPersisted(await navigator.storage.persisted());
    })();
  }, []);

  if (!form) {
    return <div className="py-16 text-center text-sm text-slate-500">Loading settings…</div>;
  }

  const meta = providerMeta(form.provider);

  function patch(next: Partial<FormState>) {
    setForm((f) => (f ? { ...f, ...next } : f));
    setSaved(false);
    setTestResult(null);
  }

  function onProviderChange(provider: Provider) {
    const m = providerMeta(provider);
    patch({ provider, model: m.defaultModel });
  }

  async function onSave() {
    if (!form) return;
    await saveSettings(form);
    setSaved(true);
  }

  async function onTest() {
    if (!form) return;
    setTesting(true);
    setTestResult(null);
    const result = await testConnection({ id: 1, ...form });
    setTestResult(result);
    setTesting(false);
  }

  async function onRemoveKey() {
    patch({ apiKey: "" });
    await saveSettings({ apiKey: "" });
  }

  async function onCurrencyChange(code: string) {
    setCurrencyState(code);
    await setCurrency(code);
  }

  async function enablePersist() {
    if (navigator.storage?.persist) setPersisted(await navigator.storage.persist());
  }

  async function onExportJson() {
    download(`hisaabi-backup-${today()}.json`, await exportAllJson(), "application/json");
  }

  async function onExportCsv() {
    download(`hisaabi-expenses-${today()}.csv`, await exportExpensesCsv(), "text/csv");
  }

  async function onImport(file: File) {
    setBusy("import");
    try {
      await importJson(await file.text());
      alert("Backup imported.");
      const s = await getSettings();
      setForm(toFormState(s));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setBusy(null);
    }
  }

  async function onWipe() {
    setBusy("wipe");
    await wipeAll();
    setConfirmWipe(false);
    setBusy(null);
    const s = await getSettings();
    setForm(toFormState(s));
    setCurrencyState((await getProfile()).currency);
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500">
          Configure your AI provider, currency, and backups. Everything stays in this browser.
        </p>
      </header>

      {/* AI provider */}
      <Section
        title="AI provider"
        subtitle="Your key is stored only in this browser and sent only to the provider you pick."
      >
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Provider">
              <select
                value={form.provider}
                onChange={(e) => onProviderChange(e.target.value as Provider)}
                className={inputCls}
              >
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Model">
              <input
                list="model-suggestions"
                value={form.model}
                onChange={(e) => patch({ model: e.target.value })}
                placeholder={meta.defaultModel}
                className={inputCls}
              />
              <datalist id="model-suggestions">
                {meta.modelSuggestions.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </Field>
          </div>

          {meta.needsKey ? (
            <>
              <Field label="API key">
                <div className="flex gap-2">
                  <input
                    type={showKey ? "text" : "password"}
                    value={form.apiKey}
                    onChange={(e) => patch({ apiKey: e.target.value })}
                    placeholder={meta.keyHint}
                    autoComplete="off"
                    className={`${inputCls} flex-1 font-mono`}
                  />
                  <button type="button" onClick={() => setShowKey((v) => !v)} className={btnGhost}>
                    {showKey ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onTest}
                    disabled={testing || (!form.apiKey && !form.baseUrl)}
                    className={btnGhost}
                  >
                    {testing ? "Testing…" : "Test key"}
                  </button>
                  <button type="button" onClick={onRemoveKey} disabled={!form.apiKey} className={btnGhost}>
                    Remove key
                  </button>
                  {meta.keyUrl && (
                    <a
                      href={meta.keyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-brand underline underline-offset-2"
                    >
                      Get a key
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Tip: create a scoped/limited key where your provider supports it.
                </p>
                {testResult && (
                  <p className={`text-sm font-medium ${testResult.ok ? "text-brand-600" : "text-red-600"}`}>
                    {testResult.message}
                  </p>
                )}
              </Field>

              {form.provider === "openai" && (
                <Field label="Base URL (optional)">
                  <input
                    value={form.baseUrl ?? ""}
                    onChange={(e) =>
                      patch({
                        baseUrl: e.target.value,
                        model: form.model === "gpt-4o-mini" && e.target.value.trim() ? "auto" : form.model,
                      })
                    }
                    placeholder="https://api.openai.com/v1"
                    className={`${inputCls} font-mono`}
                  />
                  <p className="text-xs text-slate-500">
                    Point at an OpenAI-compatible proxy or gateway (OpenRouter, LiteLLM, Omniroute, etc.) instead of
                    OpenAI directly. Leave blank to use OpenAI.
                  </p>
                </Field>
              )}
            </>
          ) : (
            <Field label="Ollama URL">
              <input
                value={form.ollamaUrl ?? ""}
                onChange={(e) => patch({ ollamaUrl: e.target.value })}
                placeholder="http://localhost:11434"
                className={inputCls}
              />
              <button type="button" onClick={onTest} disabled={testing} className={`${btnGhost} w-fit`}>
                {testing ? "Testing…" : "Test connection"}
              </button>
              {testResult && (
                <p className={`text-sm font-medium ${testResult.ok ? "text-brand-600" : "text-red-600"}`}>
                  {testResult.message}
                </p>
              )}
            </Field>
          )}

          <div className="flex items-center gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button type="button" onClick={onSave} className={btnPrimary}>
              Save changes
            </button>
            {saved && <span className="text-sm font-medium text-brand-600">Saved.</span>}
          </div>
        </div>
      </Section>

      {/* Currency */}
      <Section title="Currency" subtitle="Used to format amounts across the app.">
        <Field label="Default currency" className="max-w-xs">
          <select value={currency} onChange={(e) => onCurrencyChange(e.target.value)} className={inputCls}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label} ({c.code})
              </option>
            ))}
          </select>
        </Field>
      </Section>

      {/* Storage & backup */}
      <Section
        title="Storage & backup"
        subtitle="Everything lives in this browser. Keep backups — clearing browser data erases it."
      >
        <div className="grid gap-5">
          <div className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-900/50">
            <span>
              Persistent storage:{" "}
              <strong className={persisted ? "text-brand-600" : "text-amber-600"}>
                {persisted === null ? "unknown" : persisted ? "on" : "off"}
              </strong>
            </span>
            {!persisted && (
              <button type="button" onClick={enablePersist} className={`${btnGhost} ml-auto`}>
                Enable
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onExportJson} className={btnGhost}>
              Export all (JSON)
            </button>
            <button type="button" onClick={onExportCsv} className={btnGhost}>
              Export expenses (CSV)
            </button>
            <label className={`${btnGhost} cursor-pointer`}>
              {busy === "import" ? "Importing…" : "Import JSON"}
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onImport(f);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <p className="text-xs text-slate-500">JSON exports never include your API key.</p>
        </div>
      </Section>

      {/* Danger zone */}
      <Section title="Danger zone" subtitle="Irreversible actions. Export a backup first." tone="danger">
        {confirmWipe ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-red-700 dark:text-red-400">
              Delete all local data? This cannot be undone.
            </span>
            <button type="button" onClick={onWipe} disabled={busy === "wipe"} className={btnDanger}>
              {busy === "wipe" ? "Wiping…" : "Yes, wipe everything"}
            </button>
            <button type="button" onClick={() => setConfirmWipe(false)} className={btnGhost}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmWipe(true)} className={btnDanger}>
            Wipe all local data
          </button>
        )}
      </Section>
    </div>
  );
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-40 dark:border-slate-700";
const btnPrimary =
  "inline-flex items-center justify-center brand-gradient rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40";
const btnGhost =
  "inline-flex items-center justify-center rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-medium transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-900";
const btnDanger =
  "inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40";

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`grid gap-1.5 ${className ?? ""}`}>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function Section({
  title,
  subtitle,
  tone,
  children,
}: {
  title: string;
  subtitle?: string;
  tone?: "danger";
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border p-6 shadow-sm ${
        tone === "danger"
          ? "border-red-200 bg-red-50/40 dark:border-red-900/60 dark:bg-red-950/20"
          : "border-slate-200 bg-background dark:border-slate-800"
      }`}
    >
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
