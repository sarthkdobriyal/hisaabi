# Route Map

All routes under `src/app/**/page.tsx`. Two shells: **marketing** (no wrapping
layout beyond root — each page renders `MarketingHeader`/`MarketingFooter`
inline) and **app** (wrapped by `src/app/app/layout.tsx` which provides
`AppHeader`, `VaultGate`, and `PwaInstallModal`).

Root layout: `src/app/layout.tsx` (Geist fonts, global metadata, `<body>` flex
column).

---

## Marketing Routes

| URL path | Component file | Layout | Summary |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Root | Home page: hero, feature grid, how-it-works steps, privacy callout, security blog cards, FAQ accordion, CTA |
| `/features` | `src/app/features/page.tsx` | Root | Feature grid linking to individual feature pages, how-it-works, CTA |
| `/features/[slug]` | `src/app/features/[slug]/page.tsx` | Root | Individual feature detail via `FeaturePage` component (breadcrumb, sections, FAQs, related features, CTA) |
| `/pricing` | `src/app/pricing/page.tsx` | Root | Single "$0 forever" pricing card, included features list, comparison table vs cloud trackers |
| `/blog` | `src/app/blog/page.tsx` | Root | Blog index: category tabs, masonry `BlogGrid` of `BlogCard` components |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` | Root | Blog post reader: markdown body, related reading cards, structured data |
| `/about` | `src/app/about/page.tsx` | Root | Origin story, three "what we believe" pillar cards, open-source callout |
| `/privacy` | `src/app/privacy/page.tsx` | Root | Privacy policy prose — "data stays in browser" sections |
| `/terms` | `src/app/terms/page.tsx` | Root | Terms of service prose |

## Marketing: /vs/* (competitor alternative pages)

Each renders `VsPage` component with data props.

| URL path | Component file |
|---|---|
| `/vs/excel-expense-tracker` | `src/app/vs/excel-expense-tracker/page.tsx` |
| `/vs/splitwise-alternative` | `src/app/vs/splitwise-alternative/page.tsx` |
| `/vs/notion-expense-tracker` | `src/app/vs/notion-expense-tracker/page.tsx` |
| `/vs/mint-alternative` | `src/app/vs/mint-alternative/page.tsx` |

## Marketing: /guides/* (long-form guide pages)

Each renders `GuidePage` component with data props.

| URL path | Component file |
|---|---|
| `/guides/ai-expense-tracker` | `src/app/guides/ai-expense-tracker/page.tsx` |
| `/guides/private-expense-tracking` | `src/app/guides/private-expense-tracking/page.tsx` |
| `/guides/track-expenses-in-india` | `src/app/guides/track-expenses-in-india/page.tsx` |
| `/guides/budgeting-with-ai` | `src/app/guides/budgeting-with-ai/page.tsx` |

---

## App Routes

All nested under `src/app/app/layout.tsx` (App shell: `VaultGate` + `AppHeader` + centered column).

| URL path | Component file | Layout | Summary |
|---|---|---|---|
| `/app` | `src/app/app/page.tsx` | App | Chat page: real-time chat with AI, expense confirm cards, typing indicator, composer; falls back to `SetupScreen` if no provider configured |
| `/app/dashboard` | `src/app/app/dashboard/page.tsx` | App | Dashboard: month nav, editable balances, stat cards (income/expense/net), charts (dynamic import), budget rollup, cash vs bank, savings rate, recurring bills, category detail, month-over-month |
| `/app/expenses` | `src/app/app/expenses/page.tsx` | App | Expense ledger: month nav, category filter, grouped-by-date rows, inline edit, delete with undo |
| `/app/settings` | `src/app/app/settings/page.tsx` | App | Settings: AI provider config, profile & budget, security & encryption (enable/change/disable passcode, encrypted backups), storage & backup (JSON/CSV export/import), danger zone (wipe) |
