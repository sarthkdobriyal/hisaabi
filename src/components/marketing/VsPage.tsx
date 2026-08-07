import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { SITE } from "@/lib/seo";

type TableRow = { feature: string; hisaabi: string; them: string };
type Faq = { q: string; a: string };

export function VsPage({
  competitor,
  heroTitle,
  heroBody,
  table,
  switchTitle,
  switchPoints,
  faqs,
  conclusion,
  path,
}: {
  competitor: string;
  heroTitle: string;
  heroBody: string;
  table: TableRow[];
  switchTitle: string;
  switchPoints: { title: string; body: string }[];
  faqs: Faq[];
  conclusion: string;
  path: string;
}) {
  const url = `${SITE}${path}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Alternatives", item: `${SITE}/features` },
        { "@type": "ListItem", position: 3, name: heroTitle, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <MarketingHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-6 pb-8 pt-14 text-center sm:pt-20">
          <nav className="mb-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="transition hover:text-brand">Home</Link>
            <span>/</span>
            <Link href="/features" className="transition hover:text-brand">Features</Link>
            <span>/</span>
            <span className="text-foreground">{competitor} alternative</span>
          </nav>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {competitor} alternative
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">{heroTitle}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{heroBody}</p>
          <Link
            href="/app"
            className="brand-gradient mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Try Hisaabi free
            <ArrowRight className="size-4" />
          </Link>
        </section>

        <section className="mx-auto w-full max-w-4xl px-6 py-10">
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                  <th className="px-4 py-3 font-medium"> </th>
                  <th className="px-4 py-3 font-semibold text-foreground">Hisaabi</th>
                  <th className="px-4 py-3 font-medium">{competitor}</th>
                </tr>
              </thead>
              <tbody>
                {table.map((row) => (
                  <tr key={row.feature} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{row.feature}</td>
                    <td className="px-4 py-3 text-brand">
                      {row.hisaabi === "Yes" ? <Check className="inline size-4" /> : row.hisaabi}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Note: Hisaabi tracks your own spending. It doesn&apos;t split shared bills — for that,
            pair it with the tool designed for it.
          </p>
        </section>

        <section className="mx-auto w-full max-w-4xl px-6 py-10">
          <h2 className="text-3xl font-bold tracking-tight">{switchTitle}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {switchPoints.map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl px-6 py-10">
          <h2 className="text-3xl font-bold tracking-tight">Common questions</h2>
          <div className="mt-8 flex flex-col gap-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-border bg-card p-5 shadow-sm [&_svg]:open:rotate-45"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.q}
                  <span className="text-xl leading-none text-muted-foreground transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl px-6 py-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">{conclusion}</h2>
          <Link
            href="/app"
            className="brand-gradient mt-8 inline-block rounded-xl px-8 py-3.5 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Open Hisaabi
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            No account. Read the{" "}
            <Link href="/privacy" className="text-brand hover:underline">privacy policy</Link>.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <Link href="/features" className="font-medium text-brand hover:underline">Explore features</Link>
            <Link href="/blog" className="font-medium text-brand hover:underline">Read the blog</Link>
            <Link href="/" className="font-medium text-brand hover:underline">Back to homepage</Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
