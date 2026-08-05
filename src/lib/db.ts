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

export type Provider = "openai" | "anthropic" | "gemini" | "ollama" | "groq";

// Single-record table; we always use id = 1.
export interface Settings {
  id: number;
  provider: Provider;
  apiKey: string;
  model: string;
  ollamaUrl?: string;
  baseUrl?: string; // OpenAI provider only: override for a proxy/gateway (OpenRouter, LiteLLM, etc.)
}

export const PROFILE_ID = 1;
export const SETTINGS_ID = 1;

const db = new Dexie("hisaabi") as Dexie & {
  expenses: EntityTable<Expense, "id">;
  income: EntityTable<Income, "id">;
  profile: EntityTable<Profile, "id">;
  memories: EntityTable<Memory, "id">;
  chatMessages: EntityTable<ChatMessage, "id">;
  settings: EntityTable<Settings, "id">;
};

db.version(1).stores({
  expenses: "++id, date, category, createdAt",
  income: "++id, date, createdAt",
  profile: "id",
  memories: "++id, createdAt",
  chatMessages: "++id, createdAt",
  settings: "id",
});

export { db };
