"use client";

import { CheckCircle2 } from "lucide-react";
import type { ToolOutcome } from "@/lib/chat";
import { Button } from "@/components/ui/button";

export interface ConfirmCardData extends ToolOutcome {
  undone?: boolean;
}

export function ConfirmCard({ card, onUndo }: { card: ConfirmCardData; onUndo: () => void }) {
  const label =
    card.name === "add_expense" ? "Expense added" : card.name === "add_income" ? "Income added" : null;
  if (!label) return null;

  const r = card.result as { amount?: number; category?: string; source?: string; date?: string };
  const canUndo = card.name === "add_expense" && !card.undone;

  return (
    <div className="flex animate-scale-in items-center gap-3 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm">
      <CheckCircle2 className="size-4 shrink-0 text-brand" />
      <span className="font-medium text-brand">{label}</span>
      <span className={card.undone ? "text-zinc-400 line-through" : "text-zinc-400"}>
        {r.amount} · {r.category ?? r.source} · {r.date}
      </span>
      {canUndo && (
        <Button type="button" variant="outline" size="xs" onClick={onUndo} className="ml-auto">
          Undo
        </Button>
      )}
      {card.undone && <span className="ml-auto text-xs text-zinc-400">Undone</span>}
    </div>
  );
}
