"use client";

import { useState } from "react";
import type { RecurringBill } from "@/lib/db";
import { runTool } from "@/lib/tools";
import { readProfile, saveProfile } from "@/lib/store";
import { monthKey } from "@/lib/recurring";

// "Not yet" hides the reminder until tomorrow; a fresh day brings it back.
const DISMISS_KEY = "hisaabi:recurring-dismissed";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function RecurringBillDue({
  bills,
  currency,
}: {
  bills: RecurringBill[];
  currency: string;
}) {
  const [remaining, setRemaining] = useState(bills);
  const [dismissed, setDismissed] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem(DISMISS_KEY) === todayISO(),
  );

  if (dismissed || remaining.length === 0) return null;

  async function markDeducted(bill: RecurringBill) {
    await runTool("add_expense", {
      amount: bill.amount,
      category: bill.name,
      note: "Recurring bill",
      date: todayISO(),
      account: "bank", // bills are auto-debited from the bank account
    });
    const profile = await readProfile();
    await saveProfile({
      recurringBills: profile.recurringBills.map((b) =>
        b.name === bill.name && b.amount === bill.amount ? { ...b, lastPaidMonth: monthKey() } : b,
      ),
    });
    setRemaining((r) => r.filter((b) => b !== bill));
  }

  function dismissToday() {
    sessionStorage.setItem(DISMISS_KEY, todayISO());
    setDismissed(true);
  }

  return (
    <div className="rounded-2xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm">
      <p className="font-medium text-brand">Bills due — did they get deducted?</p>
      <ul className="mt-2 space-y-2">
        {remaining.map((b) => (
          <li key={b.name} className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="flex-1">
              {b.name}{" "}
              <span className="text-slate-500">
                · {b.amount} {currency} · due {b.dayOfMonth}
              </span>
            </span>
            <button
              type="button"
              onClick={() => markDeducted(b)}
              className="rounded-lg border border-brand bg-white px-3 py-1 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white dark:border-brand/60 dark:bg-slate-900 dark:hover:bg-brand"
            >
              Yes, deducted
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={dismissToday}
        className="mt-3 text-xs text-slate-500 underline underline-offset-2 transition hover:text-slate-700 dark:hover:text-slate-300"
      >
        Not yet — remind me later
      </button>
    </div>
  );
}
