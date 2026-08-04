import { db, type Profile } from "./db";
import { currentMonthKey, prevMonth, summarize, type MonthlySummary } from "./analytics";

// Dexie query layer: pull only the two months we need, then delegate the math
// to the pure summarize().

export async function getMonthlySummary(
  monthKey = currentMonthKey(),
  profile?: Pick<Profile, "currency" | "budgetGoals">,
): Promise<MonthlySummary> {
  const from = `${prevMonth(monthKey)}-01`; // prev + current month only, not the whole table
  const to = `${monthKey}-32`; // upper bound past any valid day in monthKey

  const [expenses, income, prof] = await Promise.all([
    db.expenses.where("date").between(from, to, true, false).toArray(),
    db.income.where("date").between(from, to, true, false).toArray(),
    profile ? Promise.resolve(profile) : loadProfileForSummary(),
  ]);

  return summarize(monthKey, expenses, income, prof);
}

async function loadProfileForSummary(): Promise<Pick<Profile, "currency" | "budgetGoals">> {
  const p = await db.profile.get(1);
  return { currency: p?.currency ?? "INR", budgetGoals: p?.budgetGoals ?? [] };
}
