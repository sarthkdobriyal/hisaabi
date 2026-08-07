import type { Metadata } from "next";
import { VsPage } from "@/components/marketing/VsPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/vs/notion-expense-tracker",
  title: "Notion Expense Tracker Template Alternative",
  description:
    "Your Notion budget template has to be built, formatted, and maintained by hand. Hisaabi is an AI expense tracker that parses your expenses from chat — no templates, no formulas.",
});

const TABLE = [
  { feature: "Setup", hisaabi: "None — works out of the box", them: "Build or find a template" },
  { feature: "Entry method", hisaabi: "Chat, in plain language", them: "Manual rows & properties" },
  { feature: "Auto-categorization", hisaabi: "Yes, by AI", them: "No" },
  { feature: "Price", hisaabi: "$0, forever", them: "Free plan + paid upgrade" },
  { feature: "Data storage", hisaabi: "Your browser only", them: "Notion’s cloud" },
  { feature: "Offline", hisaabi: "Full PWA", them: "Limited" },
  { feature: "Spending insights", hisaabi: "Automatic", them: "You build the views" },
];

const SWITCH = [
  {
    title: "Stop maintaining the template",
    body: "Notion budgets are a project: create the database, wire the relations, keep the formulas alive. Hisaabi does the parsing and categorizing so the structure isn’t your job.",
  },
  {
    title: "Text in, expense out",
    body: "“Spent 250 on groceries” becomes a categorized row instantly. In Notion you’d open the database, hit new, and fill four fields.",
  },
  {
    title: "Answers without formulas",
    body: "Ask “how much on food this month?” and get a real total. No rollups, no filters, no views to build.",
  },
  {
    title: "Your finances aren’t a workspace",
    body: "Notion is a shared cloud workspace; a budget is personal. Hisaabi keeps your spending on your device, with no account and no cloud.",
  },
];

const FAQS = [
  {
    q: "Can I use both?",
    a: "Yes — many people keep their life in Notion and track money separately. Hisaabi complements it rather than replacing the rest of your workspace.",
  },
  {
    q: "I have a budget in Notion already. Will it migrate?",
    a: "There’s no automatic import. If your Notion setup works and you just want faster entry, try chat for new expenses and keep your historical view.",
  },
  {
    q: "Does Hisaabi have tags, relations, and custom views?",
    a: "It has categories, notes, budgets, and an insights dashboard — but intentionally less configurability. You give up template flexibility to never maintain a template again.",
  },
];

export default function NotionAlternativePage() {
  return (
    <VsPage
      competitor="Notion"
      heroTitle="A Notion expense tracker you never have to build"
      heroBody="Notion budget templates are powerful — and a part-time job to maintain. Hisaabi is an AI expense tracker that parses your spending from chat, so the structure takes care of itself."
      table={TABLE}
      switchTitle="Why ditch the DIY budget template"
      switchPoints={SWITCH}
      faqs={FAQS}
      conclusion="Use Notion for your life. Track your money elsewhere."
      path="/vs/notion-expense-tracker"
    />
  );
}
