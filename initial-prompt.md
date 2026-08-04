# Coding Agent Prompt — AI Expense Tracker (Local-First, Chat + Dashboard)

Copy everything below this line into your coding agent.

---

## Project Brief

Build **Hisaabi** (domain: hisaabi.co.in) — a privacy-first, local-first AI expense tracker web app with a chat interface, a categorized expense dashboard, and an SEO-optimized marketing site with a blog. Users bring their own AI API key (OpenAI / Anthropic / Gemini / Ollama). All financial data stays on the user's device. Installable as a PWA on phones.

**Tagline concept:** "Chat your expenses. Keep your data."

---

## 0. Non-Negotiable Principle: 100% Local Data

This is the product's core identity. Enforce it everywhere:
- **Zero cloud storage of user data.** No server database, no auth, no user accounts, no sync service. All financial data (expenses, income, salary, profile, memories, chat history) lives ONLY in the user's browser via IndexedDB
- **Only outbound network call from the app:** the user's browser → their own AI provider, using their own API key. Nothing else. No telemetry, no error-reporting services, no analytics inside the app (`/app/*` routes must load zero third-party scripts)
- Marketing pages may use privacy-friendly, cookieless analytics (Plausible/Umami) — never on app routes
- **Prove it in the UI:** a "Your data lives here" indicator in the app showing storage location + record counts, and a privacy page that says "Open your browser's Network tab — the only requests you'll see go to your AI provider"
- Open-source the repo so the claim is verifiable; link GitHub prominently
- Every AI call's system prompt and docs must never suggest data is stored remotely

---

## 1. Tech Stack (do not deviate without asking)

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Rendering strategy:** Marketing pages (homepage, blog, features) = SSR/SSG for SEO. The app itself (`/app` route) = client-side, works offline
- **Styling:** Tailwind CSS
- **Local database:** Dexie.js (IndexedDB wrapper)
- **AI layer:** Vercel AI SDK (`ai` package) with provider adapters so users can plug in OpenAI, Anthropic, Google Gemini, or a custom Ollama endpoint. Do NOT use LangChain.
- **Charts:** Recharts
- **PWA:** next-pwa or manual service worker — installable, offline-capable for viewing/adding expenses
- **Hosting target:** Vercel
- **No backend, no auth, no server database.** The only network calls are from the user's browser directly to their chosen AI provider.

---

## 2. Core Features

### 2.1 Chat Interface (`/app`)
- Chat UI where the user types natural language: "spent 450 on groceries yesterday", "got my salary 80k today", "how much did I spend on food this month?"
- The AI has these tools (function calling):
  - `add_expense({ amount, category, note, date })`
  - `add_income({ amount, source, date })`
  - `query_expenses({ from, to, category?, groupBy? })` — runs against IndexedDB, returns aggregates
  - `update_profile({ salary?, currency?, budgetGoals?, recurringBills? })`
  - `save_memory({ note })` — short free-form facts worth remembering
  - `delete_expense({ id })`
- **Context assembly per message:** system prompt + user profile JSON + memory notes + computed monthly summary (totals by category, comparison to last month — computed in JS, never dump raw rows) + last ~10 chat messages
- Handle ambiguous input gracefully: if user says "spent 500", the AI asks "on what?"
- Confirm every write with a compact inline card in chat (amount, category, date, undo button)

### 2.2 Dashboard (`/app/dashboard`)
- Monthly view (switchable months) with:
  - Total spent, total income, savings this month
  - Pie/donut chart: spend by category
  - Bar chart: last 6 months trend
  - Category list with amounts, % of total, vs-last-month delta
  - Recent transactions table: edit, delete, re-categorize
- Budget progress bars if user has set budget goals
- All computed client-side from IndexedDB

### 2.3 Data & Memory (all in IndexedDB via Dexie)
- `expenses`: id, amount, category, note, date, createdAt
- `income`: id, amount, source, date
- `profile`: single record — salary, salaryDate, currency (default INR, user-changeable), budgetGoals[], recurringBills[]
- `memories`: id, note, createdAt
- `chatMessages`: id, role, content, createdAt
- `settings`: provider (openai/anthropic/gemini/ollama), apiKey, model, ollamaUrl
- Default categories: Food & Dining, Groceries, Transport, Rent & Utilities, Shopping, Entertainment, Health, Education, Subscriptions, Travel, Other — user can add custom ones

### 2.4 Settings (`/app/settings`)
- Provider picker + API key input (stored in localStorage, never sent anywhere except the provider). Show a clear "your key never leaves your device" note
- For Anthropic direct-from-browser calls, include the `anthropic-dangerous-direct-browser-access: true` header
- Currency selection
- **Export / Import:** full data as JSON, expenses as CSV
- **Danger zone:** wipe all local data

### 2.5 PWA
- manifest.json with icons, standalone display
- Service worker: app shell + dashboard work offline; chat requires network (AI call) but queues gracefully
- "Install app" prompt on mobile

---

## 2.6 Security Hardening (required)
- **Encryption at rest (optional, user-enabled):** app passcode that encrypts sensitive stores (expenses, income, profile, memories, chat) with WebCrypto AES-GCM; key derived from passcode via PBKDF2 (≥310k iterations, random salt). Unlock once per session; auto-lock after configurable idle time. Losing the passcode = data unrecoverable — warn clearly and push export backups
- **XSS defense (critical — protects the API key):** strict CSP on app routes (no inline scripts, no third-party origins), never render AI/chat output as raw HTML (plain text or sanitized markdown only), escape everything from user input and AI responses
- **API key handling:** stored locally only; mask in UI after entry; "test key" button; one-click remove. Docs recommend users create a scoped/limited key where the provider supports it
- **Data durability:** request `navigator.storage.persist()` on first use; show persistence status in settings; nudge a JSON export if none taken in 30 days; offer encrypted export (same passcode)
- **Honest privacy copy:** privacy page states exactly what leaves the device — nothing, except the assembled prompt sent to the user's chosen AI provider when they chat (and nothing at all with local Ollama). No absolute claims we can't keep
- **No secrets in URLs, no logging of financial data to console in production**

---

## 3. Marketing Site & SEO (build from day one)

### 3.1 Pages (all SSR/SSG)
- `/` — homepage (copy below)
- `/blog` — blog index
- `/blog/[slug]` — blog posts (MDX or markdown files in repo, statically generated)
- `/features`, `/privacy`, `/about`
- `/vs/[competitor]` — comparison pages (create 3: vs-mint-alternatives, vs-spreadsheets, vs-firefly-iii)

### 3.2 Technical SEO checklist
- Canonical domain: **https://hisaabi.co.in** — use it in all canonical URLs, sitemap, OG tags, and JSON-LD. Brand name everywhere: **Hisaabi**
- Unique `<title>` (≤60 chars) and meta description (≤155 chars) per page via Next.js Metadata API
- Open Graph + Twitter card tags, with a generated OG image
- JSON-LD schema:
  - Homepage: `SoftwareApplication` (name, description, applicationCategory: FinanceApplication, offers: price 0, operatingSystem: Web)
  - Blog posts: `Article` with author, datePublished, dateModified
  - FAQ section on homepage: `FAQPage`
- `sitemap.xml` (auto-generated) and `robots.txt`
- Canonical URLs on every page
- Semantic HTML (single h1 per page, proper heading hierarchy, alt text)
- Core Web Vitals: lazy-load charts, optimize images with next/image, target Lighthouse ≥95 on marketing pages
- **Internal linking strategy (hub-and-spoke, implement site-wide):**
  - Every blog post links to: the homepage (contextual anchor text like "free AI expense tracker", not "click here"), the most relevant pillar page, and 2–3 related posts
  - Pillar pages link down to all their cluster posts; cluster posts link up to their pillar
  - Marketing pages cross-link: homepage → features, privacy, comparisons, and 2 featured blog posts; features → relevant blog guides; comparison pages → features + homepage
  - Footer: global links to pillars, blog, features, privacy, GitHub
  - Add a "Related reading" component (3 cards) at the bottom of every blog post, and in-body contextual links where topics overlap
  - Build a `related` field in blog frontmatter so links are deliberate, not random
  - Rule: every page on the site must be reachable within 3 clicks from the homepage, and no orphan pages

### 3.3 Target keywords (weave naturally, never stuff)
- Primary: "AI expense tracker", "expense tracker with chat", "private expense tracker"
- Long-tail: "expense tracker that doesn't sell your data", "chatgpt for expense tracking", "local first budget app", "offline expense tracker", "expense tracker without cloud", "expense tracker no signup", "budget app that works offline", "free ai budgeting app india"
- Comparison: "mint alternative free", "firefly iii alternative", "simple expense tracker app"

### 3.4 Backlinks (note for the human, not the agent)
Backlinks can't be coded — they come from launches: Product Hunt, Hacker News (Show HN), r/SideProject, r/selfhosted, r/privacy, dev.to write-up, GitHub README (open-source the repo — GitHub links + stars help). The agent should generate a great README to support this.

---

## 4. Homepage Copy

**Hero**
- H1: "Track expenses by chatting. Your data never leaves your phone."
- Sub: "Type 'spent 450 on groceries' and you're done. Hisaabi is a free AI expense tracker with a chat interface — no signup, no cloud, no data collection. Bring your own AI key and own your financial life."
- CTA button: "Start tracking — it's free" → `/app`
- Secondary CTA: "See how it works" → demo section

**Section: How it works (3 steps)**
1. **Chat naturally** — "Tell it what you spent like you'd text a friend. The AI parses, categorizes, and saves it instantly."
2. **See where money goes** — "A clean dashboard shows spending by category, monthly trends, and how you're tracking against your budget."
3. **Stay private by design** — "Everything is stored on your device. Your expenses, salary, and habits are never uploaded anywhere. Ever."

**Section: Why Hisaabi (differentiators)**
- "No signup, no account, no email" 
- "Your AI, your key — works with OpenAI, Claude, Gemini, or fully offline with Ollama"
- "Remembers your context — salary, goals, recurring bills — so advice actually fits you"
- "Works on your phone — install it like an app, use it anywhere"
- "Free forever, open source"

**Section: Your data never leaves your device (dedicated privacy section, above FAQ)**
- Headline: "No cloud. No account. No trust required."
- Body: "Hisaabi has no servers to store your data — by design, not by policy. Your expenses, salary, and habits live in your browser's local database and nowhere else. Don't take our word for it: open your browser's Network tab, or read the code on GitHub."
- Three proof points with icons: "Works offline — your dashboard loads with no internet" / "Open source — audit every line" / "Export anytime — your data is yours in one click (JSON/CSV)"
- Small comparison strip: "Most finance apps: your data on their servers → Hisaabi: your data on your device"

**Section: FAQ (also feeds FAQPage schema)**
- Is it really free? / Where is my data stored? / What AI do I need? / Can I use it without internet? / Can I export my data? / Is it open source?

**Footer:** links to blog, privacy, GitHub, features, comparisons

---

## 5. Blog

### 5.1 Structure
- MDX files in `/content/blog/`, frontmatter: title, description, date, tags, cover
- Statically generated, Article schema, reading time, related posts

### 5.2 Long-form pillar pages (create 3 now, 2,500–4,000 words each)
These are the SEO backbone — comprehensive, skimmable guides with a table of contents, H2/H3 structure, FAQ section (with FAQPage schema), and images/diagrams where useful:
1. `/guides/expense-tracking` — "The Complete Guide to Expense Tracking (2026)" — methods, categories, tools, habits, common mistakes; targets "how to track expenses"
2. `/guides/budgeting-for-beginners` — "Budgeting for Beginners: The Only Guide You Need" — 50/30/20, zero-based, envelope method, salary planning; targets "how to budget money"
3. `/guides/ai-personal-finance` — "How to Use AI for Personal Finance (Without Giving Up Your Privacy)" — targets "ai personal finance", "ai budgeting"

Each pillar links to its cluster of blog posts below; each post links back to its pillar.

### 5.3 Create these 6 launch posts now (800–1,200 words each, genuinely useful, no fluff)
1. "How to Track Expenses with AI: A Complete Guide (2026)"
2. "50/30/20 Budget Rule Explained with Real Examples"
3. "Why Your Expense Data Shouldn't Live in Someone Else's Cloud"
4. "Mint Is Gone: 7 Free Alternatives That Respect Your Privacy"
5. "How to Budget Your First Salary (Step-by-Step)"
6. "Local-First Apps Explained: Why They're the Future of Personal Finance"

### 5.4 Blog automation (build the pipeline, human controls the volume)
- A script (`scripts/generate-post.ts`) that takes a keyword/topic, calls an LLM to draft a post with frontmatter, and opens a PR (never auto-publishes)
- A topics queue file the human curates
- **Important note to human:** publishing 2–5 AI posts daily is risky — Google's "scaled content abuse" policy actively penalizes mass auto-generated content and can tank the whole domain. The pipeline supports any volume, but 2–3 genuinely good, human-reviewed posts per WEEK will outrank 5 unreviewed posts per day. Quality and editing are the ranking factors.

---

## 6. CLAUDE.md

Create a `CLAUDE.md` at repo root containing:
- One-paragraph project description and target user
- Full tech stack and the "no backend, local-first, BYO-key" architecture rules
- Data model (all Dexie tables and fields)
- The AI tool definitions and context-assembly strategy
- SEO conventions (metadata pattern, JSON-LD locations, keyword list)
- Blog workflow (how to add a post, frontmatter format, automation script usage)
- Commands: dev, build, lint, test
- Style conventions and folder structure
- "Do not" rules: no server-side storage of user data, no analytics that capture financial data (privacy-friendly analytics like Plausible OK for marketing pages only), no LangChain

---

## 7. Build Order (milestones)

1. Scaffold Next.js + Tailwind + PWA + CLAUDE.md
2. Dexie schema + settings page (provider/key management)
3. Chat interface + AI tool calling + context assembly
4. Dashboard with charts
5. Export/import + polish + empty states + mobile responsiveness
6. Marketing pages with full SEO (metadata, JSON-LD, sitemap)
7. 6 launch blog posts + generation script
8. README + Lighthouse pass + deploy to Vercel

## 8. Quality Bar

- TypeScript strict mode, no `any`
- Handle AI failures gracefully (bad JSON, rate limits, wrong key → friendly error, never lose user input)
- Every write action reversible (undo/edit/delete)
- Empty states designed (new user sees a friendly "try typing: spent 200 on coffee")
- Mobile-first: the chat and dashboard must feel great on a phone