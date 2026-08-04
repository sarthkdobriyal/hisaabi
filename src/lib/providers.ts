import type { Provider, Settings } from "./db";

export interface ProviderMeta {
  id: Provider;
  label: string;
  needsKey: boolean;
  defaultModel: string;
  modelSuggestions: string[];
  keyHint: string;
  keyUrl?: string; // where to get a key
}

export const PROVIDERS: ProviderMeta[] = [
  {
    id: "openai",
    label: "OpenAI",
    needsKey: true,
    defaultModel: "gpt-4o-mini",
    modelSuggestions: ["auto", "gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1"],
    keyHint: "sk-…",
    keyUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "anthropic",
    label: "Anthropic (Claude)",
    needsKey: true,
    defaultModel: "claude-haiku-4-5",
    modelSuggestions: ["claude-haiku-4-5", "claude-sonnet-4-6", "claude-opus-4-7"],
    keyHint: "sk-ant-…",
    keyUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "gemini",
    label: "Google Gemini",
    needsKey: true,
    defaultModel: "gemini-2.0-flash",
    modelSuggestions: ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"],
    keyHint: "AIza…",
    keyUrl: "https://aistudio.google.com/apikey",
  },
  {
    id: "ollama",
    label: "Ollama (fully offline)",
    needsKey: false,
    defaultModel: "llama3.1",
    modelSuggestions: ["llama3.1", "qwen2.5", "mistral", "phi3"],
    keyHint: "",
  },
];

export function providerMeta(id: Provider): ProviderMeta {
  return PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0];
}

export interface TestResult {
  ok: boolean;
  message: string;
}

// Lightweight liveness/auth check against each provider. Native fetch only —
// the AI SDK is added in the chat milestone. Runs browser → provider directly.
export async function testConnection(s: Settings): Promise<TestResult> {
  try {
    if (s.provider === "openai") {
      const base = (s.baseUrl || "https://api.openai.com/v1").replace(/\/+$/, "");
      const r = await fetch(`${base}/models`, {
        headers: s.apiKey ? { Authorization: `Bearer ${s.apiKey}` } : {},
      });
      return r.ok
        ? { ok: true, message: s.baseUrl ? "Connected." : "Connected to OpenAI." }
        : { ok: false, message: `Rejected (${r.status}).` };
    }

    if (s.provider === "anthropic") {
      const r = await fetch("https://api.anthropic.com/v1/models", {
        headers: {
          "x-api-key": s.apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
      });
      return r.ok
        ? { ok: true, message: "Connected to Anthropic." }
        : { ok: false, message: `Anthropic rejected the key (${r.status}).` };
    }

    if (s.provider === "gemini") {
      // key in header, not URL (no secrets in URLs)
      const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models", {
        headers: { "x-goog-api-key": s.apiKey },
      });
      return r.ok
        ? { ok: true, message: "Connected to Gemini." }
        : { ok: false, message: `Gemini rejected the key (${r.status}).` };
    }

    // ollama — local endpoint, no key
    const base = (s.ollamaUrl || "http://localhost:11434").replace(/\/+$/, "");
    const r = await fetch(`${base}/api/tags`);
    return r.ok
      ? { ok: true, message: "Ollama is reachable." }
      : { ok: false, message: `Ollama responded ${r.status}.` };
  } catch {
    return {
      ok: false,
      message: "Couldn't reach the provider. Check the key/URL — or the provider may block browser requests (CORS).",
    };
  }
}
