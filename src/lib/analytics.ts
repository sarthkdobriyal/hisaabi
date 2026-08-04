import type { Expense, Income, Profile } from "./db";

// The single source of truth for "what did this month look like".
// Both the dashboard and the AI context consume this exact shape, so the
// numbers they show can never disagree. The AI never does arithmetic — it
// reads these pre-computed values.
//
// This module is PURE (type-only imports) so its month-boundary math is
// runnable without IndexedDB. The Dexie query layer lives in analytics.query.ts.

export interface CategorySummary {
  category: string;
  total: number;
  budgetLimit?: number;
  overBudget: boolean;
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  currency: string;
  expenseTotal: number;
  incomeTotal: number;
  net: number; // income - expense
  byCategory: CategorySummary[]; // desc by total
  byDay: { date: string; total: number }[]; // asc, sparse (only days with spend)
  daysInMonth: number;
  prev: {
    month: string; // YYYY-MM
    expenseTotal: number;
    deltaAmount: number; // this - prev
    deltaPct: number | null; // null when prev is 0 (undefined growth)
  };
}

// --- Pure date helpers (string slicing → no timezone drift) ---
// Dates are stored as "YYYY-MM-DD", so the month key is just the first 7 chars.

export function monthOf(date: string): string {
  return date.slice(0, 7);
}

export function prevMonth(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
}

export function nextMonth(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
}

export function daysInMonth(monthKey: string): number {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m, 0).getDate(); // day 0 of next month = last day of this one
}

export function currentMonthKey(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

// --- Arbitrary-range aggregation, for the AI's query_expenses tool. ---
// Returns aggregates only (never raw rows), so the prompt never sees line items.

export type GroupBy = "category" | "day" | "none";

export interface RangeQuery {
  from: string; // YYYY-MM-DD inclusive
  to: string; // YYYY-MM-DD inclusive
  category?: string;
  groupBy?: GroupBy;
}

export interface RangeResult {
  from: string;
  to: string;
  total: number;
  count: number;
  groups?: { key: string; total: number; count: number }[]; // desc by total
}

export function aggregateRange(expenses: Expense[], q: RangeQuery): RangeResult {
  const rows = expenses.filter(
    (e) => e.date >= q.from && e.date <= q.to && (!q.category || e.category === q.category),
  );
  const total = round2(rows.reduce((s, e) => s + e.amount, 0));
  const result: RangeResult = { from: q.from, to: q.to, total, count: rows.length };

  if (q.groupBy && q.groupBy !== "none") {
    const acc = new Map<string, { total: number; count: number }>();
    for (const e of rows) {
      const key = q.groupBy === "day" ? e.date : e.category;
      const g = acc.get(key) ?? { total: 0, count: 0 };
      acc.set(key, { total: g.total + e.amount, count: g.count + 1 });
    }
    result.groups = [...acc.entries()]
      .map(([key, g]) => ({ key, total: round2(g.total), count: g.count }))
      .sort((a, b) => b.total - a.total);
  }
  return result;
}

// --- Pure aggregation: arrays in, summary out. This is the testable core. ---

export function summarize(
  monthKey: string,
  expenses: Expense[],
  income: Income[],
  profile: Pick<Profile, "currency" | "budgetGoals">,
): MonthlySummary {
  const prevKey = prevMonth(monthKey);
  const thisMonth = expenses.filter((e) => monthOf(e.date) === monthKey);
  const prevExpenses = expenses.filter((e) => monthOf(e.date) === prevKey);
  const thisIncome = income.filter((i) => monthOf(i.date) === monthKey);

  const expenseTotal = round2(thisMonth.reduce((s, e) => s + e.amount, 0));
  const incomeTotal = round2(thisIncome.reduce((s, i) => s + i.amount, 0));
  const prevTotal = round2(prevExpenses.reduce((s, e) => s + e.amount, 0));

  const limits = new Map(profile.budgetGoals.map((g) => [g.category, g.limit]));
  const catTotals = new Map<string, number>();
  for (const e of thisMonth) catTotals.set(e.category, (catTotals.get(e.category) ?? 0) + e.amount);

  const byCategory: CategorySummary[] = [...catTotals.entries()]
    .map(([category, raw]) => {
      const total = round2(raw);
      const budgetLimit = limits.get(category);
      return { category, total, budgetLimit, overBudget: budgetLimit != null && total > budgetLimit };
    })
    .sort((a, b) => b.total - a.total);

  const dayTotals = new Map<string, number>();
  for (const e of thisMonth) dayTotals.set(e.date, (dayTotals.get(e.date) ?? 0) + e.amount);
  const byDay = [...dayTotals.entries()]
    .map(([date, raw]) => ({ date, total: round2(raw) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    month: monthKey,
    currency: profile.currency,
    expenseTotal,
    incomeTotal,
    net: round2(incomeTotal - expenseTotal),
    byCategory,
    byDay,
    daysInMonth: daysInMonth(monthKey),
    prev: {
      month: prevKey,
      expenseTotal: prevTotal,
      deltaAmount: round2(expenseTotal - prevTotal),
      deltaPct: prevTotal === 0 ? null : round2(((expenseTotal - prevTotal) / prevTotal) * 100),
    },
  };
}
