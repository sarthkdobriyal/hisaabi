// Runnable with: node --experimental-strip-types src/lib/analytics.selfcheck.ts
// Pure — no IndexedDB. Fails loudly if the month math breaks.
import assert from "node:assert/strict";
import { prevMonth, daysInMonth, summarize, aggregateRange } from "./analytics.ts";
import type { Expense, Income } from "./db.ts";

const exp = (id: number, amount: number, category: string, date: string): Expense => ({
  id, amount, category, date, createdAt: `${date}T00:00:00.000Z`,
});
const inc = (id: number, amount: number, date: string): Income => ({
  id, amount, source: "salary", date, createdAt: `${date}T00:00:00.000Z`,
});

// year-wrap + leap year
assert.equal(prevMonth("2026-01"), "2025-12");
assert.equal(prevMonth("2026-08"), "2026-07");
assert.equal(daysInMonth("2024-02"), 29);
assert.equal(daysInMonth("2026-02"), 28);
assert.equal(daysInMonth("2026-08"), 31);

const profile = { currency: "INR", budgetGoals: [{ category: "Groceries", limit: 3000 }] };
const expenses = [
  exp(1, 500, "Groceries", "2026-08-04"),
  exp(2, 3000, "Groceries", "2026-08-20"), // pushes Groceries to 3500 > 3000
  exp(3, 200, "Transport", "2026-08-31"), // month-edge day, must be included
  exp(4, 999, "Groceries", "2026-09-01"), // next month, must be excluded
  exp(5, 1000, "Rent", "2026-07-15"), // prev month → only counts toward prev total
];
const income = [inc(1, 50000, "2026-08-01"), inc(2, 9, "2026-07-01")];

const s = summarize("2026-08", expenses, income, profile);

assert.equal(s.expenseTotal, 3700); // 500 + 3000 + 200, Sept excluded
assert.equal(s.incomeTotal, 50000); // July income excluded
assert.equal(s.net, 46300);
assert.equal(s.byCategory[0].category, "Groceries"); // sorted desc
assert.equal(s.byCategory[0].total, 3500);
assert.equal(s.byCategory[0].overBudget, true);
assert.equal(s.byCategory.find((c) => c.category === "Transport")?.overBudget, false);
assert.equal(s.prev.expenseTotal, 1000); // July rent
assert.equal(s.prev.deltaAmount, 2700);
assert.equal(s.prev.deltaPct, 270); // (3700-1000)/1000
assert.equal(s.byDay.length, 3);
assert.equal(s.byDay[0].date, "2026-08-04"); // asc

// prev = 0 → deltaPct null, not Infinity
const s2 = summarize("2026-08", [exp(1, 100, "Food", "2026-08-01")], [], { currency: "INR", budgetGoals: [] });
assert.equal(s2.prev.expenseTotal, 0);
assert.equal(s2.prev.deltaPct, null);

// aggregateRange: inclusive bounds, category filter, groupBy
const range = [
  exp(1, 100, "Food", "2026-08-01"), // from-edge, included
  exp(2, 200, "Food", "2026-08-15"),
  exp(3, 50, "Transport", "2026-08-15"),
  exp(4, 999, "Food", "2026-08-31"), // to-edge, included
  exp(5, 1, "Food", "2026-07-31"), // before from, excluded
];
const all = aggregateRange(range, { from: "2026-08-01", to: "2026-08-31" });
assert.equal(all.total, 1349); // 100+200+50+999, July excluded
assert.equal(all.count, 4);

const food = aggregateRange(range, { from: "2026-08-01", to: "2026-08-31", category: "Food" });
assert.equal(food.total, 1299);
assert.equal(food.count, 3);

const byCat = aggregateRange(range, { from: "2026-08-01", to: "2026-08-31", groupBy: "category" });
assert.equal(byCat.groups?.[0].key, "Food"); // desc by total
assert.equal(byCat.groups?.[0].total, 1299);
assert.equal(byCat.groups?.[1].key, "Transport");

const byDay = aggregateRange(range, { from: "2026-08-01", to: "2026-08-31", groupBy: "day" });
assert.equal(byDay.groups?.find((g) => g.key === "2026-08-15")?.total, 250);

console.log("analytics self-check passed");
