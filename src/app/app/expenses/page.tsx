"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Expense, type Income } from "@/lib/db";
import { currentMonthKey, nextMonth, prevMonth } from "@/lib/analytics";
import { getProfile } from "@/lib/store";

type Row = { type: "expense"; item: Expense } | { type: "income"; item: Income };

export default function ExpensesPage() {
  const [month, setMonth] = useState(currentMonthKey());
  const [category, setCategory] = useState("all");
  const [lastDeleted, setLastDeleted] = useState<Row | null>(null);

  const data = useLiveQuery(async () => {
    const from = `${month}-01`;
    const to = `${month}-32`;
    const [expenses, income, profile] = await Promise.all([
      db.expenses.where("date").between(from, to, true, false).toArray(),
      db.income.where("date").between(from, to, true, false).toArray(),
      getProfile(),
    ]);
    return { expenses, income, profile };
  }, [month]);

  if (!data) return <div className="py-16 text-center text-sm text-slate-500">Loading…</div>;

  const { expenses, income, profile } = data;
  const money = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: profile.currency,
    maximumFractionDigits: 0,
  });

  const cats = [...new Set(expenses.map((e) => e.category))].sort();
  const visibleExpenses = category === "all" ? expenses : expenses.filter((e) => e.category === category);

  const rows: Row[] = [
    ...visibleExpenses.map((e) => ({ type: "expense" as const, item: e })),
    ...income.map((i) => ({ type: "income" as const, item: i })),
  ].sort((a, b) => {
    const d = b.item.date.localeCompare(a.item.date);
    return d !== 0 ? d : b.item.createdAt.localeCompare(a.item.createdAt);
  });

  const byDate = new Map<string, Row[]>();
  for (const r of rows) {
    const list = byDate.get(r.item.date) ?? [];
    list.push(r);
    byDate.set(r.item.date, list);
  }

  const spent = visibleExpenses.reduce((s, e) => s + e.amount, 0);
  const earned = income.reduce((s, i) => s + i.amount, 0);
  const isCurrent = month === currentMonthKey();
  const monthLabel = new Date(`${month}-01`).toLocaleString("en-IN", { month: "long", year: "numeric" });

  async function onDelete(row: Row) {
    if (row.type === "expense") await db.expenses.delete(row.item.id);
    else await db.income.delete(row.item.id);
    setLastDeleted(row);
  }

  async function undoDelete() {
    if (!lastDeleted) return;
    if (lastDeleted.type === "expense") await db.expenses.put(lastDeleted.item);
    else await db.income.put(lastDeleted.item);
    setLastDeleted(null);
  }

  const changeMonth = (fn: (m: string) => string) => () => {
    setMonth(fn(month));
    setCategory("all");
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-sm text-slate-500">Review and remove what&apos;s been logged.</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={changeMonth(prevMonth)} aria-label="Previous month" className={navCls}>
            ←
          </button>
          <span className="min-w-36 text-center text-sm font-medium">{monthLabel}</span>
          <button onClick={changeMonth(nextMonth)} aria-label="Next month" disabled={isCurrent} className={navCls}>
            →
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {rows.length} {rows.length === 1 ? "entry" : "entries"} · spent {money.format(spent)}
          {earned > 0 ? ` · earned ${money.format(earned)}` : ""}
        </p>
        {cats.length > 0 && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-200 bg-background px-2.5 py-1.5 text-sm dark:border-slate-800"
          >
            <option value="all">All categories</option>
            {cats.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
          {category === "all"
            ? "Nothing logged this month yet. Log an expense in chat."
            : "No expenses in this category this month."}
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {[...byDate.entries()].map(([date, dayRows]) => (
            <section key={date}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </h2>
              <div className="flex flex-col gap-2">
                {dayRows.map((row) => (
                  <RowView key={row.item.id} row={row} money={money} onDelete={onDelete} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {lastDeleted && (
        <div className="sticky bottom-4 mt-auto flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-background px-4 py-3 shadow-lg dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Deleted{" "}
            <span className="font-medium">
              {lastDeleted.type === "expense" ? lastDeleted.item.category : "income"} {money.format(lastDeleted.item.amount)}
            </span>
            .
          </p>
          <button onClick={undoDelete} className={btnCls}>
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

const navCls =
  "rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:hover:bg-slate-800";
const btnCls =
  "rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:opacity-90";

function RowView({
  row,
  money,
  onDelete,
}: {
  row: Row;
  money: Intl.NumberFormat;
  onDelete: (row: Row) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {row.type === "expense" ? row.item.category : row.item.source}
        </p>
        {row.type === "expense" && row.item.note && (
          <p className="truncate text-xs text-slate-500">{row.item.note}</p>
        )}
      </div>
      <span
        className={`text-sm font-semibold ${row.type === "expense" ? "" : "text-green-600 dark:text-green-400"}`}
      >
        {row.type === "expense" ? "" : "+"}
        {money.format(row.item.amount)}
      </span>
      <button
        onClick={() => onDelete(row)}
        aria-label={`Delete ${row.type === "expense" ? row.item.category : row.item.source}`}
        className="rounded-md px-1.5 py-0.5 text-lg leading-none text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
      >
        ×
      </button>
    </div>
  );
}
