"use client";

import { MessageSquareText } from "lucide-react";

const PROMPTS = [
  "Spent 500 on groceries",
  "I spent 200 on movies",
  "How much did I spend this month?",
];

export function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border p-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MessageSquareText className="size-6" />
      </div>
      <div>
        <p className="text-lg font-semibold tracking-tight">Log an expense by chatting.</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Type it like you&apos;d tell a friend — no forms, no category pickers.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPick(p)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
