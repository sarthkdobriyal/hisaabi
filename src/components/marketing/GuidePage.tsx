import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";

type Section = { h: string; body: string[]; list?: string[] };
type Related = { title: string; href: string; body: string };

export function GuidePage({
  eyebrow,
  title,
  description,
  updated,
  sections,
  related,
  cta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  sections: Section[];
  related: Related[];
  cta: { title: string; body: string };
}) {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14">
        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          {eyebrow}
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{description}</p>
        <p className="mt-3 text-xs text-muted-foreground">Updated {updated}</p>

        <div className="mt-12 flex flex-col gap-2 border-l-2 border-brand/40 pl-4">
          {sections.map((s) => (
            <a key={s.h} href={`#${slug(s.h)}`} className="text-sm text-muted-foreground transition hover:text-brand">
              {s.h}
            </a>
          ))}
        </div>

        <article className="mt-12">
          {sections.map((s) => (
            <section key={s.h} id={slug(s.h)} className="scroll-mt-8">
              <h2 className="mt-12 text-2xl font-bold tracking-tight first:mt-0">{s.h}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-4 leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="mt-4 flex list-disc flex-col gap-2 pl-6 text-muted-foreground">
                  {s.list.map((li) => (
                    <li key={li} className="leading-relaxed">{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Keep reading</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-brand/40"
              >
                <h3 className="font-semibold group-hover:text-brand">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-brand/30 bg-brand/5 p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight">{cta.title}</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">{cta.body}</p>
          <Link
            href="/app"
            className="brand-gradient mt-6 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Open Hisaabi
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
