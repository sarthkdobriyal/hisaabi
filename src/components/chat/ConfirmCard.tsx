"use client";

import { CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import type { ToolOutcome } from "@/lib/chat";
import { Button } from "@/components/ui/button";

export interface ConfirmCardData extends ToolOutcome {
  undone?: boolean;
}

export function ConfirmCard({ card, onUndo }: { card: ConfirmCardData; onUndo: () => void }) {
  const isExpense = card.name === "add_expense";
  const isIncome = card.name === "add_income";
  if (!isExpense && !isIncome) return null;

  const r = card.result as { amount?: number; category?: string; source?: string; date?: string };
  const canUndo = isExpense && !card.undone;
  const Icon = isIncome ? TrendingUp : TrendingDown;

  return (
    <div
      className={`flex animate-scale-in flex-col gap-2 rounded-2xl border px-4 py-3.5 ${
        card.undone
          ? "border-white/5 bg-zinc-900/30 opacity-60"
          : isIncome
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-brand/30 bg-brand/5"
      }`}
    >
      <div className="flex items-center gap-2">
        <CheckCircle2 className={`size-4 shrink-0 ${isIncome ? "text-emerald-400" : "text-brand"}`} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${isIncome ? "text-emerald-400" : "text-brand"}`}>
          {isExpense ? "Expense recorded" : "Income recorded"}
        </span>
        {canUndo && (
          <Button type="button" variant="outline" size="xs" onClick={onUndo} className="ml-auto">
            Undo
          </Button>
        )}
        {card.undone && <span className="ml-auto text-xs text-zinc-500">Undone</span>}
      </div>
      <div className={`flex items-center gap-3 ${card.undone ? "line-through" : ""}`}>
        <Icon className={`size-5 ${isIncome ? "text-emerald-400" : "text-teal-400"}`} />
        <span className="font-mono text-xl font-bold tracking-tight text-white">
          {isIncome ? "+" : "-"}{r.amount}
        </span>
        <span className="text-sm text-zinc-400">{r.category ?? r.source}</span>
        <span className="ml-auto text-xs text-zinc-500">{r.date}</span>
      </div>
    </div>
  );
}
