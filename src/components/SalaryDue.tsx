"use client";

import { useState } from "react";
import { runTool } from "@/lib/tools";
import { saveProfile } from "@/lib/store";
import { monthKey } from "@/lib/recurring";

// "Not yet" hides the reminder until tomorrow; salary is credited → it goes away
// for the month via lastCreditedMonth.
const DISMISS_KEY = "hisaabi:salary-dismissed";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function SalaryDue({ salary, currency }: { salary: number; currency: string }) {
  const [amount, setAmount] = useState(String(salary));
  const [busy, setBusy] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem(DISMISS_KEY) === todayISO(),
  );

  if (dismissed) return null;

  async function confirm() {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0 || busy) return;
    setBusy(true);
    await runTool("add_income", { amount: n, source: "Salary", date: todayISO(), account: "bank" });
    await saveProfile({ salary: n, lastCreditedMonth: monthKey() });
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-brand/30 bg-background px-4 py-4 text-sm shadow-2xl">
        <p className="font-medium text-brand">Salary due — has it been credited?</p>
        <p className="mt-1 text-xs text-slate-500">Confirm only after the money reaches your bank account.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-32 rounded-lg border border-slate-300 bg-background px-3 py-1.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700"
          />
          <span className="text-slate-500">{currency}</span>
          <button
            type="button"
            disabled={busy}
            onClick={confirm}
            className="rounded-lg border border-brand bg-white px-3 py-1 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white disabled:opacity-40 dark:border-brand/60 dark:bg-slate-900 dark:hover:bg-brand"
          >
            {busy ? "Crediting…" : "Yes, credited"}
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(DISMISS_KEY, todayISO());
              setDismissed(true);
            }}
            className="text-xs text-slate-500 underline underline-offset-2 transition hover:text-slate-700 dark:hover:text-slate-300"
          >
            Not yet
          </button>
        </div>
      </div>
    </div>
  );
}
