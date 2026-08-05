"use client";

import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Provider } from "@/lib/db";
import { runTool } from "@/lib/tools";
import { runChatTurn, type ToolOutcome } from "@/lib/chat";
import { DataResidencyBadge } from "@/components/DataResidencyBadge";
import SetupScreen, { needsSetup } from "@/components/SetupScreen";
import { readSettings, saveSettings } from "@/lib/store";
import { PROVIDERS, providerMeta } from "@/lib/providers";

interface Card extends ToolOutcome {
  undone?: boolean;
}

export default function ChatPage() {
  const messages = useLiveQuery(() => db.chatMessages.orderBy("createdAt").toArray(), [], []);
  const settings = useLiveQuery(() => readSettings(), [], null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending, cards]);

  if (settings === null) {
    return <div className="py-16 text-center text-sm text-slate-500">Loading…</div>;
  }
  if (needsSetup(settings)) return <SetupScreen />;

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setError(null);
    setRateLimited(false);
    setSending(true);
    const res = await runChatTurn(text);
    setSending(false);
    if (!res.ok && res.error) {
      setError(res.error);
      setRateLimited(!!res.rateLimited);
    }
    if (res.outcomes.length) setCards((c) => [...c, ...res.outcomes]);
  }

  async function switchProvider(id: Provider) {
    await saveSettings({ provider: id, model: providerMeta(id).defaultModel });
    setError(null);
    setRateLimited(false);
  }

  async function undo(idx: number) {
    const card = cards[idx];
    const id = (card.result as { id?: number })?.id;
    if (typeof id !== "number") return;
    await runTool("delete_expense", { id });
    setCards((c) => c.map((x, i) => (i === idx ? { ...x, undone: true } : x)));
  }

  const empty = (messages?.length ?? 0) === 0;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <DataResidencyBadge />

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {empty && !sending ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
            <p className="text-lg font-medium">Log an expense by chatting.</p>
            <p className="max-w-sm text-sm text-slate-500">
              Try{" "}
              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                spent 200 on coffee
              </span>{" "}
              or ask{" "}
              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                how much on groceries this month?
              </span>
            </p>
          </div>
        ) : (
          messages?.map((m) => <Bubble key={m.id} role={m.role} content={m.content} />)
        )}

        {cards.map((card, i) => (
          <ConfirmCard key={`card-${i}`} card={card} onUndo={() => undo(i)} />
        ))}

        {sending && <Bubble role="assistant" content="…" />}
        <div ref={endRef} />
      </div>

      {rateLimited && settings ? (
        <RateLimitPopup message={error ?? ""} current={settings.provider} onSwitch={switchProvider} />
      ) : error ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          {error}
        </p>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
        className="flex items-end gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          rows={1}
          placeholder="spent 200 on coffee…"
          className="flex-1 resize-none rounded-lg border border-slate-300 bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="inline-flex items-center justify-center brand-gradient rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}

function Bubble({ role, content }: { role: string; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? "brand-gradient text-white"
            : "border border-slate-200 bg-background dark:border-slate-800"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

function ConfirmCard({ card, onUndo }: { card: Card; onUndo: () => void }) {
  const label = card.name === "add_expense" ? "Expense added" : card.name === "add_income" ? "Income added" : null;
  if (!label) return null;
  const r = card.result as { amount?: number; category?: string; source?: string; date?: string };
  const canUndo = card.name === "add_expense" && !card.undone;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-brand/30 bg-brand/5 px-4 py-2.5 text-sm">
      <span className="font-medium text-brand">{label}</span>
      <span className={card.undone ? "text-slate-400 line-through" : "text-slate-600 dark:text-slate-300"}>
        {r.amount} · {r.category ?? r.source} · {r.date}
      </span>
      {canUndo && (
        <button
          type="button"
          onClick={onUndo}
          className="ml-auto rounded-md border border-slate-300 px-2 py-1 text-xs font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
        >
          Undo
        </button>
      )}
      {card.undone && <span className="ml-auto text-xs text-slate-400">Undone</span>}
    </div>
  );
}

// Shown on HTTP 429 from any provider. A provider switch is the fastest way
// back to a fresh quota; picking one without a saved key lands on SetupScreen.
function RateLimitPopup({
  message,
  current,
  onSwitch,
}: {
  message: string;
  current: Provider;
  onSwitch: (id: Provider) => void;
}) {
  const options = PROVIDERS.filter((p) => p.id !== current && p.id !== "anthropic");
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm dark:border-red-900/50 dark:bg-red-950/40">
      <p className="font-medium text-red-700 dark:text-red-300">{message}</p>
      <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/80">Switch provider for a fresh quota:</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSwitch(p.id)}
            className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900/60"
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-red-500/80">Needs a key only if you haven&apos;t saved one for it — then it opens setup.</p>
    </div>
  );
}
