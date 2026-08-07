"use client";

import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User } from "lucide-react";

function time(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

const CURRENCY_RE = /([₹$€£¥][\d,]+(?:\.\d+)?|\d[\d,]*(?:\.\d+)?\s*(?:INR|USD|EUR|GBP|JPY))/g;

function highlightCurrency(text: string) {
  const parts = text.split(CURRENCY_RE);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    CURRENCY_RE.test(part) ? (
      <span key={i} className="inline-block font-mono text-base font-bold tracking-tight text-teal-400">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

const mdComponents: ComponentProps<typeof ReactMarkdown>["components"] = {
  p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
  ul: ({ children }) => <ul className="mb-1.5 ml-4 list-disc space-y-0.5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-1.5 ml-4 list-decimal space-y-0.5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="text-zinc-200">{children}</li>,
  code: ({ children }) => (
    <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs text-teal-300">{children}</code>
  ),
  h1: ({ children }) => <p className="mb-1 text-base font-bold text-white">{children}</p>,
  h2: ({ children }) => <p className="mb-1 text-base font-bold text-white">{children}</p>,
  h3: ({ children }) => <p className="mb-0.5 text-sm font-bold text-white">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="font-medium text-teal-400 underline underline-offset-2">
      {children}
    </a>
  ),
  hr: () => <hr className="my-2 border-white/10" />,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-teal-500/40 pl-3 text-zinc-400 italic">{children}</blockquote>
  ),
  pre: ({ children }) => (
    <pre className="mb-1.5 overflow-x-auto rounded-lg bg-black/40 p-2 text-xs last:mb-0">{children}</pre>
  ),
};

function AssistantContent({ content }: { content: string }) {
  const processed = content.replace(CURRENCY_RE, (match) => `**${match}**`);
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
      {processed}
    </ReactMarkdown>
  );
}

export function MessageBubble({ role, content, createdAt }: { role: string; content: string; createdAt: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex animate-fade-up items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <AssistantAvatar />}
      <div className={`flex max-w-[85%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
            isUser
              ? "brand-gradient rounded-br-md whitespace-pre-wrap text-white"
              : "rounded-bl-md border border-white/10 bg-zinc-900 text-zinc-200"
          }`}
        >
          {isUser ? content : <AssistantContent content={content} />}
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
