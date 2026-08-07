"use client";

import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function Composer({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
}) {
  function submit() {
    if (!value.trim() || disabled) return;
    onSend();
  }

  return (
    <div className="sticky bottom-0 z-20 border-t border-white/10 bg-black/90 pb-3 pt-2.5 backdrop-blur">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex items-end gap-2"
      >
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="spent 200 on coffee…"
          aria-label="Message"
          className="min-h-11 max-h-40 flex-1 rounded-2xl bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 px-4 py-3 text-sm leading-relaxed shadow-sm"
        />
        <Button
          type="submit"
          size="icon-lg"
          disabled={disabled || !value.trim()}
          aria-label="Send"
          className="brand-gradient shrink-0 rounded-2xl shadow-sm"
        >
          <ArrowUp />
        </Button>
      </form>
      <p className="mt-1.5 text-center text-[11px] text-zinc-600">
        Enter to send · Shift+Enter for a new line
      </p>
    </div>
  );
}
