import type { Metadata } from "next";
import { VsPage } from "@/components/marketing/VsPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/vs/excel-expense-tracker",
  title: "Excel Expense Tracker Alternative",
  description:
    "Lose the spreadsheet. Hisaabi is an AI expense tracker that logs your spending from chat, categorizes it, and answers questions — no formulas, no formatting, no manual columns.",
});

const TABLE = [
  { feature: "Entry method", hisaabi: "Chat, in plain language", them: "Manual rows & formulas" },
  { feature: "Auto-categorization", hisaabi: "Yes, by AI", them: "No — manual or macros" },
  { feature: "Budget alerts", hisaabi: "Automatic", them: "You write the formulas" },
  { feature: "Spending questions", hisaabi: "Ask in chat", them: "Build pivot tables" },
  { feature: "Price", hisaabi: "$0, forever", them: "Office license or free plan" },
  { feature: "Data storage", hisaabi: "Your browser only", them: "Local file or cloud" },
  { feature: "Offline", hisaabi: "Full PWA", them: "Depends on your setup" },
];

const SWITCH = [
  {
    title: "No more blank columns",
    body: "You stop at every row of a spreadsheet: date, category, amount, note. Chat entry collapses all of that into one sentence.",
  },
  {
    title: "The spreadsheet never asks why",
    body: "A workbook records what you spent. Hisaabi tells you what it means — category trends, budget overruns, and answers to questions like “where did my money go this month?”",
  },
  {
    title: "Skip the formula work",
    body: "The averages, totals, and category sums a good spreadsheet needs — built by hand, once, carefully. Hisaabi computes them live from your data.",
  },
  {
    title: "Works on your phone",
    body: "A spreadsheet on mobile is a chore. Hisaabi is an installable PWA — logging a coffee while you’re standing at the counter takes one sentence.",
  },
];

const FAQS = [
  {
    q: "Can I export my data?",
    a: "Yes — Hisaabi has a JSON export in Settings, and you can always move that into a spreadsheet if you want the workbook back.",
  },
  {
    q: "I like formulas. Will I be bored?",
    a: "Possibly. Hisaabi is deliberately simpler than a spreadsheet — that’s the point. If you need custom analysis beyond the dashboard, export and continue in Excel.",
  },
  {
    q: "Does it work without an internet connection?",
    a: "Yes. Logging and reviewing work offline. AI chat needs a connection to your provider unless you run local Ollama.",
  },
];

export default function ExcelAlternativePage() {
  return (
    <VsPage
      competitor="Excel"
      heroTitle="An Excel expense tracker you never have to maintain"
      heroBody="Spreadsheets are flexible and painful in equal measure. Hisaabi is an AI expense tracker that logs your spending from chat and answers questions — no formulas, no formatting, no columns to keep tidy."
      table={TABLE}
      switchTitle="Why move off the spreadsheet"
      switchPoints={SWITCH}
      faqs={FAQS}
      conclusion="Keep the spreadsheet for analysis. Log the expenses somewhere human."
      path="/vs/excel-expense-tracker"
    />
  );
}
