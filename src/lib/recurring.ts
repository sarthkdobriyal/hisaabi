import type { Profile, RecurringBill } from "./db";

export function monthKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Bills whose deduction day has arrived this month and hasn't been confirmed yet.
// A bill due on the 31st is treated as due on the last day of a short month.
export function dueBills(profile: Profile, now = new Date()): RecurringBill[] {
  const ym = monthKey(now);
  const today = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return profile.recurringBills.filter(
    (b) => b.lastPaidMonth !== ym && today >= Math.min(b.dayOfMonth ?? 31, daysInMonth),
  );
}

// The salary amount once its credit day has arrived this month and it hasn't
// been confirmed yet; null when there's no salary, not due, or already credited.
export function salaryDue(profile: Profile, now = new Date()): number | null {
  if (!profile.salary || !profile.salaryDate) return null;
  if (profile.lastCreditedMonth === monthKey(now)) return null;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return now.getDate() >= Math.min(profile.salaryDate, daysInMonth) ? profile.salary : null;
}
