@AGENTS.md

# Hisaabi

**Hisaabi** (domain: hisaabi.co.in) is a privacy-first, **local-first** AI expense tracker: a chat UI to log expenses in natural language, a categorized dashboard, and an SEO marketing site with a blog. Target user: privacy-conscious individuals (India-first, INR default) who want to track spending without handing their financial data to a cloud service. Users bring their own AI API key (OpenAI / Anthropic / Gemini / Ollama).

Tagline: **"Chat your expenses. Keep your data."**

## Non-negotiable: 100% local data

The product's core identity. Enforce everywhere:

- **Zero cloud storage of user data.** No server DB, no auth, no accounts, no sync. All financial data (expenses, income, profile, memories, chat history, settings) lives ONLY in the browser via IndexedDB (Dexie).
- **The only outbound network call from the app is:** user's browser → their own AI provider, with their own key. Nothing else. No telemetry, no error reporting, no analytics on `/app/*` routes (they must load zero third-party scripts).
- Marketing pages may use cookieless analytics (Plausible/Umami) — **never** on app routes.
- Prove it in the UI: the `DataResidencyBadge` ("Your data lives here" + live record counts) and a privacy page inviting users to open the Network tab.
- Open source, so the claim is auditable.

## Tech stack (do not deviate without asking)

- **Next.js 16 (App Router) + TypeScript** — strict mode, no `any`. NOTE: Next 16 has breaking changes vs. older versions; consult `node_modules/next/dist/docs/` (see AGENTS.md).
- **Rendering:** marketing pages (`/`, `/blog`, `/features`, `/guides`, `/vs`) = SSR/SSG for SEO. The app (`/app/*`) = client-side, offline-capable.
- **Tailwind CSS v4** — CSS-based config in `src/app/globals.css` via `@theme`. No `tailwind.config.ts`.
- **Local DB:** Dexie.js (`src/lib/db.ts`).
- **AI layer:** Vercel AI SDK (`ai` package) with provider adapters. **No LangChain.**
- **Charts:** Recharts (lazy-loaded).
- **PWA:** manual service worker (`public/sw.js`) + `public/manifest.webmanifest`. Installable, offline app shell.
- **Hosting:** Vercel. **No backend, no auth, no server database.**

## Data model (Dexie — `src/lib/db.ts`)

Dates are stored as ISO `YYYY-MM-DD` strings (range-queryable). Timestamps are full ISO strings.

- `expenses`: id, amount, category, note?, date, createdAt — indexes: `++id, date, category, createdAt`
- `income`: id, amount, source, date, createdAt — indexes: `++id, date, createdAt`
- `profile`: **single record (id=1)** — salary?, salaryDate?, currency (default INR), budgetGoals[], recurringBills[], customCategories[]
- `memories`: id, note, createdAt — `++id, createdAt`
- `chatMessages`: id, role, content, createdAt — `++id, createdAt`
- `settings`: **single record (id=1)** — provider, apiKey, model, ollamaUrl?

Single-record tables use the get-or-create helpers in `src/lib/store.ts` (`getProfile`, `getSettings`). Default categories in `src/lib/categories.ts`.

## AI tools & context assembly (to build)

Function-calling tools the AI can invoke (all run against IndexedDB):

- `add_expense({ amount, category, note, date })`
- `add_income({ amount, source, date })`
- `query_expenses({ from, to, category?, groupBy? })` — returns **aggregates**, never raw rows
- `update_profile({ salary?, currency?, budgetGoals?, recurringBills? })`
- `save_memory({ note })`
- `delete_expense({ id })`

**Context per message:** system prompt + profile JSON + memory notes + a **JS-computed** monthly summary (totals by category, vs last month) + last ~10 chat messages. Never dump raw rows into the prompt.

Rules: ambiguous input → AI asks a clarifying question ("spent 500" → "on what?"). Every write is confirmed with an inline card (amount, category, date, undo). AI failures (bad JSON, rate limit, wrong key) → friendly error, never lose user input.

For Anthropic direct-from-browser calls, send header `anthropic-dangerous-direct-browser-access: true`.

## Security hardening (required)

Folds into the settings, chat, and marketing milestones — not a separate build. All of it stays client-side.

- **Encryption at rest (optional, user-enabled):** an app passcode encrypts the sensitive stores (expenses, income, profile, memories, chat) with **WebCrypto AES-GCM**; key derived from the passcode via **PBKDF2 (≥310k iterations, random salt)**. Unlock once per session; auto-lock after a configurable idle time. Passcode loss = data unrecoverable — warn clearly and push export backups.
- **XSS defense (critical — this is what protects the API key):** strict **CSP on `/app/*`** (no inline scripts, no third-party origins). **Never render AI/chat output as raw HTML** — plain text or sanitized markdown only. Escape everything from user input and AI responses.
- **API key handling:** local only; **mask in UI** after entry; **"test key"** button; one-click remove. Docs should recommend users create a scoped/limited key where the provider supports it.
- **Data durability:** request `navigator.storage.persist()` on first use; show persistence status in settings; nudge a JSON export if none taken in 30 days; offer **encrypted export** (same passcode).
- **Honest privacy copy:** the privacy page states exactly what leaves the device — **nothing, except the assembled prompt sent to the user's chosen AI provider when they chat** (and nothing at all with local Ollama). No absolute claims we can't keep.
- **No secrets in URLs. No logging of financial data to console in production.**

## SEO conventions

- Canonical domain **https://hisaabi.co.in**; brand **Hisaabi** everywhere. `metadataBase` set in root layout.
- Per-page unique `<title>` (≤60 chars) + meta description (≤155) via the Metadata API.
- OG + Twitter tags; generated OG image.
- JSON-LD: homepage `SoftwareApplication` (FinanceApplication, price 0, OS Web) + `FAQPage`; blog posts `Article` (author, datePublished, dateModified).
- `sitemap.xml` + `robots.txt` (auto-generated). `/app/*` is `noindex` (set in `src/app/app/layout.tsx`).
- Semantic HTML: one `<h1>`/page, heading hierarchy, alt text.
- Internal linking: hub-and-spoke. Blog posts link to homepage (contextual anchors), their pillar, and 2–3 related posts via a `related` frontmatter field. Every page reachable ≤3 clicks from home; no orphans.
- Primary keywords: "AI expense tracker", "expense tracker with chat", "private expense tracker". Long-tail + comparison lists in `initial-prompt.md` §3.3. Weave naturally, never stuff.

## Blog workflow (to build)

- MDX in `/content/blog/`, frontmatter: title, description, date, tags, cover, related.
- Statically generated; Article schema; reading time; "Related reading" (3 cards) at post end.
- Pillar guides in `/guides/*` (2,500–4,000 words), each linking to its cluster.
- `scripts/generate-post.ts`: keyword → LLM draft with frontmatter → opens a PR. **Never auto-publishes.** Human curates a topics queue. Quality > volume (Google penalizes scaled AI content).

## Commands

- Dev: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Test: (none yet — add `pnpm test` when a runner is introduced)

Package manager: **pnpm**.

## Folder structure

- `src/app/` — routes. `src/app/app/*` = the client app (chat, dashboard, settings).
- `src/lib/` — `db.ts` (Dexie), `store.ts` (single-record helpers), `categories.ts`.
- `src/components/` — shared client components.
- `public/` — brand icons, `manifest.webmanifest`, `sw.js`.
- `content/blog/` — MDX posts (to add).

## Do NOT

- Store user data server-side, ever. No auth, no accounts, no sync, no server DB.
- Add analytics/telemetry that touch financial data. Cookieless analytics OK on **marketing pages only**.
- Load third-party scripts on `/app/*`.
- Use LangChain.
- Introduce `any` or disable strict mode.
- Suggest (in code, prompts, or docs) that data is stored remotely.
- Render AI/chat output as raw HTML (`dangerouslySetInnerHTML` on model or user text) — plain text or sanitized markdown only.
- Put secrets (API keys) in URLs, or `console.log` financial data in production.
- Make absolute privacy claims the code can't back — state exactly what leaves the device (the assembled prompt → the user's provider; nothing with Ollama).
