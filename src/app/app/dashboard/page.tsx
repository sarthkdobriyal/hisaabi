"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db, type Expense, type Income } from "@/lib/db";
import { currentMonthKey, nextMonth, prevMonth, summarize } from "@/lib/analytics";
import { readProfile, saveProfile } from "@/lib/store";
import { dueBills, salaryDue, monthKey } from "@/lib/recurring";
import { currencyFmt } from "@/lib/format";
import { DataResidencyBadge } from "@/components/DataResidencyBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartData } from "@/components/charts/DashboardCharts";

const DashboardCharts = dynamic(() => import("@/components/charts/DashboardCharts"), {
  ssr: false,
  loading: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className={`h-72 rounded-2xl ${i === 2 ? "lg:col-span-2" : ""}`} />
      ))}
    </div>
  ),
});

export default function DashboardPage() {
  const [month, setMonth] = useState(currentMonthKey());
  const isCurrent = month === currentMonthKey();
  const monthLabel = new Date(`${month}-01`).toLocaleString("en-IN", { month: "long", year: "numeric" });

  const data = useLiveQuery(async () => {
    const prev = prevMonth(month);
    const from = `${prev}-01`;
    const to = `${month}-32`;
    const [expenses, income, profile] = await Promise.all([
      db.expenses.where("date").between(from, to, true, false).toArray(),
      db.income.where("date").between(from, to, true, false).toArray(),
      readProfile(),
    ]);
    const summary = summarize(month, expenses, income, profile);
    const thisExpenses = expenses.filter((e) => e.date >= `${month}-01` && e.date <= `${month}-31`);
    const thisIncome = income.filter((i) => i.date >= `${month}-01` && i.date <= `${month}-31`);
    return { summary, profile, thisExpenses, thisIncome };
  }, [month]);

  if (!data) return <DashSkeleton />;

  const { summary, profile, thisExpenses, thisIncome } = data;
  const money = currencyFmt(summary.currency);

  // Income aggregated by day (same shape as byDay) for trend chart.
  const incomeByDay = computeByDay(thisIncome);
  const chartData: ChartData = {
    byDay: summary.byDay,
    byCategory: summary.byCategory,
    incomeByDay,
    currency: summary.currency,
  };

  // Cash vs bank split from raw expense rows.
  const cashSpend = thisExpenses.filter((e) => e.account === "cash").reduce((s, e) => s + e.amount, 0);
  const bankSpend = thisExpenses.reduce((s, e) => s + e.amount, 0) - cashSpend;

  // Budget rollup.
  const budgeted = summary.byCategory.filter((c) => c.budgetLimit != null);
  const budgetUsed = budgeted.reduce((s, c) => s + c.total, 0);
  const budgetLimit = budgeted.reduce((s, c) => s + (c.budgetLimit ?? 0), 0);
  const overBudget = budgeted.filter((c) => c.overBudget);

  // Savings rate.
  const savingsRate = summary.incomeTotal > 0 ? Math.round((summary.net / summary.incomeTotal) * 100) : null;

  // Recurring & salary (current month only).
  const due = isCurrent ? dueBills(profile) : [];
  const salary = isCurrent ? salaryDue(profile) : null;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DataResidencyBadge />

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-brand">{summary.month}</p>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setMonth(prevMonth(month))}
            aria-label="Previous month"
          >
            <ChevronLeft />
          </Button>
          <span className="min-w-36 text-center text-sm font-medium">{monthLabel}</span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setMonth(nextMonth(month))}
            disabled={isCurrent}
            aria-label="Next month"
          >
            <ChevronRight />
          </Button>
        </div>
      </header>

      {/* Balances (editable) */}
      <BalancesCard cash={profile.cashBalance ?? 0} bank={profile.bankBalance ?? 0} currency={profile.currency} />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Income" value={money.format(summary.incomeTotal)} tone="good" />
        <StatCard label="Expenses" value={money.format(summary.expenseTotal)} tone="bad" />
        <StatCard label="Net" value={money.format(summary.net)} tone={summary.net >= 0 ? "good" : "bad"} />
      </div>

      {/* Charts */}
      <DashboardCharts {...chartData} />

      {/* New info cards row */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Cash vs Bank */}
        <InfoCard title="Cash vs bank spend">
          {summary.expenseTotal > 0 ? (
            <div className="flex flex-col gap-3">
              <SplitBar label="Cash" amount={cashSpend} total={summary.expenseTotal} money={money} color="var(--chart-2)" />
              <SplitBar label="Bank" amount={bankSpend} total={summary.expenseTotal} money={money} color="var(--chart-4)" />
            </div>
          ) : (
            <EmptyHint text="No expenses this month yet." />
          )}
        </InfoCard>

        {/* Savings rate */}
        <InfoCard title="Savings rate">
          {savingsRate != null ? (
            <div className="flex items-end gap-2">
              <span className={`text-3xl font-bold ${savingsRate >= 0 ? "text-brand-600" : "text-red-600"}`}>
                {savingsRate}%
              </span>
              <span className="pb-1 text-sm text-muted-foreground">of income saved</span>
            </div>
          ) : (
            <EmptyHint text="Log income to see your savings rate." />
          )}
          {salary != null && (
            <p className="mt-2 text-xs text-muted-foreground">Salary of {money.format(salary)} is due this month.</p>
          )}
        </InfoCard>

        {/* Budget rollup */}
        <InfoCard title="Budget rollup">
          {budgetLimit > 0 ? (
            <>
              <div className="flex items-end gap-2">
                <span className={`text-3xl font-bold ${budgetUsed <= budgetLimit ? "text-brand-600" : "text-red-600"}`}>
                  {Math.round((budgetUsed / budgetLimit) * 100)}%
                </span>
                <span className="pb-1 text-sm text-muted-foreground">
                  {money.format(budgetUsed)} of {money.format(budgetLimit)}
                </span>
              </div>
              {overBudget.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {overBudget.map((c) => (
                    <li key={c.category} className="text-xs text-red-600">
                      {c.category}: {money.format(c.total)} / {money.format(c.budgetLimit!)} (over by{" "}
                      {money.format(c.total - c.budgetLimit!)})
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <EmptyHint text="Set budget goals in chat to see rollup." />
          )}
        </InfoCard>

        {/* Recurring bills due */}
        <InfoCard title="Recurring bills">
          {profile.recurringBills.length > 0 ? (
            <ul className="space-y-2">
              {profile.recurringBills.map((b) => {
                const paid = b.lastPaidMonth === monthKey();
                return (
                  <li key={b.name} className="flex items-center justify-between text-sm">
                    <span className={paid ? "text-muted-foreground line-through" : ""}>
                      {b.name} · {money.format(b.amount)} · day {b.dayOfMonth}
                    </span>
                    {paid ? (
                      <span className="text-xs text-muted-foreground">Paid</span>
                    ) : due.some((d) => d.name === b.name) ? (
                      <span className="text-xs font-medium text-amber-600">Due</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Upcoming</span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyHint text="Set recurring bills in chat to track them." />
          )}
        </InfoCard>
      </div>

      {/* Category spend detail (existing) */}
      <InfoCard title="Category spend">
        {summary.byCategory.length > 0 ? (
          <div className="grid gap-3">
            {summary.byCategory.map((c) => {
              const pct = c.budgetLimit ? Math.min((c.total / c.budgetLimit) * 100, 100) : 0;
              return (
                <div key={c.category} className="rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{c.category}</p>
                      {c.budgetLimit && (
                        <p className={`mt-1 text-xs ${c.overBudget ? "text-red-600" : "text-muted-foreground"}`}>
                          {money.format(c.total)} of {money.format(c.budgetLimit)}
                        </p>
                      )}
                    </div>
                    <p className="font-semibold">{money.format(c.total)}</p>
                  </div>
                  {c.budgetLimit != null && (
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
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
        ) : (
          <EmptyHint text="No expenses logged this month yet." />
        )}
      </InfoCard>

      {/* Month over month */}
      <InfoCard title="Month over month">
        <p className="text-sm text-muted-foreground">
          Expenses are {money.format(Math.abs(summary.prev.deltaAmount))}{" "}
          {summary.prev.deltaAmount >= 0 ? "higher" : "lower"} than{" "}
          {new Date(`${summary.prev.month}-01`).toLocaleString("en-IN", { month: "long" })}
          {summary.prev.deltaPct === null ? "." : ` (${Math.abs(summary.prev.deltaPct)}%).`}
        </p>
      </InfoCard>
    </div>
  );
}

// --- helpers ---

function computeByDay(items: (Expense | Income)[]) {
  const acc = new Map<string, number>();
  for (const item of items) acc.set(item.date, (acc.get(item.date) ?? 0) + item.amount);
  return [...acc.entries()].map(([date, total]) => ({ date, total })).sort((a, b) => a.date.localeCompare(b.date));
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "good" | "bad" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${tone === "good" ? "text-brand-600" : "text-red-600"}`}>{value}</p>
    </div>
  );
}

function BalancesCard({ cash, bank, currency }: { cash: number; bank: number; currency: string }) {
  const [c, setC] = useState(String(cash));
  const [b, setB] = useState(String(bank));

  const total = (Number(c) || 0) + (Number(b) || 0);
  const fmt = currencyFmt(currency);

  async function commit(which: "cash" | "bank") {
    const v = Number(which === "cash" ? c : b);
    if (!Number.isFinite(v) || v < 0) return;
    await saveProfile(which === "cash" ? { cashBalance: v } : { bankBalance: v });
  }

  const fields = [
    { which: "cash" as const, label: "Cash", value: c, set: setC, key: `cash-${cash}` },
    { which: "bank" as const, label: "Bank", value: b, set: setB, key: `bank-${bank}` },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold tracking-tight">Balances</h2>
        <span className="text-xs text-muted-foreground">Edit a number, then press Enter</span>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {fields.map((f) => (
          <label key={f.which} className="block rounded-xl border border-border p-4">
            <span className="text-sm text-muted-foreground">{f.label}</span>
            <input
              key={f.key}
              type="number"
              inputMode="decimal"
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              onBlur={() => commit(f.which)}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              className="mt-1 w-full bg-transparent text-2xl font-bold outline-none"
            />
          </label>
        ))}
        <div className="rounded-xl border border-brand/30 bg-brand/5 p-4">
          <p className="text-sm text-muted-foreground">Total money</p>
          <p className="mt-1 text-2xl font-bold text-brand">{fmt.format(total)}</p>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function SplitBar({
  label,
  amount,
  total,
  money,
  color,
}: {
  label: string;
  amount: number;
  total: number;
  money: Intl.NumberFormat;
  color: string;
}) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-12 text-muted-foreground">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="w-20 text-right font-medium">{money.format(amount)}</span>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
      {text}
    </p>
  );
}

function DashSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-36 w-full rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
