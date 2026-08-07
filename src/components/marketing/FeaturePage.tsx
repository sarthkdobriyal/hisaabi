import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { TealNoirBackground } from "@/components/marketing/TealNoirBackground";
import { relatedFeatures, type Feature } from "@/lib/features";
import { SITE } from "@/lib/seo";

export function FeaturePage({ feature }: { feature: Feature }) {
  const related = relatedFeatures(feature);
  const path = `/features/${feature.slug}`;
  const url = `${SITE}${path}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Features", item: `${SITE}/features` },
        { "@type": "ListItem", position: 3, name: feature.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: feature.name,
      description: feature.description,
      url,
      mainEntity: {
        "@type": "FAQPage",
        mainEntity: feature.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <TealNoirBackground />
      <MarketingHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-6 py-14">
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Link href="/" className="transition hover:text-teal-400">Home</Link>
          <span>/</span>
          <Link href="/features" className="transition hover:text-teal-400">Features</Link>
          <span>/</span>
          <span className="text-white">{feature.name}</span>
        </nav>

        <div className="mt-6 w-fit rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-400">
          Feature
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">{feature.name}</h1>
        <p className="mt-5 text-lg text-zinc-400">{feature.tagline}</p>
        <Link
          href="/app"
          className="brand-gradient mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3 font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          Try it free
          <ArrowRight className="size-4" />
        </Link>

        <article className="mt-12">
          {feature.sections.map((s) => (
            <section key={s.h}>
              <h2 className="mt-12 text-2xl font-bold tracking-tight text-white first:mt-0">{s.h}</h2>
              {s.p.map((para, i) => (
                <p key={i} className="mt-4 leading-relaxed text-zinc-400">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </article>

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-white">Frequently asked questions</h2>
          <div className="mt-8 flex flex-col gap-3">
            {feature.faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-5 shadow-sm [&_svg]:open:rotate-45"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-white">
                  {f.q}
                  <span className="text-xl leading-none text-zinc-500 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-zinc-400">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-white">Related features</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/features/${r.slug}`}
                  className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-5 shadow-sm transition hover:border-teal-500/40"
                >
                  <h3 className="font-semibold text-white group-hover:text-teal-400">{r.name}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{r.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 rounded-3xl border border-teal-500/30 bg-zinc-900/50 p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white">Private, local and free</h2>
          <p className="mx-auto mt-2 max-w-md text-zinc-400">
            Every feature works the same way: data stays in your browser. No account, no cloud,
            nothing to leak.
          </p>
          <Link
            href="/app"
            className="brand-gradient mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Check className="size-4" />
            Start tracking free
          </Link>
          <p className="mt-4 text-sm text-zinc-400">
            Read about{" "}
            <Link href="/blog/why-hisaabi-keeps-your-data-local" className="text-teal-400 hover:underline">
              why local-first
            </Link>
            , see all{" "}
            <Link href="/features" className="text-teal-400 hover:underline">features</Link>, or read the{" "}
            <Link href="/guides/private-expense-tracking" className="text-teal-400 hover:underline">
              privacy guide
            </Link>
            .
          </p>
        </section>
      </main>
      <div className="relative z-10">
        <MarketingFooter />
      </div>
    </div>
  );
}
