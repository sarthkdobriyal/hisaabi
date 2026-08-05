<div align="center">
  <img src="./public/hisaabi-icon.svg" alt="Hisaabi" width="88" height="88" />
  <h1>Hisaabi</h1>
  <p><strong>Chat your expenses. Keep your data.</strong></p>
  <p>A free, private, <strong>local-first</strong> AI expense tracker. Log spending by chatting — <em>"spent 450 on groceries"</em> — and your financial data never leaves your device.</p>
  <p>
    <a href="https://hisaabi.co.in">Website</a> ·
    <a href="#privacy-prove-it-yourself">Privacy</a> ·
    <a href="#quickstart">Quickstart</a> ·
    <a href="#roadmap">Roadmap</a>
  </p>
</div>

---

## What is Hisaabi?

Hisaabi is an **AI expense tracker with a chat interface**. Instead of tapping through forms, you type like you'd text a friend:

- *"spent 450 on groceries yesterday"* → logged & categorized
- *"got my salary 80k today"* → income recorded
- *"how much did I spend on food this month?"* → answered from your own data

The twist: **there is no server, no account, no cloud.** All your expenses, income, salary, and chat history live only in your browser (IndexedDB). The single outbound request the app ever makes is from **your** browser to **your** AI provider, using **your** API key. Nothing else — no telemetry, no analytics, no data collection.

## Why it's different

- **No signup, no account, no email** — open it and start.
- **Your AI, your key** — OpenAI, Anthropic (Claude), Google Gemini, or fully offline with **Ollama**.
- **100% local data** — private by architecture, not by promise. No servers to leak.
- **Works offline** — installable PWA; your dashboard loads with no internet.
- **Tracks cash and bank separately** — running balances for both, editable on the dashboard, with expenses defaulting to the bank account (UPI/card) unless you say cash.
- **Open source** — audit every line. The privacy claim is verifiable.
- **Free forever.**

## Features

- **Chat-first expense logging** — type *"spent 450 on groceries"*; the AI categorizes, records, and shows a confirm card with Undo.
- **Cash & bank balances** — set starting balances during setup (or on the dashboard) and they adjust automatically as you log money in and out.
- **Recurring bill reminders** — add monthly bills in Settings; on the due day a popup on the chat page asks *"was it deducted?"* — one tap logs the expense.
- **Salary credit popup** — on your salary day, confirm the credit and it's recorded as income in one tap.
- **Categorized dashboard** — monthly income/expense/net, category spend vs budget limits, daily spend bars, and month-over-month comparison.
- **Loans** — a "Loan / Borrowed" category keeps borrows and repayments balanced (see the onboarding guide below).

## First time? Start here

The most common pitfall is a mismatch between this month's **Net** (income − expenses) and the **Total money** shown in Balances — usually because money moved that wasn't logged (an old loan repaid, a cash gift). Two habits keep them aligned:

1. **Set your starting balances first.** During setup you'll be asked how much cash and bank money you have right now. This is your baseline; everything after it is tracked movement.
2. **Log both sides of a transfer.** Borrowed ₹3,000 last month and repaid it? Log the borrow as income (*"borrowed 3000 from Rohan"*) and the repayment as an expense in the **Loan / Borrowed** category (*"paid back 3000 to Rohan"*). Skipping one side makes your balance and category spend diverge.
3. **Say when it's cash.** Expenses default to the bank account (UPI/card). If you paid in cash, just say so: *"spent 200 cash on coffee"*.

## Privacy — prove it yourself

We don't ask you to trust us. Verify it:

1. Open the app and add a few expenses.
2. Open your browser's **Network tab**.
3. The only requests you'll ever see go to **your chosen AI provider** — and with local Ollama, none leave your machine at all.

The app also shows a live **"Your data lives here"** indicator with your record counts, so you always know where your data is: right there in your browser.

> **What actually leaves your device?** Only the assembled prompt sent to your AI provider *when you chat* (your profile summary + recent messages, never a raw dump of every transaction). With Ollama, nothing leaves at all.

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Local database | Dexie.js (IndexedDB) |
| AI layer | Vercel AI SDK — pluggable providers (no LangChain) |
| Charts | Recharts |
| PWA | manifest + service worker (installable, offline app shell) |
| Hosting | Vercel (static/SSR marketing + client-only app) |

**No backend. No auth. No server database.**

## Quickstart

Requires Node 20+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Then:

1. Go to **Settings** and add your AI provider + API key (stored locally, never sent anywhere but the provider). Or point at a local **Ollama** endpoint for a fully offline setup.
2. Head to the app and start typing your expenses.

### Scripts

```bash
pnpm dev     # start the dev server
pnpm build   # production build
pnpm lint    # eslint
```

## Security

Hisaabi treats your financial data as sensitive by default:

- **Optional encryption at rest** — a passcode encrypts your stores with WebCrypto AES-GCM (PBKDF2 key derivation, ≥310k iterations). Auto-locks when idle.
- **XSS-hardened** — strict CSP on app routes; AI/chat output is never rendered as raw HTML.
- **API key stays local** — masked in the UI, one-click removable, never placed in URLs. We recommend creating a scoped/limited key where your provider supports it.
- **Data durability** — requests persistent storage and nudges you to keep JSON/CSV backups.

Found a security issue? Please open an issue (or a private advisory) rather than a public PR.

## Roadmap

- [x] Local-first foundation: Dexie schema, PWA, brand
- [x] Chat interface + AI tool calling + context assembly
- [x] Dashboard: balances, category breakdown, budgets, trends
- [x] Cash/bank balance tracking + salary & recurring-bill popups
- [ ] Settings: export/import, encryption at rest
- [ ] Marketing site + blog + full SEO
- [ ] Deploy

## Contributing

Contributions welcome. Please keep the core principle intact: **no user data ever touches a server.** No analytics/telemetry on app routes, no LangChain, TypeScript strict (no `any`).

## License

MIT — see [LICENSE](./LICENSE).
