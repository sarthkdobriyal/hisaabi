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
      <div className="w-full max-w-sm rounded-2xl border border-brand/30 bg-zinc-900 px-4 py-4 text-sm shadow-2xl">
        <p className="font-medium text-brand">Salary due — has it been credited?</p>
        <p className="mt-1 text-xs text-zinc-500">Confirm only after the money reaches your bank account.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-32 rounded-lg border border-white/10 bg-zinc-950 px-3 py-1.5 text-sm text-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
          <span className="text-zinc-500">{currency}</span>
          <button
            type="button"
            disabled={busy}
            onClick={confirm}
            className="rounded-lg border border-teal-500 bg-zinc-900 px-3 py-1 text-xs font-semibold text-teal-400 transition hover:bg-teal-600 hover:text-white disabled:opacity-40"
          >
            {busy ? "Crediting…" : "Yes, credited"}
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(DISMISS_KEY, todayISO());
              setDismissed(true);
            }}
            className="text-xs text-zinc-500 underline underline-offset-2 transition hover:text-zinc-300"
          >
            Not yet
          </button>
        </div>
      </div>
    </div>
  );
}
