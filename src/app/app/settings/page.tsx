"use client";

import { useEffect, useState } from "react";
import type { Profile, Provider, RecurringBill, Settings } from "@/lib/db";
import { PROVIDERS, providerMeta, testConnection, type TestResult } from "@/lib/providers";
import { CURRENCIES } from "@/lib/currencies";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { getProfile, getSettings, saveProfile, saveSettings, setCurrency } from "@/lib/store";
import {
  download,
  exportAllJson,
  exportExpensesCsv,
  importJson,
  wipeAll,
} from "@/lib/backup";

type FormState = Pick<Settings, "provider" | "model" | "apiKey" | "ollamaUrl" | "baseUrl">;
type ProfileForm = Pick<Profile, "salary" | "salaryDate" | "budgetGoals" | "recurringBills" | "customCategories">;

function toFormState(s: Settings): FormState {
  return { provider: s.provider, model: s.model, apiKey: s.apiKey, ollamaUrl: s.ollamaUrl, baseUrl: s.baseUrl };
}

function toProfileForm(p: Profile): ProfileForm {
  return {
    salary: p.salary,
    salaryDate: p.salaryDate,
    budgetGoals: p.budgetGoals,
    recurringBills: p.recurringBills,
    customCategories: p.customCategories,
  };
}

function cleanProfileForm(p: ProfileForm): ProfileForm {
  return {
    salary: p.salary && p.salary > 0 ? p.salary : undefined,
    salaryDate: p.salaryDate && p.salaryDate >= 1 && p.salaryDate <= 31 ? p.salaryDate : undefined,
    budgetGoals: p.budgetGoals.filter((g) => g.limit > 0),
    recurringBills: p.recurringBills
      .map((b) => ({ ...b, name: b.name.trim() }))
      .filter((b) => b.name && b.amount > 0 && b.dayOfMonth >= 1 && b.dayOfMonth <= 31),
    customCategories: [...new Set(p.customCategories.map((c) => c.trim()).filter(Boolean))],
  };
}

export default function SettingsPage() {
  const [form, setForm] = useState<FormState | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileForm | null>(null);
  const [currency, setCurrencyState] = useState("INR");
  const [newCategory, setNewCategory] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);

  useEffect(() => {
    void (async () => {
      const [s, p] = await Promise.all([getSettings(), getProfile()]);
      setForm(toFormState(s));
      setProfileForm(toProfileForm(p));
      setCurrencyState(p.currency);
      if (navigator.storage?.persisted) setPersisted(await navigator.storage.persisted());
    })();
  }, []);

  if (!form || !profileForm) {
    return <div className="py-16 text-center text-sm text-slate-500">Loading settings…</div>;
  }

  const meta = providerMeta(form.provider);
  const categories = [...DEFAULT_CATEGORIES, ...profileForm.customCategories];

  function patch(next: Partial<FormState>) {
    setForm((f) => (f ? { ...f, ...next } : f));
    setSaved(false);
    setTestResult(null);
  }

  function patchProfile(next: Partial<ProfileForm>) {
    setProfileForm((p) => (p ? { ...p, ...next } : p));
    setProfileSaved(false);
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

  async function onSaveProfile() {
    if (!profileForm) return;
    const savedProfile = await saveProfile(cleanProfileForm(profileForm));
    setProfileForm(toProfileForm(savedProfile));
    setProfileSaved(true);
  }

  function setBudget(category: string, raw: string) {
    if (!profileForm) return;
    const limit = Number(raw);
    const rest = profileForm.budgetGoals.filter((g) => g.category !== category);
    patchProfile({ budgetGoals: limit > 0 ? [...rest, { category, limit }] : rest });
  }

  function setBill(index: number, patch: Partial<RecurringBill>) {
    if (!profileForm) return;
    patchProfile({ recurringBills: profileForm.recurringBills.map((b, i) => (i === index ? { ...b, ...patch } : b)) });
  }

  function addCategory() {
    if (!profileForm) return;
    const category = newCategory.trim();
    if (!category || categories.includes(category)) return;
    patchProfile({ customCategories: [...profileForm.customCategories, category] });
    setNewCategory("");
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
      const [s, p] = await Promise.all([getSettings(), getProfile()]);
      setForm(toFormState(s));
      setProfileForm(toProfileForm(p));
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
    const [s, p] = await Promise.all([getSettings(), getProfile()]);
    setForm(toFormState(s));
    setProfileForm(toProfileForm(p));
    setCurrencyState(p.currency);
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

      {/* Profile & budget */}
      <Section title="Profile & budget" subtitle="Review what chat saved, then tune budgets for the dashboard and AI.">
        <div className="grid gap-6">
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Default currency">
              <select value={currency} onChange={(e) => onCurrencyChange(e.target.value)} className={inputCls}>
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label} ({c.code})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Monthly salary">
              <input
                type="number"
                min="0"
                value={profileForm.salary ?? ""}
                onChange={(e) => patchProfile({ salary: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="50000"
                className={inputCls}
              />
            </Field>
            <Field label="Salary day">
              <input
                type="number"
                min="1"
                max="31"
                value={profileForm.salaryDate ?? ""}
                onChange={(e) => patchProfile({ salaryDate: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="1"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid gap-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Monthly category budgets</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <Field key={category} label={category}>
                  <input
                    type="number"
                    min="0"
                    value={profileForm.budgetGoals.find((g) => g.category === category)?.limit ?? ""}
                    onChange={(e) => setBudget(category, e.target.value)}
                    placeholder="No limit"
                    className={inputCls}
                  />
                </Field>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Custom categories</h3>
            <div className="flex gap-2">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Pets"
                className={inputCls}
              />
              <button type="button" onClick={addCategory} className={btnGhost}>
                Add
              </button>
            </div>
            {!!profileForm.customCategories.length && (
              <div className="flex flex-wrap gap-2">
                {profileForm.customCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      patchProfile({
                        customCategories: profileForm.customCategories.filter((c) => c !== category),
                        budgetGoals: profileForm.budgetGoals.filter((g) => g.category !== category),
                      })
                    }
                    className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    {category} ×
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recurring bills</h3>
              <button
                type="button"
                onClick={() =>
                  patchProfile({ recurringBills: [...profileForm.recurringBills, { name: "", amount: 0, dayOfMonth: 1 }] })
                }
                className={btnGhost}
              >
                Add bill
              </button>
            </div>
            <div className="grid gap-3">
              {profileForm.recurringBills.map((bill, i) => (
                <div key={i} className="grid gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800 sm:grid-cols-[1fr_8rem_7rem_auto]">
                  <input
                    value={bill.name}
                    onChange={(e) => setBill(i, { name: e.target.value })}
                    placeholder="Rent"
                    className={inputCls}
                  />
                  <input
                    type="number"
                    min="0"
                    value={bill.amount || ""}
                    onChange={(e) => setBill(i, { amount: Number(e.target.value) })}
                    placeholder="Amount"
                    className={inputCls}
                  />
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={bill.dayOfMonth || ""}
                    onChange={(e) => setBill(i, { dayOfMonth: Number(e.target.value) })}
                    placeholder="Day"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      patchProfile({ recurringBills: profileForm.recurringBills.filter((_, index) => index !== i) })
                    }
                    className={btnGhost}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {!profileForm.recurringBills.length && (
                <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 dark:border-slate-700">
                  No recurring bills yet.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button type="button" onClick={onSaveProfile} className={btnPrimary}>
              Save profile
            </button>
            {profileSaved && <span className="text-sm font-medium text-brand-600">Saved.</span>}
          </div>
        </div>
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
