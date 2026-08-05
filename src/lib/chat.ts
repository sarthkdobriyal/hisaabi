
import { db } from "./db";
import { getSettings } from "./store";
import { assembleContext, runTool, TOOL_DEFS, type ChatContext } from "./tools";
import { FIXED_BASE_URLS } from "./providers";

// Client-side chat engine. Runs entirely browser → user's provider, with the
// user's key. No backend. Non-streaming tool-call loop (streaming is a later
// upgrade). OpenAI and Ollama share the OpenAI /chat/completions shape, so one
// adapter covers both. Anthropic/Gemini use a different tool format — wired in
// a follow-up rather than guessed at here.

const MAX_TOOL_ROUNDS = 5; // stop runaway tool loops
const SSE_LINE = /^data: (.+)$/gm;

export interface ToolOutcome {
  name: string;
  args: Record<string, unknown>;
  result: unknown;
}

export interface TurnResult {
  ok: boolean;
  reply: string;
  outcomes: ToolOutcome[]; // successful tool calls, for inline confirm cards
  error?: string;
  rateLimited?: boolean; // true on HTTP 429 — chat UI offers a quick provider switch
}

type Msg =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: OpenAiToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

interface OpenAiToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

export async function runChatTurn(userText: string): Promise<TurnResult> {
  const text = userText.trim();
  if (!text) return { ok: true, reply: "", outcomes: [] };

  // Persist the user message first so nothing is lost even if the AI call fails.
  await db.chatMessages.add({ role: "user", content: text, createdAt: new Date().toISOString() });

  const settings = await getSettings();
  if (settings.provider === "anthropic") {
    return {
      ok: false,
      reply: "",
      outcomes: [],
      error: "Anthropic chat isn't wired yet — use OpenAI, Gemini, or Ollama in Settings for now.",
    };
  }
  if (settings.provider === "gemini" && !settings.apiKey) {
    return { ok: false, reply: "", outcomes: [], error: "Add your Gemini API key in Settings first." };
  }
  if (settings.provider === "groq" && !settings.apiKey) {
    return { ok: false, reply: "", outcomes: [], error: "Add your Groq API key in Settings first." };
  }
  if (settings.provider === "custom" && !settings.baseUrl) {
    return { ok: false, reply: "", outcomes: [], error: "Add a base URL for your custom provider in Settings first." };
  }
  // A custom base URL (proxy/gateway) may not require a key; the official
  // OpenAI endpoint always does.
  if (settings.provider === "openai" && !settings.baseUrl && !settings.apiKey) {
    return { ok: false, reply: "", outcomes: [], error: "Add your OpenAI API key in Settings first." };
  }

  const ctx = await assembleContext();
  const msgs: Msg[] = [
    { role: "system", content: ctx.system },
    { role: "system", content: contextBlock(ctx) },
    ...ctx.recentMessages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
  ];

  const outcomes: ToolOutcome[] = [];
  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const message = await callProvider(settings, msgs);

      if (!message.tool_calls?.length) {
        const reply = message.content ?? "";
        await db.chatMessages.add({ role: "assistant", content: reply, createdAt: new Date().toISOString() });
        return { ok: true, reply, outcomes };
      }

      // Model wants to call tools. Record its turn, run each, feed results back.
      msgs.push({ role: "assistant", content: message.content ?? null, tool_calls: message.tool_calls });
      for (const call of message.tool_calls) {
        const { content, outcome } = await execToolCall(call);
        msgs.push({ role: "tool", tool_call_id: call.id, content });
        if (outcome) outcomes.push(outcome);
      }
    }
    return { ok: false, reply: "", outcomes, error: "The assistant got stuck in a tool loop. Try rephrasing." };
  } catch (e) {
    return {
      ok: false,
      reply: "",
      outcomes,
      error: friendlyError(e),
      rateLimited: e instanceof HttpError && e.status === 429,
    };
  }
}

async function execToolCall(call: OpenAiToolCall): Promise<{ content: string; outcome?: ToolOutcome }> {
  let args: Record<string, unknown>;
  try {
    args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
  } catch {
    return { content: JSON.stringify({ error: "arguments were not valid JSON" }) };
  }
  try {
    const result = await runTool(call.function.name, args);
    return { content: JSON.stringify(result), outcome: { name: call.function.name, args, result } };
  } catch (e) {
    // Feed the error back so the model can correct itself, don't crash the turn.
    return { content: JSON.stringify({ error: e instanceof Error ? e.message : "tool failed" }) };
  }
}

// --- Provider dispatch ---

interface ProviderMessage {
  content: string | null;
  tool_calls?: OpenAiToolCall[];
}

type ResolvedSettings = Awaited<ReturnType<typeof getSettings>>;

function callProvider(settings: ResolvedSettings, msgs: Msg[]): Promise<ProviderMessage> {
  if (settings.provider === "gemini") return callGemini(settings, msgs);
  return callOpenAiCompatible(settings, msgs); // openai + ollama + groq + custom share this shape
}

// --- OpenAI-compatible provider call (OpenAI, Ollama, Groq) ---

async function callOpenAiCompatible(settings: ResolvedSettings, msgs: Msg[]): Promise<ProviderMessage> {
  const isOllama = settings.provider === "ollama";
  const fixedBase = FIXED_BASE_URLS[settings.provider];
  const url = isOllama
    ? `${(settings.ollamaUrl || "http://localhost:11434").replace(/\/+$/, "")}/v1/chat/completions`
    : `${(fixedBase || settings.baseUrl || "https://api.openai.com/v1").replace(/\/+$/, "")}/chat/completions`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(!isOllama && settings.apiKey ? { Authorization: `Bearer ${settings.apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: settings.model || (isOllama ? "llama3.1" : "gpt-4o-mini"),
      messages: msgs,
      tools: TOOL_DEFS.map((t) => ({ type: "function", function: t })),
      tool_choice: "auto",
    }),
  });

  if (!res.ok) {
    throw new HttpError(res.status, await res.text().catch(() => ""));
  }
  const text = await res.text();
  const data = parseOpenAiResponse(text);
  const message = data?.choices?.[0]?.message;
  if (!message) throw new Error("Provider returned no message.");
  return { content: message.content ?? null, tool_calls: message.tool_calls };
}

function parseOpenAiResponse(text: string): { choices?: Array<{ message?: ProviderMessage }> } {
  if (!text.startsWith("data: ")) return JSON.parse(text);

  let content = "";
  const tool_calls: OpenAiToolCall[] = [];
  for (const match of text.matchAll(SSE_LINE)) {
    if (match[1] === "[DONE]") continue;
    const delta = JSON.parse(match[1])?.choices?.[0]?.delta;
    if (delta?.content) content += delta.content;
    if (Array.isArray(delta?.tool_calls)) mergeToolCallDeltas(tool_calls, delta.tool_calls);
  }
  return { choices: [{ message: { content: content || null, tool_calls: tool_calls.length ? tool_calls : undefined } }] };
}

function mergeToolCallDeltas(toolCalls: OpenAiToolCall[], deltas: Array<Partial<OpenAiToolCall> & { index?: number }>) {
  for (const delta of deltas) {
    const index = delta.index ?? toolCalls.length;
    const existing = toolCalls[index] ?? {
      id: delta.id ?? `call_${index}`,
      type: "function",
      function: { name: "", arguments: "" },
    };
    toolCalls[index] = {
      id: delta.id ?? existing.id,
      type: "function",
      function: {
        name: delta.function?.name ?? existing.function.name,
        arguments: existing.function.arguments + (delta.function?.arguments ?? ""),
      },
    };
  }
}

// --- Gemini provider call ---
// Different shape: no "system"/"tool" roles, no call ids, uppercase schema types.
// We translate to/from the OpenAI-shaped Msg[] so the tool loop stays provider-agnostic.

type GeminiPart =
  | { text: string }
  | { functionCall: { name: string; args: unknown } }
  | { functionResponse: { name: string; response: Record<string, unknown> } };
type GeminiContent = { role: "user" | "model"; parts: GeminiPart[] };

function asObject(json: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(json);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : { value: parsed };
  } catch {
    return { error: "invalid JSON" };
  }
}

// Gemini has no tool_call ids, so we synthesize one as "name#index" and
// recover the name from it when translating the matching tool result back.
function toGeminiContents(msgs: Msg[]): { system: string; contents: GeminiContent[] } {
  const system: string[] = [];
  const contents: GeminiContent[] = [];
  for (const m of msgs) {
    if (m.role === "system") system.push(m.content);
    else if (m.role === "user") contents.push({ role: "user", parts: [{ text: m.content }] });
    else if (m.role === "assistant") {
      const parts: GeminiPart[] = m.tool_calls?.length
        ? m.tool_calls.map((tc) => ({ functionCall: { name: tc.function.name, args: asObject(tc.function.arguments) } }))
        : [{ text: m.content ?? "" }];
      contents.push({ role: "model", parts });
    } else {
      const name = m.tool_call_id.split("#")[0];
      contents.push({ role: "user", parts: [{ functionResponse: { name, response: asObject(m.content) } }] });
    }
  }
  return { system: system.join("\n\n"), contents };
}

// Gemini's function schema wants uppercase JSON Schema types ("OBJECT", "STRING", ...).
function toGeminiSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(toGeminiSchema);
  if (schema && typeof schema === "object") {
    return Object.fromEntries(
      Object.entries(schema).map(([k, v]) => [k, k === "type" && typeof v === "string" ? v.toUpperCase() : toGeminiSchema(v)]),
    );
  }
  return schema;
}

async function callGemini(settings: ResolvedSettings, msgs: Msg[]): Promise<ProviderMessage> {
  const model = settings.model || "gemini-2.0-flash";
  const { system, contents } = toGeminiContents(msgs);

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": settings.apiKey },
    body: JSON.stringify({
      system_instruction: system ? { parts: [{ text: system }] } : undefined,
      contents,
      tools: [
        {
          function_declarations: TOOL_DEFS.map((t) => ({
            name: t.name,
            description: t.description,
            parameters: toGeminiSchema(t.parameters),
          })),
        },
      ],
    }),
  });

  if (!res.ok) throw new HttpError(res.status, await res.text().catch(() => ""));
  const data = await res.json();
  const parts: Array<{ text?: string; functionCall?: { name: string; args?: unknown } }> =
    data?.candidates?.[0]?.content?.parts ?? [];

  let content = "";
  const tool_calls: OpenAiToolCall[] = [];
  parts.forEach((p, i) => {
    if (p.text) content += p.text;
    if (p.functionCall) {
      tool_calls.push({
        id: `${p.functionCall.name}#${i}`,
        type: "function",
        function: { name: p.functionCall.name, arguments: JSON.stringify(p.functionCall.args ?? {}) },
      });
    }
  });
  return { content: content || null, tool_calls: tool_calls.length ? tool_calls : undefined };
}

class HttpError extends Error {
  constructor(public status: number, body: string) {
    super(`HTTP ${status}`);
    this.body = body;
  }
  body: string;
}

function friendlyError(e: unknown): string {
  if (e instanceof HttpError) {
    if (e.status === 401) return "Your API key was rejected. Check it in Settings.";
    if (e.status === 429) return "Rate limited by the provider. Wait a moment and try again.";
    const hint = providerBodyHint(e.body);
    return `Provider error (${e.status})${hint ? `: ${hint}` : ""}. Your message was saved.`;
  }
  return "Couldn't reach the provider — check your key/URL, or CORS. Your message was saved.";
}

// Pull a human-readable reason out of a provider error body (usually JSON like
// {"error":{"message":"Model Not Found"}}); return null when it's not useful.
function providerBodyHint(body: string): string | null {
  if (!body) return null;
  const trimmed = body.trim();
  if (trimmed.startsWith("<")) return null; // HTML error page
  try {
    const data = JSON.parse(trimmed);
    const msg = data?.error?.message ?? data?.message;
    if (typeof msg === "string" && msg) return msg.slice(0, 120);
  } catch {
    // not JSON — fall through
  }
  return trimmed.length <= 120 ? trimmed : null;
}

// Compact context the model reads for grounding — profile, this month's totals,
// and durable memories. All JS-computed; the model never sums anything itself.
function contextBlock(ctx: ChatContext): string {
  return [
    "User context (JSON). Use these numbers directly; do not recompute.",
    JSON.stringify({ profile: ctx.profile, categories: ctx.categories, monthlySummary: ctx.summary, memories: ctx.memories }),
  ].join("\n");
}
