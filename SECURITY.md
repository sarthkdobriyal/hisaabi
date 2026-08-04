# Coding Agent Prompt — Hisaabi Security Hardening

Apply this to the Hisaabi codebase (local-first AI expense tracker, Next.js PWA, IndexedDB via Dexie, BYO AI key). Treat every item as a requirement, not a suggestion. After implementing, produce a short SECURITY.md summarizing what was done.

---

## Threat Model (what we defend against)

We have NO server and NO cloud database — so there is no central breach risk. The remaining threats, in priority order:

1. **XSS stealing the user's AI API key or financial data** (highest priority — the key lives in the browser)
2. **Someone with physical/profile access to the device reading unencrypted IndexedDB**
3. **Accidental data loss** (user clears browser data, browser evicts storage)
4. **Leaking data through side channels** (URLs, logs, error reporters, third-party scripts)

Out of scope: malware/keyloggers on the user's device, compromised AI providers. We don't claim to defend against these — and our copy must not pretend we do.

---

## 1. XSS Defense (protects the API key) — CRITICAL

- **Strict Content-Security-Policy on all `/app/*` routes:**
  - `default-src 'self'`
  - `connect-src 'self' https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com http://localhost:11434` (plus any user-configured Ollama origin, applied at runtime validation, not by loosening CSP wildcards)
  - `script-src 'self'` — no inline scripts, no eval, no third-party script origins, ever
  - `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`
- **Never render AI or user content as raw HTML.** Chat messages render as plain text or through a sanitizing markdown renderer with raw HTML disabled (e.g. react-markdown with `skipHtml`, no `rehype-raw`, no `dangerouslySetInnerHTML` anywhere in the app)
- Escape/validate everything that flows from AI tool-call arguments before writing to the DB (amounts must be numbers, dates must parse, category from known list or explicitly created)
- Zero third-party scripts, fonts, or CDNs on app routes — self-host everything
- Add a CI grep check that fails the build if `dangerouslySetInnerHTML` or `eval(` appears in `/app` code

## 2. Encryption at Rest (optional, user-enabled passcode)

- Settings toggle: "Encrypt my data with a passcode"
- Implementation: WebCrypto only (no JS crypto libraries for the primitives)
  - Key derivation: PBKDF2-SHA256, ≥ 310,000 iterations, 16-byte random salt (stored alongside data)
  - Encryption: AES-GCM 256, fresh random 12-byte IV per record write; store IV with ciphertext
  - Encrypt the sensitive stores: expenses, income, profile, memories, chatMessages. Settings/preferences may stay plaintext except the API key (see §3)
  - Derive key on unlock, hold only in memory (never persist derived key), wipe on lock
- Session behavior: unlock once per session; auto-lock after configurable idle (default 15 min) and on tab close
- Passcode is unrecoverable by design — show a clear warning at setup and require the user to take an export before enabling
- Migration paths: enabling encrypts existing data in place; disabling (after passcode entry) decrypts back

## 3. API Key Handling

- Store provider keys in localStorage (encrypted with the same passcode when encryption is enabled)
- Mask key in UI after entry (show last 4 chars); "Test key" button makes one minimal call; one-click remove
- Never include the key in exports, URLs, logs, or error messages
- Settings copy recommends users create a scoped/spend-limited key where their provider supports it
- For Anthropic browser calls include the `anthropic-dangerous-direct-browser-access: true` header; validate custom Ollama URLs (http(s) only, warn if non-localhost)

## 4. Data Durability (loss prevention)

- Call `navigator.storage.persist()` on first data write; surface granted/denied status in Settings
- Backup nudge: non-intrusive banner if no export in 30 days (track lastExportAt locally)
- Export options: plain JSON, CSV (expenses), and **encrypted JSON export** (AES-GCM with the user's passcode) for safe cloud-drive storage
- Import validates schema, previews counts, and merges or replaces explicitly — never silently overwrites

## 5. Side-Channel Hygiene

- No financial values, categories, or profile data in: URLs/query strings, document titles, console logs (strip console.* in production builds), analytics events, or error messages
- No error-reporting SaaS (Sentry etc.) on app routes; if added to marketing pages, it must not load on `/app/*`
- Service worker must not cache AI provider responses; cache app shell and static assets only
- PWA share/screenshot metadata must not embed live user data

## 6. Honest Privacy Copy (enforced in content)

- Privacy page states exactly: "Your data is stored only on your device. The only network traffic this app produces is the message context sent to the AI provider YOU configured, using YOUR key, when you chat. With local Ollama, nothing leaves your machine at all."
- Never claim: "bank-grade security", "100% secure", "zero data leaves your device" (the AI call makes that false unless Ollama), or imply we can recover lost data
- FAQ entries: "Can Hisaabi see my data?" (No — and here's how to verify in DevTools), "What happens if I clear my browser data?" (It's gone unless you exported — here's how), "What does the AI provider see?" (honest answer)

## 7. Verification Checklist (run before shipping)

1. Open DevTools → Network on `/app`: with cloud provider, only requests are to that provider; with Ollama, only localhost; zero requests on dashboard browsing
2. Attempt XSS: enter `<img src=x onerror=alert(1)>` and markdown/HTML payloads as expense notes and chat messages — must render inert as text everywhere (chat, dashboard, exports re-imported)
3. With encryption on: inspect IndexedDB in DevTools — sensitive stores show ciphertext only; reload → app locked; wrong passcode fails cleanly
4. Lighthouse + securityheaders.com pass on deployed site; CSP shows no warnings in console during normal use
5. Grep the production bundle for the test API key string — must not appear anywhere except localStorage
6. Clear-site-data test: confirm the export/import round trip restores everything

---

**Definition of done:** all 7 sections implemented, verification checklist passes, SECURITY.md written documenting the threat model and what users should know.
