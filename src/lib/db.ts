import Dexie, { type EntityTable } from "dexie";

// All dates are stored as ISO "YYYY-MM-DD" strings so Dexie range queries
// (between/above/below) work directly for month filtering.

export interface Expense {
  id: number;
  amount: number;
  category: string;
  note?: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO timestamp
  account?: "cash" | "bank"; // which balance this came out of; bank by default
}

export interface Income {
  id: number;
  amount: number;
  source: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
  account?: "cash" | "bank"; // which balance this landed in; bank by default
}

export interface BudgetGoal {
  category: string;
  limit: number;
}

export interface RecurringBill {
  name: string;
  amount: number;
  dayOfMonth: number;
  lastPaidMonth?: string; // YYYY-MM, set when the user confirms the bill was deducted
}

// Single-record table; we always use id = 1.
export interface Profile {
  id: number;
  salary?: number;
  salaryDate?: number; // day of month
  lastCreditedMonth?: string; // YYYY-MM, when the user confirmed salary landed
  currency: string; // default INR
  budgetGoals: BudgetGoal[];
  recurringBills: RecurringBill[];
  customCategories: string[];
  cashBalance?: number; // running cash-in-hand total
  bankBalance?: number; // running bank total
}

export interface Memory {
  id: number;
  note: string;
  createdAt: string;
}

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: number;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export type Provider = "openai" | "anthropic" | "gemini" | "ollama" | "groq" | "custom";

// Single-record table; we always use id = 1.
export interface Settings {
  id: number;
  provider: Provider;
  apiKey: string;
  model: string;
  ollamaUrl?: string;
  baseUrl?: string; // OpenAI provider only: override for a proxy/gateway (OpenRouter, LiteLLM, etc.)
  encryptionEnabled?: boolean; // passcode-lock encrypts the sensitive stores at rest
  lockAfterMinutes?: number; // auto-lock idle timeout (0 = never)
}

// Single-record table (id = 1). Holds the AES-GCM-encrypted snapshot of all
// sensitive stores (expenses, income, profile, memories, chatMessages). This
// is the only form in which data rests when the app is locked.
export interface VaultRecord {
  id: number;
  salt: string; // base64, random PBKDF2 salt (stable per key so the passcode re-derives it)
  iterations: number; // PBKDF2 iteration count used at derive time
  iv: string; // base64 AES-GCM nonce
  data: string; // base64 ciphertext of the JSON snapshot
  version: number; // snapshot schema version
  updatedAt: string; // ISO timestamp
}

export const PROFILE_ID = 1;
export const SETTINGS_ID = 1;
export const VAULT_ID = 1;

const db = new Dexie("hisaabi") as Dexie & {
  expenses: EntityTable<Expense, "id">;
  income: EntityTable<Income, "id">;
  profile: EntityTable<Profile, "id">;
  memories: EntityTable<Memory, "id">;
  chatMessages: EntityTable<ChatMessage, "id">;
  settings: EntityTable<Settings, "id">;
  vault: EntityTable<VaultRecord, "id">;
};

db.version(1).stores({
  expenses: "++id, date, category, createdAt",
  income: "++id, date, createdAt",
  profile: "id",
  memories: "++id, createdAt",
  chatMessages: "++id, createdAt",
  settings: "id",
});

db.version(2).stores({
  expenses: "++id, date, category, createdAt",
  income: "++id, date, createdAt",
  profile: "id",
  memories: "++id, createdAt",
  chatMessages: "++id, createdAt",
  settings: "id",
  vault: "id",
});

export { db };
