"use client";

import { MessageSquareText } from "lucide-react";

const PROMPTS = [
  "Spent 500 on groceries",
  "I spent 200 on movies",
  "How much did I spend this month?",
];

export function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 rounded-2xl border border-white/10 bg-zinc-900/30 p-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400">
        <MessageSquareText className="size-6" />
      </div>
      <div>
        <p className="text-lg font-semibold tracking-tight text-white">Log an expense by chatting.</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">
          Type it like you&apos;d tell a friend — no forms, no category pickers.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPick(p)}
            className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-teal-500/40 hover:text-white"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
