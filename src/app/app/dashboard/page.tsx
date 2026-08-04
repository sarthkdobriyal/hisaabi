"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { DataResidencyBadge } from "@/components/DataResidencyBadge";
import { db } from "@/lib/db";
import { currentMonthKey, prevMonth, summarize } from "@/lib/analytics";
import { getProfile } from "@/lib/store";

export default function DashboardPage() {
  const summary = useLiveQuery(async () => {
    const month = currentMonthKey();
    const from = `${prevMonth(month)}-01`;
    const to = `${month}-32`;
    const [expenses, income, profile] = await Promise.all([
      db.expenses.where("date").between(from, to, true, false).toArray(),
      db.income.where("date").between(from, to, true, false).toArray(),
      getProfile(),
    ]);
    return summarize(month, expenses, income, profile);
  }, []);

  if (!summary) {
    return <div className="py-16 text-center text-sm text-slate-500">Loading dashboard…</div>;
  }

  const money = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: summary.currency,
    maximumFractionDigits: 0,
  });
  const maxDay = Math.max(...summary.byDay.map((d) => d.total), 1);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DataResidencyBadge />

      <header className="flex flex-col gap-1">
        <p className="text-sm font-medium text-brand">{summary.month}</p>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500">Your monthly money picture, computed locally from this browser.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Income" value={money.format(summary.incomeTotal)} tone="good" />
        <StatCard label="Expenses" value={money.format(summary.expenseTotal)} tone="bad" />
        <StatCard label="Net" value={money.format(summary.net)} tone={summary.net >= 0 ? "good" : "bad"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Section title="Category spend" empty={!summary.byCategory.length} emptyText="No expenses logged this month yet.">
          <div className="grid gap-3">
            {summary.byCategory.map((c) => {
              const pct = c.budgetLimit ? Math.min((c.total / c.budgetLimit) * 100, 100) : 0;
              return (
                <div key={c.category} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{c.category}</p>
                      {c.budgetLimit && (
                        <p className={`mt-1 text-xs ${c.overBudget ? "text-red-600" : "text-slate-500"}`}>
                          {money.format(c.total)} of {money.format(c.budgetLimit)}
                        </p>
                      )}
                    </div>
                    <p className="font-semibold">{money.format(c.total)}</p>
                  </div>
                  {c.budgetLimit && (
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full ${c.overBudget ? "bg-red-500" : "brand-gradient"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Daily spend" empty={!summary.byDay.length} emptyText="Daily bars appear after you log expenses.">
          <div className="grid gap-3">
            {summary.byDay.map((d) => (
              <div key={d.date} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 text-sm">
                <span className="text-slate-500">{d.date.slice(5)}</span>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${(d.total / maxDay) * 100}%` }} />
                </div>
                <span className="font-medium">{money.format(d.total)}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section title="Month over month">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Expenses are {money.format(Math.abs(summary.prev.deltaAmount))} {summary.prev.deltaAmount >= 0 ? "higher" : "lower"} than {summary.prev.month}
          {summary.prev.deltaPct === null ? "." : ` (${Math.abs(summary.prev.deltaPct)}%).`}
        </p>
      </Section>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "good" | "bad" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-background p-5 shadow-sm dark:border-slate-800">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${tone === "good" ? "text-brand-600" : "text-red-600"}`}>{value}</p>
    </div>
  );
}

function Section({
  title,
  empty,
  emptyText,
  children,
}: {
  title: string;
  empty?: boolean;
  emptyText?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-background p-6 shadow-sm dark:border-slate-800">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <div className="mt-5">
        {empty ? <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">{emptyText}</p> : children}
      </div>
    </section>
  );
}
