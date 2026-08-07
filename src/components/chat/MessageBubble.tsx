"use client";

import { Bot, User } from "lucide-react";

function time(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({ role, content, createdAt }: { role: string; content: string; createdAt: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex animate-fade-up items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <AssistantAvatar />}
      <div className={`flex max-w-[85%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
            isUser
              ? "brand-gradient rounded-br-md text-white"
              : "rounded-bl-md border border-white/10 bg-zinc-900 text-zinc-200"
          }`}
        >
          {content}
        </div>
        <span className="px-1 text-[10px] text-zinc-500">{time(createdAt)}</span>
      </div>
      {isUser && <UserAvatar />}
    </div>
  );
}

function AssistantAvatar() {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-teal-400">
      <Bot className="size-4" />
    </span>
  );
}

function UserAvatar() {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
      <User className="size-4" />
    </span>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex animate-fade-up items-end gap-2">
      <AssistantAvatar />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-zinc-900 px-4 py-3.5 shadow-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-pulse-dot rounded-full bg-teal-500"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
