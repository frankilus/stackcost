import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { NewsletterForm } from "@/components/NewsletterForm";
import { COMPARE_WEEKLIES, computeCost, formatPct, formatUsd } from "@/lib/calc";
import { SITE_URL } from "@/lib/compares";
import { costPages, getCostPage, HUB_SLUG } from "@/lib/costPages";
import { LAST_UPDATED, platforms } from "@/lib/platforms";

export const dynamicParams = false;

export function generateStaticParams() {
  return costPages.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getCostPage(slug);
  if (!page) return { title: "Costs — StackCost" };
  const description = `${page.intro.slice(0, 150)}… Last verified ${LAST_UPDATED}.`;
  return {
    title: `${page.title} | StackCost`,
    description,
    alternates: { canonical: `${SITE_URL}/costs/${page.slug}` },
    openGraph: { title: page.title, description, url: `${SITE_URL}/costs/${page.slug}`, type: "article" },
  };
}

export default async function CostPageView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getCostPage(slug);
  if (!page) notFound();
  const p = platforms.find((x) => x.id === page.platformId);
  if (!p) notFound();

  const rows = COMPARE_WEEKLIES.map((w) => ({ w, c: computeCost(p, w) }));
  const ranked = platforms
    .map((x) => ({ x, c: computeCost(x, 100) }))
    .sort((a, b) => a.c.allInCostUsd - b.c.allInCostUsd);
  const rank = ranked.findIndex((r) => r.x.id === p.id) + 1;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.h1,
      dateModified: LAST_UPDATED,
      datePublished: LAST_UPDATED,
      url: `${SITE_URL}/costs/${page.slug}`,
      publisher: { "@type": "Organization", name: "StackCost" },
    },
  ];

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-zinc-500">
        <Link href="/" className="text-amber-400 hover:underline">StackCost</Link>
        <span className="mx-2">/</span>
        <Link href={`/costs/${HUB_SLUG}`} className="hover:text-zinc-300">Costs</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-400">{p.name}</span>
      </nav>

      <header className="mt-6">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-500/90">True cost · Updated {LAST_UPDATED}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">{page.h1}</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-300">{page.intro}</p>
      </header>

      <div className="mt-6"><AffiliateDisclosure /></div>

      <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-lg text-zinc-200">
          At <strong className="text-zinc-50">$100/week for 1 year</strong>, {p.name} costs about{" "}
          <strong className="text-amber-400">{formatUsd(rows[1].c.allInCostUsd)}</strong> all-in (
          {formatPct(rows[1].c.allInPct)} of {formatUsd(rows[1].c.totalInvested)}) — #{rank} of {ranked.length} US
          platforms we track.
        </p>
        <p className="mt-2 text-sm text-zinc-500">Modeled path: {p.pathModeled}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-zinc-50">All-in cost model</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Buy fees + {p.spreadConfidence === "estimate" ? "estimated" : "documented"} spread + modeled custody, 52 weekly buys.
          Network miner fees excluded. <Link href="/methodology" className="text-amber-400 hover:underline">Methodology</Link>.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-4 py-3">Weekly</th><th className="px-4 py-3">Buy fees</th><th className="px-4 py-3">Spread</th>
                <th className="px-4 py-3">Custody</th><th className="px-4 py-3">All-in</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ w, c }) => (
                <tr key={w} className="border-b border-zinc-800/80 last:border-0 tabular-nums text-zinc-200">
                  <td className="px-4 py-3">${w}/wk</td>
                  <td className="px-4 py-3">{formatUsd(c.buyFeesPaid)}</td>
                  <td className="px-4 py-3">{formatUsd(c.spreadPaid)}</td>
                  <td className="px-4 py-3">{formatUsd(c.custodyPaid)}</td>
                  <td className="px-4 py-3 text-amber-400">{formatUsd(c.allInCostUsd)} <span className="text-xs text-zinc-500">({formatPct(c.allInPct)})</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-zinc-50">Hidden costs to watch</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
            {page.gotchas.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-zinc-50">Cheaper path on {p.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">{page.cheaperPath}</p>
          <ul className="mt-4 space-y-1 text-sm text-zinc-400">
            <li><strong className="text-zinc-300">Funding:</strong> {p.fundingNotes}</li>
            <li><strong className="text-zinc-300">Withdrawals:</strong> {p.withdrawalBtc}</li>
            <li><strong className="text-zinc-300">Custody:</strong> {p.custodyNotes}</li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-zinc-50">FAQ</h2>
        <dl className="mt-4 space-y-5">
          {page.faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-medium text-zinc-100">{f.q}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-zinc-400">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
        <h2 className="font-medium text-zinc-100">Sources</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {p.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">{s.label}</a>
              <span className="text-xs text-zinc-600"> · accessed {s.accessed}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">{p.notes}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-50">How {p.name} compares</h2>
        <p className="mt-2 text-sm text-zinc-400">
          See the full ranking: <Link href={`/costs/${HUB_SLUG}`} className="text-amber-400 hover:underline">Cheapest Bitcoin DCA in the US (2026)</Link>
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {costPages.filter((c) => c.slug !== page.slug).map((c) => {
            const name = platforms.find((x) => x.id === c.platformId)?.name;
            return (
              <li key={c.slug}>
                <Link href={`/costs/${c.slug}`} className="inline-block rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-300 hover:border-amber-500/40 hover:text-amber-400">{name} true cost</Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="alerts" className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-zinc-50">Get alerted when {p.name} changes fees</h2>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">Occasional email when fees, spreads, or promos move these numbers. Unsubscribe anytime.</p>
        <div className="relative mt-5 max-w-lg"><NewsletterForm /></div>
      </section>

      <div className="mt-10"><AffiliateDisclosure compact /></div>
    </article>
  );
}
