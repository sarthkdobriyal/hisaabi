import type { Provider, Settings } from "./db";

// Fixed OpenAI-compatible endpoints for providers that don't take a custom baseUrl.
export const FIXED_BASE_URLS: Partial<Record<Provider, string>> = {
  groq: "https://api.groq.com/openai/v1",
  nvidia: "https://integrate.api.nvidia.com/v1",
};

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
    defaultModel: "gemini-flash-latest",
    modelSuggestions: ["gemini-flash-latest", "gemini-1.5-flash", "gemini-1.5-pro"],
    keyHint: "AIza…",
    keyUrl: "https://aistudio.google.com/apikey",
  },
  {
    id: "groq",
    label: "Groq (free tier)",
    needsKey: true,
    // llama-3.3-70b-versatile / llama-3.1-8b-instant / mixtral-8x7b-32768 were
    // retired by Groq (2026); gpt-oss-* and qwen are the current replacements.
    defaultModel: "openai/gpt-oss-120b",
    modelSuggestions: ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b"],
    keyHint: "gsk_…",
    keyUrl: "https://console.groq.com/keys",
  },
  {
    id: "ollama",
    label: "Ollama (fully offline)",
    needsKey: false,
    defaultModel: "llama3.1",
    modelSuggestions: ["llama3.1", "qwen2.5", "mistral", "phi3"],
    keyHint: "",
  },
  {
    id: "nvidia",
    label: "NVIDIA NIM",
    needsKey: true,
    defaultModel: "nvidia/nemotron-3-super-120b-a12b",
    modelSuggestions: [
      "nvidia/nemotron-3-super-120b-a12b",
      "meta/llama-3.3-70b-instruct",
      "meta/llama-3.1-405b-instruct",
    ],
    keyHint: "nvapi-…",
    keyUrl: "https://org.ngc.nvidia.com/setup/api-key",
  },
  {
    id: "custom",
    label: "Custom (OpenAI-compatible)",
    needsKey: true, // key optional at call time, but needs the key/base-URL settings block
    defaultModel: "",
    modelSuggestions: [],
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

    if (s.provider === "groq" || s.provider === "nvidia") {
      const base = FIXED_BASE_URLS[s.provider]!;
      const r = await fetch(`${base}/models`, { headers: { Authorization: `Bearer ${s.apiKey}` } });
      return r.ok
        ? { ok: true, message: `Connected to ${providerMeta(s.provider).label}.` }
        : { ok: false, message: `Rejected (${r.status}).` };
    }

    if (s.provider === "custom") {
      const base = (s.baseUrl || "").replace(/\/+$/, "");
      if (!base) return { ok: false, message: "Enter a base URL." };
      const r = await fetch(`${base}/models`, {
        headers: s.apiKey ? { Authorization: `Bearer ${s.apiKey}` } : {},
      });
      return r.ok
        ? { ok: true, message: "Connected to your custom endpoint." }
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
