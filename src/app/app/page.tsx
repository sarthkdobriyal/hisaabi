"use client";

import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronDown, TriangleAlert } from "lucide-react";
import { db, type Provider } from "@/lib/db";
import { runTool } from "@/lib/tools";
import { runChatTurn } from "@/lib/chat";
import { DataResidencyBadge } from "@/components/DataResidencyBadge";
import SetupScreen, { needsSetup } from "@/components/SetupScreen";
import RecurringBillDue from "@/components/RecurringBillDue";
import SalaryDue from "@/components/SalaryDue";
import { readProfile, readSettings, saveSettings } from "@/lib/store";
import { dueBills, salaryDue } from "@/lib/recurring";
import { PROVIDERS, providerMeta } from "@/lib/providers";
import { MessageBubble, TypingIndicator } from "@/components/chat/MessageBubble";
import { Composer } from "@/components/chat/Composer";
import { EmptyState } from "@/components/chat/EmptyState";
import { ConfirmCard, type ConfirmCardData } from "@/components/chat/ConfirmCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatPage() {
  const messages = useLiveQuery(
    async () => (await db.chatMessages.orderBy("createdAt").reverse().limit(50).toArray()).reverse(),
    [],
    [],
  );
  const settings = useLiveQuery(() => readSettings(), [], null);
  const profile = useLiveQuery(() => readProfile(), [], null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [cards, setCards] = useState<ConfirmCardData[]>([]);
  const [atBottom, setAtBottom] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);

  // Only auto-scroll when the user is already near the bottom — never yank
  // them down mid-read when a background refresh adds a message.
  useEffect(() => {
    // Landing is instant, not smooth: smooth races with late layout (swap-in
    // fonts, images) and stops short of the bottom. Re-scroll once fonts are
    // applied so a hard reload always lands on the latest message.
    if (!nearBottom.current) return;
    endRef.current?.scrollIntoView({ behavior: "auto" });
    document.fonts.ready.then(() => endRef.current?.scrollIntoView({ behavior: "auto" }));
  }, [messages, sending, cards]);

  function onListScroll() {
    const el = listRef.current;
    if (!el) return;
    nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAtBottom(nearBottom.current);
  }

  function scrollToBottom() {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  if (settings === null) {
    return <ChatSkeleton />;
  }
  if (needsSetup(settings)) return <SetupScreen />;

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    nearBottom.current = true;
    setAtBottom(true);
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

  const empty = messages.length === 0 && cards.length === 0;
  const due = profile ? dueBills(profile) : [];
  const dueSalary = profile ? salaryDue(profile) : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <DataResidencyBadge />

      {dueSalary != null && <SalaryDue salary={dueSalary} currency={profile!.currency} />}
      {due.length > 0 && <RecurringBillDue bills={due} currency={profile!.currency} />}

      <div
        ref={listRef}
        onScroll={onListScroll}
        aria-live="polite"
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-2"
      >
        {empty && !sending ? (
          <EmptyState onPick={setInput} />
        ) : (
          messages.map((m) => (
            <MessageBubble key={m.id} role={m.role} content={m.content} createdAt={m.createdAt} />
          ))
        )}

        {cards.map((card, i) => (
          <ConfirmCard key={`card-${i}`} card={card} onUndo={() => undo(i)} />
        ))}

        {sending && <TypingIndicator />}

        {!atBottom && (
          <div className="sticky bottom-4 z-10 mt-1 flex justify-end pr-1">
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              onClick={scrollToBottom}
              aria-label="Scroll to latest"
              className="rounded-full bg-background shadow-sm"
            >
              <ChevronDown />
            </Button>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {rateLimited && settings ? (
        <RateLimitAlert message={error ?? ""} current={settings.provider} onSwitch={switchProvider} />
      ) : error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Composer value={input} onChange={setInput} onSend={() => void send()} disabled={sending} />
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-14 w-3/4 rounded-2xl" />
        <Skeleton className="ml-auto h-10 w-1/2 rounded-2xl" />
        <Skeleton className="h-14 w-2/3 rounded-2xl" />
      </div>
    </div>
  );
}

// Shown on HTTP 429 from any provider. A provider switch is the fastest way
// back to a fresh quota; picking one without a saved key lands on SetupScreen.
function RateLimitAlert({
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
    <Alert variant="destructive">
      <TriangleAlert />
      <AlertTitle>You&apos;re rate limited</AlertTitle>
      <AlertDescription>
        {message} Switch provider for a fresh quota — needs a key only if you haven&apos;t saved one for
        it.
      </AlertDescription>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((p) => (
          <Button key={p.id} type="button" variant="outline" size="xs" onClick={() => onSwitch(p.id)}>
            {p.label}
          </Button>
        ))}
      </div>
    </Alert>
  );
}
