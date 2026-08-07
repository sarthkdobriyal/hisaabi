import { db, SETTINGS_ID, type Expense } from "./db";
import { resetVault } from "./vault";

const TABLES = ["expenses", "income", "profile", "memories", "chatMessages", "settings"] as const;

// Full JSON backup. The API key is stripped — a backup file may be shared or
// synced, and a secret must never leak through it (§ security). Restore keeps
// the existing key (or the user re-enters it).
export async function exportAllJson(): Promise<string> {
  const [expenses, income, profile, memories, chatMessages, settings] = await Promise.all([
    db.expenses.toArray(),
    db.income.toArray(),
    db.profile.toArray(),
    db.memories.toArray(),
    db.chatMessages.toArray(),
    db.settings.toArray(),
  ]);

  const safeSettings = settings.map((s) => ({ ...s, apiKey: "" }));

  const payload = {
    version: 1 as const,
    exportedAt: new Date().toISOString(),
    data: { expenses, income, profile, memories, chatMessages, settings: safeSettings },
  };
  return JSON.stringify(payload, null, 2);
}

function csvField(value: unknown): string {
  const s = value == null ? "" : String(value);
  // RFC 4180: quote if the field contains comma, quote, CR or LF; double internal quotes.
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function exportExpensesCsv(): Promise<string> {
  const rows = await db.expenses.orderBy("date").toArray();
  const header = ["id", "date", "amount", "category", "note"];
  const lines = [header.join(",")];
  for (const e of rows as Expense[]) {
    lines.push([e.id, e.date, e.amount, e.category, e.note].map(csvField).join(","));
  }
  return lines.join("\r\n");
}

export async function importJson(text: string): Promise<void> {
  const parsed = JSON.parse(text) as { data?: Record<string, unknown[]> };
  const data = parsed?.data;
  if (!data || typeof data !== "object") {
    throw new Error("Not a valid Hisaabi backup file.");
  }

  const currentKey = (await db.settings.get(SETTINGS_ID))?.apiKey ?? "";

  await db.transaction("rw", [db.expenses, db.income, db.profile, db.memories, db.chatMessages, db.settings], async () => {
    for (const table of TABLES) {
      const incoming = data[table];
      if (!Array.isArray(incoming) || incoming.length === 0) continue;
      await db.table(table).bulkPut(incoming);
    }
    // never overwrite the live key with an empty one from a backup
    const imported = await db.settings.get(SETTINGS_ID);
    if (imported && !imported.apiKey && currentKey) {
      await db.settings.put({ ...imported, apiKey: currentKey });
    }
  });
}

export async function wipeAll(): Promise<void> {
  await resetVault();
  await db.transaction("rw", [db.expenses, db.income, db.profile, db.memories, db.chatMessages, db.settings], async () => {
    await Promise.all(TABLES.map((t) => db.table(t).clear()));
  });
}

export function download(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
