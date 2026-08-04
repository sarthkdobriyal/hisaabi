"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

// Proves the local-first claim: shows where data lives + live record counts.
export function DataResidencyBadge() {
  const counts = useLiveQuery(async () => {
    const [expenses, income, memories] = await Promise.all([
      db.expenses.count(),
      db.income.count(),
      db.memories.count(),
    ]);
    return { expenses, income, memories };
  });

  const total = counts ? counts.expenses + counts.income + counts.memories : 0;

  return (
    <div className="rounded-lg border border-brand/30 bg-brand/5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
      <span className="font-semibold text-brand">Your data lives here</span> — in this browser (IndexedDB).{" "}
      {counts ? (
        <>
          {total} record{total === 1 ? "" : "s"}: {counts.expenses} expenses, {counts.income} income,{" "}
          {counts.memories} memories.
        </>
      ) : (
        "Reading…"
      )}
    </div>
  );
}
