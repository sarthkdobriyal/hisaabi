# Page Dependency Trees

Local component imports only (node_modules skipped). Indented tree format.
`@/lib/*` entries are included where they supply data or types consumed by
the component tree.

---

## `/` (Home)

```
src/app/page.tsx  (Home)
├── src/components/marketing/MarketingHeader.tsx
│   └── next/image, next/link
├── src/components/marketing/MarketingFooter.tsx
│   └── next/image, next/link
└── lucide-react (MessageSquareText, Tags, Target, CalendarClock, ShieldCheck, WifiOff, LockKeyhole)
```

---

## `/features`

```
src/app/features/page.tsx  (FeaturesPage)
├── src/components/marketing/MarketingHeader.tsx
│   └── next/image, next/link
├── src/components/marketing/MarketingFooter.tsx
│   └── next/image, next/link
├── @/lib/seo  (pageMetadata)
├── @/lib/features  (FEATURES)
└── lucide-react (MessageSquareText, Tags, Target, CalendarClock, ShieldCheck, WifiOff, Search, Wallet, Smartphone, LockKeyhole, Download, Sparkles, ArrowRight)
```

---

## `/features/[slug]`

```
src/app/features/[slug]/page.tsx  (FeatureRoutePage)
├── src/components/marketing/FeaturePage.tsx
│   ├── src/components/marketing/MarketingHeader.tsx
│   │   └── next/image, next/link
│   ├── src/components/marketing/MarketingFooter.tsx
│   │   └── next/image, next/link
│   ├── @/lib/features  (relatedFeatures, Feature)
│   ├── @/lib/seo  (SITE)
│   └── lucide-react (ArrowRight, Check)
└── @/lib/features  (FEATURES, featureMetadata, getFeature)
```

---

## `/pricing`

```
src/app/pricing/page.tsx  (PricingPage)
├── src/components/marketing/MarketingHeader.tsx
│   └── next/image, next/link
├── src/components/marketing/MarketingFooter.tsx
│   └── next/image, next/link
├── @/lib/seo  (pageMetadata)
└── lucide-react (Check, X)
```

---

## `/blog`

```
src/app/blog/page.tsx  (BlogPage)
├── src/components/blog/BlogGrid.tsx  ("use client")
│   ├── src/components/blog/BlogCard.tsx
│   │   ├── @/lib/blog  (BlogPost, Category)
│   │   └── lucide-react (FileText, Quote)
│   ├── @/lib/blog  (CATEGORIES, BlogPost)
│   └── lucide-react (ChevronDown)
├── src/components/marketing/MarketingHeader.tsx
│   └── next/image, next/link
├── src/components/marketing/MarketingFooter.tsx
│   └── next/image, next/link
├── @/lib/posts  (BLOG_POSTS, readAllPosts)
└── @/lib/seo  (pageMetadata, SITE)
```

---

## `/blog/[slug]`

```
src/app/blog/[slug]/page.tsx  (BlogPostPage)
├── src/components/marketing/MarketingHeader.tsx
│   └── next/image, next/link
├── src/components/marketing/MarketingFooter.tsx
│   └── next/image, next/link
├── src/components/blog/BlogCard.tsx
│   ├── @/lib/blog  (BlogPost, Category)
│   └── lucide-react (FileText, Quote)
├── @/lib/blog  (categoryOf, formatDate, BlogPost)
├── @/lib/posts  (BLOG_POSTS, getPost, readAllPosts, PostMeta)
├── @/lib/seo  (pageMetadata, SITE)
└── react-markdown, remark-gfm
```

---

## `/app` (Chat)

```
src/app/app/page.tsx  (ChatPage, "use client")
├── src/components/DataResidencyBadge.tsx  ("use client")
│   └── @/lib/db
├── src/components/SetupScreen.tsx  ("use client")
│   ├── src/components/DataResidencyBadge.tsx
│   ├── @/lib/db
│   ├── @/lib/providers
│   └── @/lib/store
├── src/components/RecurringBillDue.tsx
├── src/components/SalaryDue.tsx
├── src/components/chat/MessageBubble.tsx  ("use client")
│   └── lucide-react (Bot, User)
├── src/components/chat/Composer.tsx  ("use client")
│   ├── src/components/ui/button.tsx
│   ├── src/components/ui/textarea.tsx
│   └── lucide-react (ArrowUp)
├── src/components/chat/EmptyState.tsx  ("use client")
│   └── lucide-react (MessageSquareText)
├── src/components/chat/ConfirmCard.tsx  ("use client")
│   ├── src/components/ui/button.tsx
│   ├── @/lib/chat  (ToolOutcome)
│   └── lucide-react (CheckCircle2)
├── src/components/ui/alert.tsx  (Alert, AlertTitle, AlertDescription)
├── src/components/ui/button.tsx  (Button)
├── src/components/ui/skeleton.tsx  (Skeleton)
├── @/lib/db
├── @/lib/tools  (runTool)
├── @/lib/chat  (runChatTurn)
├── @/lib/store  (readProfile, readSettings, saveSettings)
├── @/lib/recurring  (dueBills, salaryDue)
├── @/lib/providers  (PROVIDERS, providerMeta)
└── lucide-react (ChevronDown, TriangleAlert)
```

---

## `/app/dashboard`

```
src/app/app/dashboard/page.tsx  (DashboardPage, "use client")
├── src/components/charts/DashboardCharts.tsx  (dynamic import, SSR: false)
├── src/components/DataResidencyBadge.tsx  ("use client")
│   └── @/lib/db
├── src/components/ui/button.tsx  (Button)
├── src/components/ui/skeleton.tsx  (Skeleton)
├── @/lib/db  (Expense, Income)
├── @/lib/analytics  (currentMonthKey, nextMonth, prevMonth, summarize)
├── @/lib/store  (readProfile, saveProfile)
├── @/lib/recurring  (dueBills, salaryDue, monthKey)
├── @/lib/format  (currencyFmt)
└── lucide-react (ChevronLeft, ChevronRight)
```

---

## `/vs/*` (all competitor pages share the same tree)

```
src/app/vs/{slug}/page.tsx
├── src/components/marketing/VsPage.tsx
│   ├── src/components/marketing/MarketingHeader.tsx
│   │   └── next/image, next/link
│   ├── src/components/marketing/MarketingFooter.tsx
│   │   └── next/image, next/link
│   ├── @/lib/seo  (SITE)
│   └── lucide-react (ArrowRight, Check)
└── @/lib/seo  (pageMetadata)
```

---

## `/guides/*` (all guide pages share the same tree)

```
src/app/guides/{slug}/page.tsx
├── src/components/marketing/GuidePage.tsx
│   ├── src/components/marketing/MarketingHeader.tsx
│   │   └── next/image, next/link
│   ├── src/components/marketing/MarketingFooter.tsx
│   │   └── next/image, next/link
│   ├── @/lib/seo  (SITE)
│   └── lucide-react (ArrowRight)
└── @/lib/seo  (pageMetadata)
```
