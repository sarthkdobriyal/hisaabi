import { db, type BudgetGoal, type RecurringBill } from "./db";
import { getProfile, saveProfile } from "./store";
import { getMonthlySummary } from "./analytics.query";
import { aggregateRange, type GroupBy, type MonthlySummary, type RangeResult } from "./analytics";

// The AI's function-calling surface. Each handler validates its args (the LLM
// is a trust boundary — it can emit malformed JSON) then hits IndexedDB.
// query_expenses returns aggregates only; raw rows never reach the prompt.
//
// This module is SDK-agnostic on purpose: TOOL_DEFS is plain JSON Schema and
// runTool() is a string dispatcher, so the chat layer can adapt these to the
// Vercel AI SDK (or anything else) without rewriting the handlers.

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

class ToolError extends Error {}

function num(v: unknown, field: string): number {
  const n = typeof v === "string" ? Number(v) : v;
  if (typeof n !== "number" || !Number.isFinite(n)) throw new ToolError(`${field} must be a number`);
  return n;
}

function positive(v: unknown, field: string): number {
  const n = num(v, field);
  if (n <= 0) throw new ToolError(`${field} must be greater than 0`);
  return n;
}

function str(v: unknown, field: string): string {
  if (typeof v !== "string" || v.trim() === "") throw new ToolError(`${field} is required`);
  return v.trim();
}

// Missing date is forgiving (default today); a malformed one is rejected so the
// AI retries rather than silently writing a bad row.
function date(v: unknown): string {
  if (v == null || v === "") return todayISO();
  const s = String(v);
  if (!DATE_RE.test(s)) throw new ToolError(`date must be YYYY-MM-DD, got "${s}"`);
  return s;
}

type Args = Record<string, unknown>;

// --- Handlers ---

export async function addExpense(a: Args) {
  const row = {
    amount: positive(a.amount, "amount"),
    category: str(a.category, "category"),
    note: typeof a.note === "string" ? a.note.trim() || undefined : undefined,
    date: date(a.date),
    createdAt: new Date().toISOString(),
  };
  const id = await db.expenses.add(row);
  return { id, ...row };
}

export async function addIncome(a: Args) {
  const row = {
    amount: positive(a.amount, "amount"),
    source: str(a.source, "source"),
    date: date(a.date),
    createdAt: new Date().toISOString(),
  };
  const id = await db.income.add(row);
  return { id, ...row };
}

export async function deleteExpense(a: Args): Promise<{ id: number; deleted: boolean }> {
  const id = num(a.id, "id");
  const existed = (await db.expenses.get(id)) != null;
  if (existed) await db.expenses.delete(id);
  return { id, deleted: existed };
}

export async function queryExpenses(a: Args): Promise<RangeResult> {
  const from = date(a.from);
  const to = date(a.to);
  const category = typeof a.category === "string" && a.category.trim() ? a.category.trim() : undefined;
  const groupBy = (["category", "day", "none"] as GroupBy[]).includes(a.groupBy as GroupBy)
    ? (a.groupBy as GroupBy)
    : "none";
  const rows = await db.expenses.where("date").between(from, to, true, true).toArray();
  return aggregateRange(rows, { from, to, category, groupBy });
}

export async function updateProfile(a: Args) {
  const patch: Parameters<typeof saveProfile>[0] = {};
  if (a.salary != null) patch.salary = positive(a.salary, "salary");
  if (a.currency != null) patch.currency = str(a.currency, "currency");
  if (Array.isArray(a.budgetGoals)) patch.budgetGoals = a.budgetGoals as BudgetGoal[];
  if (Array.isArray(a.recurringBills)) patch.recurringBills = a.recurringBills as RecurringBill[];
  return saveProfile(patch);
}

export async function saveMemory(a: Args) {
  const row = { note: str(a.note, "note"), createdAt: new Date().toISOString() };
  const id = await db.memories.add(row);
  return { id, ...row };
}

// --- Dispatcher: the chat layer calls this with the model's tool name + args ---

const HANDLERS = {
  add_expense: addExpense,
  add_income: addIncome,
  delete_expense: deleteExpense,
  query_expenses: queryExpenses,
  update_profile: updateProfile,
  save_memory: saveMemory,
} as const;

export type ToolName = keyof typeof HANDLERS;

export async function runTool(name: string, args: Args): Promise<unknown> {
  const handler = HANDLERS[name as ToolName];
  if (!handler) throw new ToolError(`unknown tool: ${name}`);
  return handler(args);
}

// --- JSON Schema definitions handed to the model ---

const s = (type: string, description: string) => ({ type, description });

export const TOOL_DEFS = [
  {
    name: "add_expense",
    description: "Record a single expense the user made.",
    parameters: {
      type: "object",
      properties: {
        amount: s("number", "Amount spent, positive."),
        category: s("string", "Spending category, e.g. Groceries, Transport."),
        note: s("string", "Optional short note about the expense."),
        date: s("string", "Date as YYYY-MM-DD. Omit for today."),
      },
      required: ["amount", "category"],
    },
  },
  {
    name: "add_income",
    description: "Record income received (salary, refund, gift, etc.).",
    parameters: {
      type: "object",
      properties: {
        amount: s("number", "Amount received, positive."),
        source: s("string", "Where the income came from, e.g. Salary."),
        date: s("string", "Date as YYYY-MM-DD. Omit for today."),
      },
      required: ["amount", "source"],
    },
  },
  {
    name: "query_expenses",
    description:
      "Get spending TOTALS for a date range. Use this for any 'how much' question — never add up numbers yourself. Returns aggregates, not individual expenses.",
    parameters: {
      type: "object",
      properties: {
        from: s("string", "Start date YYYY-MM-DD, inclusive."),
        to: s("string", "End date YYYY-MM-DD, inclusive."),
        category: s("string", "Optional: limit to one category."),
        groupBy: { type: "string", enum: ["category", "day", "none"], description: "Optional grouping." },
      },
      required: ["from", "to"],
    },
  },
  {
    name: "update_profile",
    description: "Update the user's salary, currency, budget goals, or recurring bills.",
    parameters: {
      type: "object",
      properties: {
        salary: s("number", "Monthly salary, positive."),
        currency: s("string", "Currency code, e.g. INR."),
        budgetGoals: {
          type: "array",
          description: "Per-category spending limits.",
          items: {
            type: "object",
            properties: { category: s("string", "Category"), limit: s("number", "Monthly limit") },
            required: ["category", "limit"],
          },
        },
        recurringBills: {
          type: "array",
          description: "Recurring monthly bills.",
          items: {
            type: "object",
            properties: {
              name: s("string", "Bill name"),
              amount: s("number", "Amount"),
              dayOfMonth: s("number", "Day of month it's due, 1-31"),
            },
            required: ["name", "amount", "dayOfMonth"],
          },
        },
      },
    },
  },
  {
    name: "save_memory",
    description:
      "Remember a durable fact or preference the user states, e.g. 'I get paid on the 1st' or 'ignore my rent when budgeting'.",
    parameters: {
      type: "object",
      properties: { note: s("string", "The fact to remember.") },
      required: ["note"],
    },
  },
  {
    name: "delete_expense",
    description: "Delete a previously recorded expense by its id.",
    parameters: {
      type: "object",
      properties: { id: s("number", "The expense id to delete.") },
      required: ["id"],
    },
  },
] as const;

// --- Context assembly: what we send the model on every turn ---

export interface ChatContext {
  system: string;
  summary: MonthlySummary;
  profile: { salary?: number; currency: string; budgetGoals: BudgetGoal[]; recurringBills: RecurringBill[] };
  memories: string[];
  recentMessages: { role: string; content: string }[];
}

export async function assembleContext(historyLimit = 10): Promise<ChatContext> {
  const [profile, summary, memRows, recent] = await Promise.all([
    getProfile(),
    getMonthlySummary(),
    db.memories.orderBy("createdAt").toArray(),
    db.chatMessages.orderBy("createdAt").reverse().limit(historyLimit).toArray(),
  ]);

  return {
    system: buildSystemPrompt(),
    summary,
    profile: {
      salary: profile.salary,
      currency: profile.currency,
      budgetGoals: profile.budgetGoals,
      recurringBills: profile.recurringBills,
    },
    memories: memRows.map((m) => m.note),
    recentMessages: recent.reverse().map((m) => ({ role: m.role, content: m.content })),
  };
}

function buildSystemPrompt(): string {
  return [
    "You are Hisaabi, a private expense-tracking assistant. All data lives in the user's browser.",
    `Today is ${todayISO()}.`,
    "",
    "Rules:",
    "- To record money in/out, call add_expense or add_income. Confirm each write plainly (amount, category, date).",
    "- NEVER compute totals or sums yourself. For any 'how much did I spend' question, call query_expenses and report its numbers verbatim.",
    "- If the input is ambiguous (e.g. an amount with no category), ask ONE short clarifying question instead of guessing.",
    "- Use the user's currency and the monthly summary provided for context. Dates are YYYY-MM-DD; omit date to mean today.",
    "- When the user states a durable fact or preference, call save_memory.",
    "- Be concise and friendly. Never claim data is stored anywhere but this device.",
  ].join("\n");
}
