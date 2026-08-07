# Hisaabi Design System — Synapse / Red-Noir Inspired

## Product Context

**Hisaabi** (hisaabi.co.in) is a free, privacy-first, local-first AI expense tracker with a chat interface. Users type natural language like "spent 450 on groceries" and the AI parses, categorizes, and saves it. All data stays in the browser (IndexedDB). No account, no cloud, no signup. Users bring their own AI key (OpenAI, Anthropic, Gemini, Groq, Ollama).

**Target audience:** Privacy-conscious individuals, freelancers, and young professionals in India who want effortless expense tracking without giving up financial data.

**Key pages:** Homepage (marketing), Features index, Individual feature pages (chat tracking, auto-categorization, budgets, privacy, encryption, offline PWA, etc.), Pricing (free forever), Blog, Guides, Comparison pages (/vs/*).

**Tagline:** "Chat your expenses. Keep your data."

## Visual Direction — "Teal Noir" (Synapse-inspired, adapted to Hisaabi)

Inspired by the Red Noir / Synapse style — dark, cinematic, premium feel — but recolored from red to Hisaabi's teal/emerald brand. The dark aesthetic reinforces the "vault" / "privacy" metaphor (your data is locked in darkness, safe). The result should feel like a premium fintech product, not a toy.

### Color Palette

**Primary brand (accent):**
- `--brand`: `#0d9488` (teal-600) — primary accent, replaces red in the reference
- `--brand-600`: `#059669` (emerald-600) — secondary accent for gradients
- Brand glow: `rgba(13, 148, 136, 0.5)` — for glows, shadows, hover states

**Background system (dark-first marketing):**
- Page background: near-black `#0a0a0a` to pure `#000000`
- Top gradient: `from-[#051a17]` (dark teal-tinted) to black — replaces the red-tinted `from-[#1a0505]`
- Card surfaces: `bg-zinc-900/50`, `bg-white/[0.02]`, `bg-white/5`
- Borders: `border-white/10`, hover → `border-white/20`, brand-accent → `border-teal-500/30`

**Text hierarchy:**
- Headings: white (`#ffffff`) with gradient fade `from-white via-white to-white/40`
- Body: `text-zinc-400` (#a1a1aa)
- Muted: `text-zinc-500` (#71717a)
- Accent text: `text-teal-400` for emphasis words in headings

**Semantic colors:**
- Success/privacy: emerald-400 `#34d399`
- Warning: amber-500 `#f59e0b`
- Destructive: red-500 `#ef4444`

### Typography

- **Headings:** Geist Sans (the project's `--font-geist-sans`), bold/semibold, very tight tracking (`tracking-tighter` for hero, `tracking-tight` for section headings). Large hero: 6xl-8xl. Section headings: 4xl-5xl.
- **Body:** Geist Sans, regular weight, `text-lg` for lead paragraphs, `text-sm` for card descriptions.
- **Mono/code:** Geist Mono (`--font-geist-mono`) for accent labels like "EXPLORE FEATURE", small caps.
- **Do NOT use Manrope or Inter** — this project uses Geist exclusively.

### Layout & Spacing

- **Max widths:** Hero/sections: `max-w-5xl` (prose: `max-w-3xl`). Bento grid: `max-w-7xl`. Consistent with current site.
- **Section padding:** `py-32 px-6` for major sections (generous vertical rhythm).
- **Card padding:** `p-8` for feature cards.
- **Border radius:** `rounded-xl` for cards, `rounded-full` for pills/CTAs/nav bar, `rounded-2xl` for large containers.

### Component Patterns

**Navbar (fixed, floating pill):**
- Fixed at top with `pt-6 px-4`, glass-morphic pill: `bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl`
- Logo (Hisaabi icon SVG + "Hisaabi" text) on left
- Links center: Features, Pricing, Blog (desktop)
- CTA right: "Open app" with animated border glow using brand teal (conic-gradient spinner on hover)
- Top gradient blur overlay above nav for depth

**Hero section (full viewport height):**
- Centered, `min-h-screen`, large heading with gradient text fade
- Animated status pill at top: pulsing teal dot + announcement text
- Brand word highlighted in teal with decorative SVG underline curve
- Shiny CTA button: spinning conic-gradient border animation (teal instead of red), pill shape
- Secondary ghost CTA: `bg-zinc-900 border border-zinc-800 rounded-full`
- Staggered fade-up entrance animations

**Background effects:**
- Fixed parallax star particles (tiny white dots drifting upward)
- Large soft teal glow blob centered: `bg-teal-600/5 rounded-full blur-[120px]`
- Subtle grid overlay: `bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)]` with radial mask
- Dark gradient from teal-tinted top to pure black

**Provider/integration strip:**
- Full-width `border-y border-white/5 bg-white/[0.02]`, opacity 60% → 100% on hover
- "Works with:" label + provider logos: OpenAI, Anthropic, Gemini, Groq, Ollama

**Features bento grid (4-col asymmetric):**
- Main feature card: `col-span-2 row-span-2`, gradient background, larger heading, radial glow on hover
- Secondary cards: `col-span-2` or `col-span-1`, black bg, icon in tinted square
- Each card: icon in `bg-white/5 border border-white/10` box, distinct icon color per feature
- Hover: border brightens, radial glow appears from top-right corner, "EXPLORE FEATURE" label fades in
- Feature icon colors: teal (chat), blue (categorize), yellow (budgets), purple (reminders), emerald (privacy), orange (encryption), cyan (offline)

**Screenshot/mockup areas:**
- Placeholder areas for app screenshots with subtle border glow
- Screenshots should show: chat interface with a conversation, dashboard with charts, expense list, settings page
- Frame with rounded corners, thin teal border, slight shadow

**"Your data lives here" privacy banner:**
- Full-width teal background section (replaces the red testimonial banner)
- Black text on teal: shield icon, bold headline, proof points
- Three proof chips: "Works offline", "Open source", "Export anytime"

**Social proof / trust section:**
- Star rating display or key metrics
- Quote with attribution

**How it works (3-step):**
- Numbered circles with brand gradient
- Step cards with centered layout

**Security stories section:**
- Three linked blog cards with lock icons
- Hover: border shifts to teal accent

**FAQ accordion:**
- `rounded-2xl border border-white/10 bg-zinc-900/50`
- Expand/collapse with + icon rotation
- Summary bold, answer `text-zinc-400`

**Pricing (single plan, free forever):**
- Single centered card with teal accent border and glow shadow
- "$0" hero price, feature checklist with teal check icons
- CTA button with brand gradient

**Final CTA section:**
- Large heading with teal accent word
- Simple email capture or direct "Open Hisaabi" CTA
- `rounded-full` input + button

**Footer (cinematic):**
- Multi-column: brand + tagline, Platform links, Company links, Resources
- Link category headers in teal `text-xs font-bold uppercase tracking-widest`
- Giant watermark text: "HISAABI" in `text-[15vw]` with text-stroke effect, 20% opacity
- Bottom bar: copyright + social links

### Motion & Animation

- `fade-in-up`: elements enter from 20px below, 0.8s ease-out, staggered delays
- `border-spin`: CTA button conic-gradient rotation, 2.5s infinite
- `animStar`: parallax star drift, 50s/80s linear infinite
- Hover transitions: `transition-all` or `transition-colors` on interactive elements
- `prefers-reduced-motion`: disable all animations

### SEO Considerations (CRITICAL — do NOT sacrifice)

- All content must be in semantic HTML (h1, h2, h3, p, section, nav, footer, article)
- Single h1 per page, proper heading hierarchy
- All text must be real text (not images of text), crawlable
- CTA buttons are real links (`<a>` tags) to /app, /features, etc.
- FAQ section uses `<details>/<summary>` for native expand/collapse (Google-friendly)
- JSON-LD structured data preserved: SoftwareApplication + FAQPage on homepage
- Internal linking strategy maintained: every section cross-links to relevant pages
- Alt text on all images/icons
- Dark theme is cosmetic (CSS) — does NOT hide content from crawlers
- Navigation links must be real `<a>` tags, not JS-only buttons
- The privacy/trust sections are actual page content, not just visual flourish — Google values E-E-A-T signals

### Screenshots Needed

For the homepage hero area and feature sections, the following screenshots should be captured:

**Homepage:**
1. Chat interface — a conversation showing "spent 450 on groceries" being parsed and confirmed
2. Dashboard overview — monthly view with pie chart, bar chart, category breakdown

**Feature pages (each individual /features/[slug] page):**
1. `/features/chat-expense-tracking` — screenshot of chat with expense being logged
2. `/features/auto-categorization` — screenshot showing category assignment
3. `/features/budgets-and-goals` — screenshot of budget progress bars
4. `/features/privacy-and-security` — screenshot of "Your data lives here" badge + encryption status
5. `/features/offline-pwa` — screenshot of app installed as PWA on mobile
6. `/features/ai-insights` — screenshot of dashboard insights/trends
7. `/features/encryption` — screenshot of lock screen / vault gate
8. `/features/export-import` — screenshot of export/import settings panel

All screenshots should be taken at desktop viewport (1280px wide) with dark mode active, framed in a browser mockup or device frame with rounded corners and a subtle teal border glow.
