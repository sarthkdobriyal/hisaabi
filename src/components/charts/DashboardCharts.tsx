"use client";

// All Recharts usage lives here so the dashboard can lazy-load it in one
// dynamic() import (ssr:false) — keeps the ~100kb chart lib off the app shell.
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { currencyFmt } from "@/lib/format";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export interface ChartData {
  byDay: { date: string; total: number }[];
  byCategory: { category: string; total: number }[];
  incomeByDay: { date: string; total: number }[];
  currency: string;
}

// Merge expense + income day series into one per-day frame for the trend line.
function trendData(expense: ChartData["byDay"], income: ChartData["incomeByDay"]) {
  const days = new Map<string, { day: string; expense: number; income: number }>();
  for (const e of expense) days.set(e.date, { day: e.date.slice(8), expense: e.total, income: 0 });
  for (const i of income) {
    const row = days.get(i.date) ?? { day: i.date.slice(8), expense: 0, income: 0 };
    row.income = i.total;
    days.set(i.date, row);
  }
  return [...days.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([, v]) => v);
}

// Top 5 categories + roll the rest into "Other".
function donutData(byCategory: ChartData["byCategory"]) {
  const top = byCategory.slice(0, 5);
  const rest = byCategory.slice(5).reduce((s, c) => s + c.total, 0);
  return rest > 0 ? [...top, { category: "Other", total: rest }] : top;
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "#18181b",
  color: "#e4e4e7",
  fontSize: 12,
};

export default function DashboardCharts({ byDay, byCategory, incomeByDay, currency }: ChartData) {
  const money = currencyFmt(currency);
  const fmt = (v: number | string) => money.format(Number(v));
  const trend = trendData(byDay, incomeByDay);
  const donut = donutData(byCategory);
  const axis = { stroke: "#71717a", fontSize: 11 };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Daily spend">
        {byDay.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={byDay.map((d) => ({ day: d.date.slice(8), total: d.total }))}>
              <defs>
                <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} {...axis} />
              <YAxis tickLine={false} axisLine={false} width={40} {...axis} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt(v as number), "Spent"]} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#spendFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ChartEmpty text="Daily spend appears after you log expenses." />
        )}
      </ChartCard>

      <ChartCard title="Category breakdown">
        {donut.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={donut}
                dataKey="total"
                nameKey="category"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                strokeWidth={0}
              >
                {donut.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [fmt(v as number), n as string]} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ChartEmpty text="No categorized spend yet this month." />
        )}
        {donut.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
            {donut.map((c, i) => (
              <li key={c.category} className="flex items-center gap-1.5 text-zinc-500">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                {c.category}
              </li>
            ))}
          </ul>
        )}
      </ChartCard>

      <ChartCard title="Income vs expense" className="lg:col-span-2">
        {trend.length ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} {...axis} />
              <YAxis tickLine={false} axisLine={false} width={40} {...axis} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v, n) => [fmt(v as number), n === "income" ? "Income" : "Expense"]}
              />
              <Line type="monotone" dataKey="income" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expense" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ChartEmpty text="Trend shows once there's activity this month." />
        )}
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-zinc-900/50 p-6 shadow-sm ${className ?? ""}`}>
      <h2 className="mb-4 text-base font-semibold tracking-tight">{title}</h2>
      {children}
    </div>
  );
}

function ChartEmpty({ text }: { text: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-white/10 text-center text-sm text-zinc-500">
      {text}
    </div>
  );
}
