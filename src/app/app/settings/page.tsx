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
import {
  changePasscode,
  configureAutoLock,
  disableEncryption,
  enableEncryption,
  exportEncryptedBackup,
  getLockAfterMinutes,
  getVaultStatus,
  importEncryptedBackup,
  lock,
  onVaultStatusChange,
} from "@/lib/vault";
import { Bot, CreditCard, Download, LockKeyhole, ShieldCheck, Trash2, User } from "lucide-react";

const AUTO_LOCK_OPTIONS = [
  { value: 1, label: "1 minute" },
  { value: 5, label: "5 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "60 minutes" },
  { value: 0, label: "Never (not recommended)" },
];

const TABS = [
  { id: "ai", label: "AI Provider", icon: Bot },
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "backup", label: "Backup", icon: Download },
  { id: "danger", label: "Danger", icon: Trash2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

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
  const [tab, setTab] = useState<TabId>("ai");
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

  const [vaultStatus, setVaultStatus] = useState(getVaultStatus());
  const [lockMins, setLockMins] = useState(getLockAfterMinutes());
  const [showEnableForm, setShowEnableForm] = useState(false);
  const [enableForm, setEnableForm] = useState({ passcode: "", confirm: "" });
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [changeForm, setChangeForm] = useState({ current: "", next: "", confirm: "" });
  const [confirmDisable, setConfirmDisable] = useState(false);
  const [encBusy, setEncBusy] = useState<string | null>(null);
  const [encError, setEncError] = useState<string | null>(null);
  const [encSuccess, setEncSuccess] = useState<string | null>(null);
  const [encExportPass, setEncExportPass] = useState("");
  const [encImportPass, setEncImportPass] = useState("");

  useEffect(() => {
    const off = onVaultStatusChange(() => {
      setVaultStatus(getVaultStatus());
      setLockMins(getLockAfterMinutes());
    });
    return off;
  }, []);

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
    return <div className="py-16 text-center text-sm text-zinc-500">Loading settings…</div>;
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

  function encMessage(msg: string | null) {
    setEncError(msg);
    if (msg) setEncSuccess(null);
  }

  async function onEnableEncryption() {
    setEncBusy("enable");
    setEncError(null);
    setEncSuccess(null);
    try {
      if (enableForm.passcode.length < 4) throw new Error("Passcode must be at least 4 characters.");
      if (enableForm.passcode !== enableForm.confirm) throw new Error("Passcodes don't match.");
      await enableEncryption(enableForm.passcode, lockMins);
      setShowEnableForm(false);
      setEnableForm({ passcode: "", confirm: "" });
    } catch (e) {
      encMessage(e instanceof Error ? e.message : "Could not enable encryption.");
    } finally {
      setEncBusy(null);
    }
  }

  async function onChangePasscode() {
    setEncBusy("change");
    setEncError(null);
    setEncSuccess(null);
    try {
      if (changeForm.next.length < 4) throw new Error("New passcode must be at least 4 characters.");
      if (changeForm.next !== changeForm.confirm) throw new Error("New passcodes don't match.");
      await changePasscode(changeForm.current, changeForm.next);
      setShowChangeForm(false);
      setChangeForm({ current: "", next: "", confirm: "" });
      setEncSuccess("Passcode changed.");
    } catch (e) {
      encMessage(e instanceof Error ? e.message : "Could not change passcode.");
    } finally {
      setEncBusy(null);
    }
  }

  async function onDisableEncryption() {
    setEncBusy("disable");
    setEncError(null);
    setEncSuccess(null);
    try {
      await disableEncryption();
      setConfirmDisable(false);
      setEncSuccess("Encryption turned off. Data is now stored without a passcode.");
    } catch (e) {
      encMessage(e instanceof Error ? e.message : "Could not disable encryption.");
    } finally {
      setEncBusy(null);
    }
  }

  async function onLockNow() {
    setEncBusy("lock");
    setEncError(null);
    await lock();
    setEncBusy(null);
  }

  function onAutoLockChange(value: string) {
    const minutes = Number(value);
    setLockMins(minutes);
    configureAutoLock(minutes);
  }

  async function onExportEncrypted() {
    setEncBusy("export");
    setEncError(null);
    setEncSuccess(null);
    try {
      const json = await exportEncryptedBackup(encExportPass);
      download(`hisaabi-vault-${today()}.hisaabi`, json, "application/json");
      setEncExportPass("");
      setEncSuccess("Encrypted backup downloaded. Keep your passcode safe with it.");
    } catch (e) {
      encMessage(e instanceof Error ? e.message : "Could not export encrypted backup.");
    } finally {
      setEncBusy(null);
    }
  }

  async function onImportEncrypted(file: File) {
    setEncBusy("import");
    setEncError(null);
    setEncSuccess(null);
    try {
      const text = await file.text();
      await importEncryptedBackup(text, encImportPass);
      setEncImportPass("");
      setEncSuccess("Encrypted backup restored.");
      const [s, p] = await Promise.all([getSettings(), getProfile()]);
      setForm(toFormState(s));
      setProfileForm(toProfileForm(p));
      setCurrencyState(p.currency);
    } catch (e) {
      encMessage(e instanceof Error ? e.message : "Could not import encrypted backup.");
    } finally {
      setEncBusy(null);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-zinc-500">
          Configure your AI provider, currency, and backups. Everything stays in this browser.
        </p>
      </header>

      <nav className="flex gap-1 overflow-x-auto border-b border-white/10 pb-px scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-2.5 rounded-t-lg px-4 py-3 text-sm font-medium transition ${
              tab === t.id
                ? "border-b-2 border-teal-500 text-teal-400"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <t.icon className="size-5" />
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "ai" && (
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
                <select
                  value={meta.modelSuggestions.includes(form.model) ? form.model : "custom"}
                  onChange={(e) => e.target.value !== "custom" && patch({ model: e.target.value })}
                  className={inputCls}
                >
                  {meta.modelSuggestions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  <option value="custom">Custom…</option>
                </select>
                {!meta.modelSuggestions.includes(form.model) && (
                  <input
                    value={form.model}
                    onChange={(e) => patch({ model: e.target.value })}
                    placeholder={meta.defaultModel}
                    className={`${inputCls} font-mono`}
                  />
                )}
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
                  <p className="text-xs text-zinc-500">
                    Tip: create a scoped/limited key where your provider supports it.
                  </p>
                  {testResult && (
                    <p className={`text-sm font-medium ${testResult.ok ? "text-brand-600" : "text-red-600"}`}>
                      {testResult.message}
                    </p>
                  )}
                </Field>

                {(form.provider === "openai" || form.provider === "custom") && (
                  <Field label={form.provider === "custom" ? "Base URL" : "Base URL (optional)"}>
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
                    <p className="text-xs text-zinc-500">
                      {form.provider === "custom"
                        ? "Any OpenAI-compatible endpoint (OpenRouter, LiteLLM, a local server…). API key is optional. The endpoint must allow browser requests (CORS)."
                        : "Point at an OpenAI-compatible proxy or gateway (OpenRouter, LiteLLM, Omniroute, etc.) instead of OpenAI directly. Leave blank to use OpenAI."}
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

            <div className="flex items-center gap-3 border-t border-white/10 pt-5">
              <button type="button" onClick={onSave} className={btnPrimary}>
                Save changes
              </button>
              {saved && <span className="text-sm font-medium text-brand-600">Saved.</span>}
            </div>
          </div>
        </Section>
      )}

      {tab === "profile" && (
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
              <h3 className="text-sm font-semibold text-zinc-300">Monthly category budgets</h3>
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
              <h3 className="text-sm font-semibold text-zinc-300">Custom categories</h3>
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
                      className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-zinc-400 hover:bg-zinc-900"
                    >
                      {category} ×
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-zinc-300">Recurring bills</h3>
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
                  <div key={i} className="grid gap-3 rounded-xl border border-white/10 p-3 sm:grid-cols-[1fr_8rem_7rem_auto]">
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
                  <p className="rounded-xl border border-dashed border-white/10 p-4 text-center text-sm text-zinc-500">
                    No recurring bills yet.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-white/10 pt-5">
              <button type="button" onClick={onSaveProfile} className={btnPrimary}>
                Save profile
              </button>
              {profileSaved && <span className="text-sm font-medium text-brand-600">Saved.</span>}
            </div>
          </div>
        </Section>
      )}

      {tab === "security" && (
        <Section
          title="Security & encryption"
          subtitle="Lock your data behind a passcode. While locked, it's AES-256 encrypted on this device."
        >
          <div className="grid gap-5">
            {vaultStatus === "disabled" ? (
              <div className="grid gap-4">
                <div className="flex flex-wrap items-center gap-3 rounded-xl bg-zinc-800 px-4 py-3 text-sm text-zinc-300">
                  <LockKeyhole className="size-4 text-zinc-400" />
                  <span>
                    Encryption is <strong>off</strong>. Your data is stored on this device, but unencrypted.
                  </span>
                </div>
                {showEnableForm ? (
                  <div className="grid gap-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
                    <p className="text-xs text-amber-300">
                      <strong>Important:</strong> the passcode is never stored and can&apos;t be recovered. If you
                      forget it, your data stays permanently encrypted. Export a backup first. Enabling locks the app
                      immediately.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Passcode">
                        <input
                          type="password"
                          value={enableForm.passcode}
                          onChange={(e) => setEnableForm((f) => ({ ...f, passcode: e.target.value }))}
                          placeholder="At least 4 characters"
                          autoComplete="new-password"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Confirm passcode">
                        <input
                          type="password"
                          value={enableForm.confirm}
                          onChange={(e) => setEnableForm((f) => ({ ...f, confirm: e.target.value }))}
                          placeholder="Repeat passcode"
                          autoComplete="new-password"
                          className={inputCls}
                        />
                      </Field>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={onEnableEncryption} disabled={encBusy === "enable"} className={btnPrimary}>
                        {encBusy === "enable" ? "Encrypting…" : "Enable encryption & lock"}
                      </button>
                      <button type="button" onClick={() => setShowEnableForm(false)} className={btnGhost}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => setShowEnableForm(true)} className={btnGhost}>
                    Enable passcode lock
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                <div className="flex flex-wrap items-center gap-3 rounded-xl bg-brand/5 px-4 py-3 text-sm">
                  <ShieldCheck className="size-4 text-brand" />
                  <span>
                    Encryption is <strong className="text-brand">on</strong> ·{" "}
                    <strong>unlocked</strong> for this session.
                  </span>
                  <button
                    type="button"
                    onClick={onLockNow}
                    disabled={encBusy === "lock"}
                    className={`${btnGhost} ml-auto`}
                  >
                    {encBusy === "lock" ? "Locking…" : "Lock now"}
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Auto-lock after">
                    <select value={lockMins} onChange={(e) => onAutoLockChange(e.target.value)} className={inputCls}>
                      {AUTO_LOCK_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setShowChangeForm((v) => !v)} className={btnGhost}>
                    Change passcode
                  </button>
                  {confirmDisable ? (
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-red-400">
                        Turn off encryption? Data stays, unencrypted.
                      </span>
                      <button
                        type="button"
                        onClick={onDisableEncryption}
                        disabled={encBusy === "disable"}
                        className={btnDanger}
                      >
                        {encBusy === "disable" ? "Turning off…" : "Yes, turn off"}
                      </button>
                      <button type="button" onClick={() => setConfirmDisable(false)} className={btnGhost}>
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button type="button" onClick={() => setConfirmDisable(true)} className={btnDanger}>
                      Disable encryption
                    </button>
                  )}
                </div>

                {showChangeForm && (
                  <div className="grid gap-3 rounded-xl border border-white/10 p-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="Current passcode">
                        <input
                          type="password"
                          value={changeForm.current}
                          onChange={(e) => setChangeForm((f) => ({ ...f, current: e.target.value }))}
                          autoComplete="current-password"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="New passcode">
                        <input
                          type="password"
                          value={changeForm.next}
                          onChange={(e) => setChangeForm((f) => ({ ...f, next: e.target.value }))}
                          autoComplete="new-password"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Confirm new">
                        <input
                          type="password"
                          value={changeForm.confirm}
                          onChange={(e) => setChangeForm((f) => ({ ...f, confirm: e.target.value }))}
                          autoComplete="new-password"
                          className={inputCls}
                        />
                      </Field>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={onChangePasscode} disabled={encBusy === "change"} className={btnPrimary}>
                        {encBusy === "change" ? "Changing…" : "Save new passcode"}
                      </button>
                      <button type="button" onClick={() => setShowChangeForm(false)} className={btnGhost}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid gap-3 rounded-xl border border-white/10 p-4">
                  <h3 className="text-sm font-semibold text-zinc-300">Encrypted backups</h3>
                  <p className="text-xs text-zinc-500">
                    Restore these with the same passcode — on any device or browser. Keep the passcode and file together.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Passcode for backup">
                      <input
                        type="password"
                        value={encExportPass}
                        onChange={(e) => setEncExportPass(e.target.value)}
                        autoComplete="off"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Restore file">
                      <label className={`${btnGhost} cursor-pointer`}>
                        {encBusy === "import" ? "Restoring…" : "Restore encrypted backup"}
                        <input
                          type="file"
                          accept="application/json,.hisaabi"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void onImportEncrypted(f);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </Field>
                  </div>
                  <Field label="Passcode to restore">
                    <input
                      type="password"
                      value={encImportPass}
                      onChange={(e) => setEncImportPass(e.target.value)}
                      placeholder="Passcode of the backup file"
                      autoComplete="off"
                      className={inputCls}
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={onExportEncrypted}
                    disabled={encBusy === "export" || !encExportPass}
                    className={`${btnGhost} w-fit`}
                  >
                    {encBusy === "export" ? "Encrypting…" : "Export encrypted backup"}
                  </button>
                </div>
              </div>
            )}

            {encError && <p className="text-sm font-medium text-red-600">{encError}</p>}
            {encSuccess && <p className="text-sm font-medium text-brand-600">{encSuccess}</p>}
          </div>
        </Section>
      )}

      {tab === "backup" && (
        <Section
          title="Storage & backup"
          subtitle="Everything lives in this browser. Keep backups — clearing browser data erases it."
        >
          <div className="grid gap-5">
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-zinc-800 px-4 py-3 text-sm text-zinc-300">
              <span>
                Persistent storage:{" "}
                <strong className={persisted ? "text-brand-600" : "text-amber-400"}>
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
            <p className="text-xs text-zinc-500">JSON exports never include your API key.</p>
          </div>
        </Section>
      )}

      {tab === "danger" && (
        <Section title="Danger zone" subtitle="Irreversible actions. Export a backup first." tone="danger">
          {confirmWipe ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-red-400">
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
      )}
    </div>
  );
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-zinc-950 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-40";
const btnPrimary =
  "inline-flex items-center justify-center brand-gradient rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-40";
const btnGhost =
  "inline-flex items-center justify-center rounded-lg border border-white/10 px-3.5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-40";
const btnDanger =
  "inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-40";

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
      <span className="text-sm font-medium text-zinc-300">{label}</span>
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
          ? "border-red-500/30 bg-red-950/20"
          : "border-white/10 bg-zinc-900/50"
      }`}
    >
      <h2 className="text-base font-semibold tracking-tight text-white">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
