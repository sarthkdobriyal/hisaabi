# Extractable Components

Catalog of layout and basic components suitable for extraction into the
Superdesign canvas. **No full source here** — see `components.md` and
`layouts.md` for source code.

---

## Layout Components

### MarketingHeader
- **Source:** `src/components/marketing/MarketingHeader.tsx`
- **Category:** layout
- **Description:** Centered top nav bar with logo, three desktop-only text links (Features, Pricing, Blog), and an "Open app" CTA.
- **Extractable props:** none (static)
- **Hardcoded:** Logo image path `/hisaabi-icon.svg`, brand name "Hisaabi", link hrefs (`/features`, `/pricing`, `/blog`, `/app`)

### MarketingFooter
- **Source:** `src/components/marketing/MarketingFooter.tsx`
- **Category:** layout
- **Description:** Border-top footer with small logo mark, tagline, and a wrapped link set (Features, Pricing, About, Blog, Privacy, Terms, Open app).
- **Extractable props:** none (static)
- **Hardcoded:** Logo image, tagline text, all link hrefs

### AppHeader
- **Source:** `src/components/AppHeader.tsx`
- **Category:** layout
- **Description:** Sticky app header with logo, four-item nav (Chat, Dashboard, Expenses, Settings), vault lock/unlock controls, mobile hamburger with slide-down menu, PWA install action.
- **Extractable props:** none (reads vault status and PWA install state internally)
- **Hardcoded:** Logo image, NAV array with four routes, menu/close SVG icons, "Encryption off" warning badge

---

## Page-Level Template Components

### FeaturePage
- **Source:** `src/components/marketing/FeaturePage.tsx`
- **Category:** layout
- **Description:** Reusable individual feature detail page — breadcrumb, "Feature" pill, h1, tagline, CTA, content sections, FAQ accordion, related features grid, bottom CTA card.
- **Extractable props:** `feature: Feature` (name, slug, tagline, description, sections, faqs)
- **Hardcoded:** "Feature" badge text, "Try it free" / "Start tracking free" CTA labels, JSON-LD schema structure, related-feature links, bottom "Private, local and free" card copy

### VsPage
- **Source:** `src/components/marketing/VsPage.tsx`
- **Category:** layout
- **Description:** Competitor comparison template — hero with competitor pill, comparison table (Hisaabi vs competitor), "why switch" point cards, FAQ accordion, bottom CTA.
- **Extractable props:** `competitor`, `heroTitle`, `heroBody`, `table: TableRow[]`, `switchTitle`, `switchPoints`, `faqs`, `conclusion`, `path`
- **Hardcoded:** "Try Hisaabi free" / "Open Hisaabi" CTA labels, breadcrumb structure, JSON-LD schemas, disclaimer note, footer link set

### GuidePage
- **Source:** `src/components/marketing/GuidePage.tsx`
- **Category:** layout
- **Description:** Long-form guide template — breadcrumb, eyebrow pill, h1, description, updated date, table-of-contents sidebar, article sections with optional bullet lists, "Keep reading" related cards, bottom CTA card.
- **Extractable props:** `eyebrow`, `title`, `description`, `updated`, `sections`, `related`, `cta: { title, body }`, `path`
- **Hardcoded:** Breadcrumb "Home / Guides / {title}", JSON-LD Article schema, author name "Sarthak Dobriyal", footer link set, slug helper function

---

## Basic Components

### BlogCard
- **Source:** `src/components/blog/BlogCard.tsx`
- **Category:** basic
- **Description:** Blog post card with cover image (or placeholder), category accent color, title, excerpt, author initials avatar, read time. Supports a `quote` variant (large blockquote style, no image).
- **Extractable props:** `post: BlogPost` (slug, title, excerpt, author, date, readTime, cover, category, quote flag, image size)
- **Hardcoded:** ACCENT color map (AI=teal, Privacy=emerald, Money=amber, Product=indigo, OpenSource=pink), HEIGHT map (short/medium/tall), `initials()` helper

### BlogGrid
- **Source:** `src/components/blog/BlogGrid.tsx`
- **Category:** basic
- **Description:** Filterable masonry grid of `BlogCard` with category tabs and a "Load more" button.
- **Extractable props:** `posts: BlogPost[]`
- **Hardcoded:** INITIAL=6, STEP=3 pagination, CATEGORIES from `@/lib/blog`

### Composer
- **Source:** `src/components/chat/Composer.tsx`
- **Category:** basic
- **Description:** Sticky chat input bar — auto-sizing `Textarea` + brand-gradient send `Button` with `ArrowUp` icon.
- **Extractable props:** `value`, `onChange`, `onSend`, `disabled`
- **Hardcoded:** Placeholder "spent 200 on coffee...", hint text "Enter to send / Shift+Enter for a new line"

### MessageBubble
- **Source:** `src/components/chat/MessageBubble.tsx`
- **Category:** basic
- **Description:** Chat message bubble with user (brand-gradient, right-aligned) or assistant (card bg, left-aligned) styling, avatar circle, and timestamp.
- **Extractable props:** `role`, `content`, `createdAt`
- **Hardcoded:** Avatar icons (Bot, User from lucide), time formatting

### TypingIndicator
- **Source:** `src/components/chat/MessageBubble.tsx` (co-exported)
- **Category:** basic
- **Description:** Three pulsing dots in an assistant-styled bubble, used while waiting for AI response.
- **Extractable props:** none
- **Hardcoded:** 3 dots with staggered `animationDelay`

### ConfirmCard
- **Source:** `src/components/chat/ConfirmCard.tsx`
- **Category:** basic
- **Description:** Inline confirmation card for expense/income additions — green brand accent, check icon, amount/category/date summary, undo button.
- **Extractable props:** `card: ConfirmCardData`, `onUndo`
- **Hardcoded:** Labels "Expense added" / "Income added", undo logic

### EmptyState
- **Source:** `src/components/chat/EmptyState.tsx`
- **Category:** basic
- **Description:** Chat empty state — centered icon, heading, subtitle, and quick-prompt pill buttons.
- **Extractable props:** `onPick: (text) => void`
- **Hardcoded:** PROMPTS array ("Spent 500 on groceries", etc.), icon (MessageSquareText), heading/subtitle text

### DataResidencyBadge
- **Source:** `src/components/DataResidencyBadge.tsx`
- **Category:** basic
- **Description:** Small inline badge showing "Your data lives here" with live IndexedDB record counts.
- **Extractable props:** none (reads DB directly)
- **Hardcoded:** Badge text, db table names queried

### Button (shadcn/ui)
- **Source:** `src/components/ui/button.tsx`
- **Category:** basic
- **Description:** CVA-powered button primitive with 6 variants and 8 sizes.
- **Extractable props:** `variant`, `size`, `asChild`, plus native button props
- **Hardcoded:** Tailwind class strings for each variant/size

### Card (shadcn/ui)
- **Source:** `src/components/ui/card.tsx`
- **Category:** basic
- **Description:** Composable card surface with header, content, footer, title, description, and action slots.
- **Extractable props:** `size` ("default" | "sm"), plus native div props
- **Hardcoded:** `--card-spacing` variable, ring border style
