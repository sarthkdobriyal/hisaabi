"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Expense, type Income } from "@/lib/db";
import { currentMonthKey, nextMonth, prevMonth } from "@/lib/analytics";
import { readProfile } from "@/lib/store";
import { DEFAULT_CATEGORIES } from "@/lib/categories";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type Row = { type: "expense"; item: Expense } | { type: "income"; item: Income };

interface EditForm {
  amount: string;
  category: string;
  source: string;
  note: string;
  date: string;
}

function toEditForm(row: Row): EditForm {
  return {
    amount: String(row.item.amount),
    category: row.type === "expense" ? row.item.category : "",
    source: row.type === "income" ? row.item.source : "",
    note: row.type === "expense" ? (row.item.note ?? "") : "",
    date: row.item.date,
  };
}

function validateEdit(row: Row, form: EditForm): string | null {
  const amount = Number(form.amount);
  if (!Number.isFinite(amount) || amount <= 0) return "Amount must be a number greater than 0.";
  if (!DATE_RE.test(form.date)) return "Date must be a valid date.";
  if (row.type === "expense" && !form.category.trim()) return "Category is required.";
  if (row.type === "income" && !form.source.trim()) return "Source is required.";
  return null;
}

export default function ExpensesPage() {
  const [month, setMonth] = useState(currentMonthKey());
  const [category, setCategory] = useState("all");
  const [lastDeleted, setLastDeleted] = useState<Row | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const data = useLiveQuery(async () => {
    const from = `${month}-01`;
    const to = `${month}-32`;
    const [expenses, income, profile] = await Promise.all([
      db.expenses.where("date").between(from, to, true, false).toArray(),
      db.income.where("date").between(from, to, true, false).toArray(),
      readProfile(),
    ]);
    return { expenses, income, profile };
  }, [month]);

  if (!data) return <div className="py-16 text-center text-sm text-zinc-500">Loading…</div>;

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

  function startEdit(row: Row) {
    setEditingId(row.item.id);
    setEditForm(toEditForm(row));
    setEditError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
    setEditError(null);
  }

  async function saveEdit(row: Row) {
    if (!editForm) return;
    const error = validateEdit(row, editForm);
    if (error) {
      setEditError(error);
      return;
    }
    const amount = Number(editForm.amount);
    if (row.type === "expense") {
      await db.expenses.update(row.item.id, {
        amount,
        category: editForm.category.trim(),
        note: editForm.note.trim() || undefined,
        date: editForm.date,
      });
    } else {
      await db.income.update(row.item.id, {
        amount,
        source: editForm.source.trim(),
        date: editForm.date,
      });
    }
    cancelEdit();
  }

  const changeMonth = (fn: (m: string) => string) => () => {
    setMonth(fn(month));
    setCategory("all");
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">Expenses</h1>
          <p className="text-sm text-zinc-500">Review and remove what&apos;s been logged.</p>
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
        <p className="text-sm text-zinc-500">
          {rows.length} {rows.length === 1 ? "entry" : "entries"} · spent {money.format(spent)}
          {earned > 0 ? ` · earned ${money.format(earned)}` : ""}
        </p>
        {cats.length > 0 && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-sm text-white"
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
        <p className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-zinc-500">
          {category === "all"
            ? "Nothing logged this month yet. Log an expense in chat."
            : "No expenses in this category this month."}
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {[...byDate.entries()].map(([date, dayRows]) => (
            <section key={date}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </h2>
              <div className="flex flex-col gap-2">
                {dayRows.map((row) =>
                  editingId === row.item.id && editForm ? (
                    <EditRow
                      key={row.item.id}
                      row={row}
                      form={editForm}
                      error={editError}
                      onChange={(next) => setEditForm(next)}
                      onCancel={cancelEdit}
                      onSave={() => saveEdit(row)}
                    />
                  ) : (
                    <RowView key={row.item.id} row={row} money={money} onEdit={startEdit} onDelete={onDelete} />
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      {lastDeleted && (
        <div className="sticky bottom-4 mt-auto flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 shadow-lg">
          <p className="text-sm text-zinc-400">
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
  "rounded-lg border border-white/10 px-2.5 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900 disabled:opacity-40";
const btnCls =
  "rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:opacity-90";

function RowView({
  row,
  money,
  onEdit,
  onDelete,
}: {
  row: Row;
  money: Intl.NumberFormat;
  onEdit: (row: Row) => void;
  onDelete: (row: Row) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
      <button
        onClick={() => onEdit(row)}
        className="min-w-0 flex-1 text-left"
        aria-label={`Edit ${row.type === "expense" ? row.item.category : row.item.source}`}
      >
        <p className="truncate text-sm font-medium">
          {row.type === "expense" ? row.item.category : row.item.source}
        </p>
        {row.type === "expense" && row.item.note && (
          <p className="truncate text-xs text-zinc-500">{row.item.note}</p>
        )}
      </button>
      <span
        className={`text-sm font-semibold ${row.type === "expense" ? "" : "text-green-400"}`}
      >
        {row.type === "expense" ? "" : "+"}
        {money.format(row.item.amount)}
      </span>
      <button
        onClick={() => onDelete(row)}
        aria-label={`Delete ${row.type === "expense" ? row.item.category : row.item.source}`}
        className="rounded-md px-1.5 py-0.5 text-lg leading-none text-zinc-500 transition hover:bg-red-950 hover:text-red-400"
      >
        ×
      </button>
    </div>
  );
}

function EditRow({
  row,
  form,
  error,
  onChange,
  onCancel,
  onSave,
}: {
  row: Row;
  form: EditForm;
  error: string | null;
  onChange: (form: EditForm) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const fieldCls =
    "rounded-lg border border-white/10 bg-zinc-950 px-2.5 py-1.5 text-sm text-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-teal-500/40 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        {row.type === "expense" ? (
          <select
            value={form.category}
            onChange={(e) => onChange({ ...form, category: e.target.value })}
            className={fieldCls}
          >
            {[...new Set([form.category, ...DEFAULT_CATEGORIES])].filter(Boolean).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={form.source}
            onChange={(e) => onChange({ ...form, source: e.target.value })}
            placeholder="Source"
            className={`${fieldCls} flex-1`}
          />
        )}
        <input
          type="number"
          value={form.amount}
          onChange={(e) => onChange({ ...form, amount: e.target.value })}
          placeholder="Amount"
          className={`${fieldCls} w-28`}
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => onChange({ ...form, date: e.target.value })}
          className={fieldCls}
        />
      </div>
      {row.type === "expense" && (
        <input
          type="text"
          value={form.note}
          onChange={(e) => onChange({ ...form, note: e.target.value })}
          placeholder="Note (optional)"
          className={fieldCls}
        />
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-900">
          Cancel
        </button>
        <button onClick={onSave} className={btnCls}>
          Save
        </button>
      </div>
    </div>
  );
}
