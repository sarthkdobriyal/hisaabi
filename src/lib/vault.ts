import Dexie from "dexie";
import { db, VAULT_ID, type ChatMessage, type Expense, type Income, type Memory, type Profile } from "./db";
import { readSettings, saveSettings } from "./store";
import {
  KDF_ITERATIONS,
  decryptJson,
  deriveKey,
  encryptJson,
  fromBase64,
  newSalt,
  toBase64,
} from "./crypto";

// At-rest encryption via an encrypted vault.
//
// While UNLOCKED, the sensitive stores (expenses, income, profile, memories,
// chatMessages) live plaintext in their normal tables so every existing query
// (month filters, useLiveQuery, charts) keeps working untouched. A single
// vault record mirrors an AES-GCM-encrypted snapshot of all five tables; it is
// refreshed in the background on every data change (Dexie "storagemutated").
//
// On LOCK (manual, auto-lock, next visit, crash cleanup) the plaintext tables
// are cleared — only the encrypted vault blob + plaintext `settings` remain.
// The AES key is never stored: it is derived per-session from the passcode via
// PBKDF2 (≥310k iterations, random salt kept in the vault record). Wrong
// passcode = GCM tag check fails = friendly error. Lost passcode = unrecoverable.

const SENSITIVE_TABLES = ["expenses", "income", "profile", "memories", "chatMessages"] as const;

export interface SensitiveSnapshot {
  expenses: Expense[];
  income: Income[];
  profile: Profile[];
  memories: Memory[];
  chatMessages: ChatMessage[];
}

export type VaultStatus = "disabled" | "locked" | "unlocked";

export const DEFAULT_LOCK_AFTER_MINUTES = 15;
const MIN_PASSCODE_LENGTH = 4;
const SYNC_DEBOUNCE_MS = 300;

let status: VaultStatus = "disabled";
let currentKey: CryptoKey | null = null;
let currentSalt = "";
let currentIterations = KDF_ITERATIONS;
let lockAfterMinutes = DEFAULT_LOCK_AFTER_MINUTES;
let idleTimer: number | null = null;
let idleListenersAttached = false;
let syncQueued = false;

const listeners = new Set<() => void>();

function emit(): void {
  for (const fn of listeners) fn();
}

/** Subscribe to vault status changes (unlock/lock/enable/disable). Returns an unsubscribe fn. */
export function onVaultStatusChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getVaultStatus(): VaultStatus {
  return status;
}

export function getLockAfterMinutes(): number {
  return lockAfterMinutes;
}

// Resolve the boot state. Called once by VaultGate before rendering anything.
export async function resolveVaultStatus(): Promise<VaultStatus> {
  const s = await readSettings();
  if (!s.encryptionEnabled) {
    status = "disabled";
    currentKey = null;
    stopAutoLock();
    emit();
    return status;
  }

  lockAfterMinutes = s.lockAfterMinutes ?? DEFAULT_LOCK_AFTER_MINUTES;

  const vault = await db.vault.get(VAULT_ID);
  if (!vault) {
    // Flag on but no vault blob — inconsistent state. Fall back to disabled so
    // the user is never locked out of their (still-plaintext) data.
    await saveSettings({ encryptionEnabled: false });
    status = "disabled";
    currentKey = null;
    emit();
    return status;
  }

  currentSalt = vault.salt;
  currentIterations = vault.iterations;

  // Crash safety: if the tab died while unlocked, plaintext leftovers from
  // the old session must not rest on disk. The vault holds the freshest
  // snapshot (kept in sync on every write), so clearing is safe.
  await clearSensitiveTables();

  status = "locked";
  currentKey = null;
  emit();
  return status;
}

export async function enableEncryption(passcode: string, minutes: number = DEFAULT_LOCK_AFTER_MINUTES): Promise<void> {
  assertPasscode(passcode);
  const salt = newSalt();
  const key = await deriveKey(passcode, salt);
  const snapshot = await snapshotSensitive();
  const payload = await encryptJson(key, snapshot);
  await db.vault.put({
    id: VAULT_ID,
    ...payload,
    salt: toBase64(salt),
    iterations: KDF_ITERATIONS,
    version: 1,
    updatedAt: new Date().toISOString(),
  });
  await saveSettings({ encryptionEnabled: true, lockAfterMinutes: minutes });
  await clearSensitiveTables();

  currentKey = null;
  currentSalt = toBase64(salt);
  currentIterations = KDF_ITERATIONS;
  lockAfterMinutes = minutes;
  stopAutoLock();
  status = "locked";
  emit();
}

export async function unlock(passcode: string): Promise<void> {
  const vault = await db.vault.get(VAULT_ID);
  if (!vault) throw new Error("No encrypted vault found. Reset encryption in Settings.");
  const key = await deriveKey(passcode, fromBase64(vault.salt), vault.iterations);

  let snapshot: SensitiveSnapshot;
  try {
    snapshot = await decryptJson<SensitiveSnapshot>(key, { iv: vault.iv, data: vault.data });
  } catch {
    throw new Error("Wrong passcode.");
  }

  await writeSnapshotToTables(snapshot);
  currentKey = key;
  currentSalt = vault.salt;
  currentIterations = vault.iterations;
  status = "unlocked";
  emit();
  startAutoLock();
}

export async function lock(): Promise<void> {
  if (status !== "unlocked" || !currentKey) return;
  await syncVault();
  await clearSensitiveTables();
  stopAutoLock();
  currentKey = null;
  status = "locked";
  emit();
}

// Re-encrypt the current (plaintext) tables into the vault. No-op unless unlocked.
export async function syncVault(): Promise<void> {
  if (status !== "unlocked" || !currentKey) return;
  const snapshot = await snapshotSensitive();
  const payload = await encryptJson(currentKey, snapshot);
  await db.vault.put({
    id: VAULT_ID,
    ...payload,
    salt: currentSalt,
    iterations: currentIterations,
    version: 1,
    updatedAt: new Date().toISOString(),
  });
}

export async function changePasscode(currentPasscode: string, newPasscode: string): Promise<void> {
  if (status !== "unlocked") throw new Error("Unlock the app first.");
  assertPasscode(newPasscode);
  const vault = await db.vault.get(VAULT_ID);
  if (!vault) throw new Error("Encryption is not enabled.");

  const candidate = await deriveKey(currentPasscode, fromBase64(vault.salt), vault.iterations);
  try {
    await decryptJson(candidate, { iv: vault.iv, data: vault.data });
  } catch {
    throw new Error("Wrong current passcode.");
  }

  const snapshot = await snapshotSensitive();
  const newSaltBytes = newSalt();
  const newKey = await deriveKey(newPasscode, newSaltBytes);
  const payload = await encryptJson(newKey, snapshot);
  await db.vault.put({
    id: VAULT_ID,
    ...payload,
    salt: toBase64(newSaltBytes),
    iterations: KDF_ITERATIONS,
    version: 1,
    updatedAt: new Date().toISOString(),
  });

  currentKey = newKey;
  currentSalt = toBase64(newSaltBytes);
  currentIterations = KDF_ITERATIONS;
  emit();
}

export async function disableEncryption(): Promise<void> {
  if (status !== "unlocked") throw new Error("Unlock the app first.");
  await db.vault.delete(VAULT_ID);
  await saveSettings({ encryptionEnabled: false });
  stopAutoLock();
  currentKey = null;
  status = "disabled";
  emit();
}

export function configureAutoLock(minutes: number): void {
  lockAfterMinutes = minutes;
  void saveSettings({ lockAfterMinutes: minutes });
  if (status === "unlocked") resetIdleTimer();
}

// Full teardown for the danger-zone wipe: clears the vault record and returns
// the module to the "disabled" state.
export async function resetVault(): Promise<void> {
  await db.vault.delete(VAULT_ID);
  await saveSettings({ encryptionEnabled: false });
  stopAutoLock();
  currentKey = null;
  currentSalt = "";
  currentIterations = KDF_ITERATIONS;
  status = "disabled";
  emit();
}

// Encrypted backup: re-encrypts the live snapshot with the SAME passcode/salt,
// so it can be restored with the passcode. Verifies the passcode first.
export async function exportEncryptedBackup(passcode: string): Promise<string> {
  const vault = await db.vault.get(VAULT_ID);
  if (!vault) throw new Error("Encryption is not enabled.");

  const key = await deriveKey(passcode, fromBase64(vault.salt), vault.iterations);
  try {
    await decryptJson(key, { iv: vault.iv, data: vault.data });
  } catch {
    throw new Error("Wrong passcode.");
  }

  const snapshot = await snapshotSensitive();
  const payload = await encryptJson(key, snapshot);
  return JSON.stringify(
    {
      version: 1,
      kind: "hisaabi-vault",
      exportedAt: new Date().toISOString(),
      salt: vault.salt,
      iterations: vault.iterations,
      ...payload,
    },
    null,
    2,
  );
}

// Restore an encrypted backup. Repopulates the tables, re-writes the vault
// record (so future unlocks work with the same passcode), and enables encryption.
export async function importEncryptedBackup(text: string, passcode: string): Promise<void> {
  let parsed: {
    version?: number;
    kind?: string;
    salt?: string;
    iterations?: number;
    iv?: string;
    data?: string;
  };
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Not a valid backup file.");
  }
  if (parsed.kind !== "hisaabi-vault" || !parsed.salt || !parsed.iv || !parsed.data) {
    throw new Error("Not an encrypted Hisaabi backup.");
  }

  const iterations = parsed.iterations ?? KDF_ITERATIONS;
  const key = await deriveKey(passcode, fromBase64(parsed.salt), iterations);
  let snapshot: SensitiveSnapshot;
  try {
    snapshot = await decryptJson<SensitiveSnapshot>(key, { iv: parsed.iv, data: parsed.data });
  } catch {
    throw new Error("Wrong passcode.");
  }

  await writeSnapshotToTables(snapshot);
  await db.vault.put({
    id: VAULT_ID,
    salt: parsed.salt,
    iterations,
    iv: parsed.iv,
    data: parsed.data,
    version: parsed.version ?? 1,
    updatedAt: new Date().toISOString(),
  });
  await saveSettings({ encryptionEnabled: true, lockAfterMinutes });

  currentKey = key;
  currentSalt = parsed.salt;
  currentIterations = iterations;
  status = "unlocked";
  emit();
  startAutoLock();
}

// ---------- internals ----------

function assertPasscode(passcode: string): void {
  if (passcode.length < MIN_PASSCODE_LENGTH) {
    throw new Error(`Passcode must be at least ${MIN_PASSCODE_LENGTH} characters.`);
  }
}

async function snapshotSensitive(): Promise<SensitiveSnapshot> {
  const [expenses, income, profile, memories, chatMessages] = await Promise.all([
    db.expenses.toArray(),
    db.income.toArray(),
    db.profile.toArray(),
    db.memories.toArray(),
    db.chatMessages.toArray(),
  ]);
  return { expenses, income, profile, memories, chatMessages };
}

async function writeSnapshotToTables(s: SensitiveSnapshot): Promise<void> {
  await db.transaction("rw", [db.expenses, db.income, db.profile, db.memories, db.chatMessages], async () => {
    await clearSensitiveTables();
    if (s.expenses.length) await db.expenses.bulkPut(s.expenses);
    if (s.income.length) await db.income.bulkPut(s.income);
    if (s.profile.length) await db.profile.bulkPut(s.profile);
    if (s.memories.length) await db.memories.bulkPut(s.memories);
    if (s.chatMessages.length) await db.chatMessages.bulkPut(s.chatMessages);
  });
}

async function clearSensitiveTables(): Promise<void> {
  await Promise.all(SENSITIVE_TABLES.map((t) => db.table(t).clear()));
}

// ---------- background sync ----------

function scheduleSync(): void {
  if (syncQueued) return;
  syncQueued = true;
  window.setTimeout(() => {
    syncQueued = false;
    void syncVault();
  }, SYNC_DEBOUNCE_MS);
}

// Every committed write to a sensitive table refreshes the vault snapshot.
// Fires after commit for both local and cross-tab mutations, so the vault
// never goes stale even if the tab is killed while unlocked.
if (typeof window !== "undefined") {
  Dexie.on("storagemutated", (parts) => {
    const touched = Object.keys(parts).some((part) => {
      // part format: "idb://<db>/<table>/<index>"
      const table = part.split("/")[3];
      return (SENSITIVE_TABLES as readonly string[]).includes(table);
    });
    if (touched) scheduleSync();
  });

  // Best-effort flush before the page is hidden/closed so the latest writes
  // survive a browser kill (backgrounded app, OS close, etc.).
  window.addEventListener("pagehide", () => {
    if (status === "unlocked") void syncVault();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && status === "unlocked") void syncVault();
  });
}

// ---------- auto-lock ----------

const IDLE_EVENTS = ["pointerdown", "keydown", "touchstart", "wheel"] as const;

function startAutoLock(): void {
  if (idleListenersAttached) return;
  idleListenersAttached = true;
  for (const e of IDLE_EVENTS) window.addEventListener(e, onActivity, { passive: true });
  resetIdleTimer();
}

function stopAutoLock(): void {
  if (!idleListenersAttached) return;
  idleListenersAttached = false;
  for (const e of IDLE_EVENTS) window.removeEventListener(e, onActivity);
  if (idleTimer !== null) {
    window.clearTimeout(idleTimer);
    idleTimer = null;
  }
}

function onActivity(): void {
  resetIdleTimer();
}

function resetIdleTimer(): void {
  if (idleTimer !== null) window.clearTimeout(idleTimer);
  if (lockAfterMinutes <= 0) {
    idleTimer = null;
    return;
  }
  idleTimer = window.setTimeout(() => {
    idleTimer = null;
    void lock();
  }, lockAfterMinutes * 60_000);
}
