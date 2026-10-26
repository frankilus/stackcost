import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { NewsletterForm } from "@/components/NewsletterForm";
import { computeCost, formatPct, formatUsd } from "@/lib/calc";
import { SITE_URL } from "@/lib/compares";
import { costPages, HUB_SLUG } from "@/lib/costPages";
import { DCA_AMOUNTS, dcaSlug, parseDcaSlug } from "@/lib/dcaAmounts";
import { LAST_UPDATED, platforms } from "@/lib/platforms";

export const dynamicParams = false;

export function generateStaticParams() {
  return DCA_AMOUNTS.map((a) => ({ amount: dcaSlug(a) }));
}

function usd0(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function rank(amount: number) {
  return platforms
    .map((p) => ({ p, c: computeCost(p, amount), page: costPages.find((c) => c.platformId === p.id) }))
    .sort((a, b) => a.c.allInCostUsd - b.c.allInCostUsd);
}

export async function generateMetadata({ params }: { params: Promise<{ amount: string }> }): Promise<Metadata> {
  const { amount: slug } = await params;
  const amount = parseDcaSlug(slug);
  if (!amount) return { title: "StackCost" };
  const r = rank(amount);
  const title = `Cheapest Way to DCA ${usd0(amount)} a Week Into Bitcoin (2026)`;
  const description = `${usd0(amount)}/week into Bitcoin for a year: ${r[0].p.name} costs ${formatUsd(r[0].c.allInCostUsd)} all-in vs ${formatUsd(r[r.length - 1].c.allInCostUsd)} on ${r[r.length - 1].p.name}. ${platforms.length} US platforms ranked by fees + spread. Updated ${LAST_UPDATED}.`;
  const url = `${SITE_URL}/costs/dca/${slug}`;
  return {
    title: `${title} | StackCost`,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
  };
}

export default async function DcaAmountPage({ params }: { params: Promise<{ amount: string }> }) {
  const { amount: slug } = await params;
  const amount = parseDcaSlug(slug);
  if (!amount) notFound();
  const ranked = rank(amount);
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];
  const yearly = amount * 52;
  const gap = worst.c.allInCostUsd - best.c.allInCostUsd;

  const faqs = [
    {
      q: `What is the cheapest way to buy ${usd0(amount)} of Bitcoin every week?`,
      a: `On the recurring-buy paths we model, ${ranked.slice(0, 3).map((r) => `${r.p.name} (${formatUsd(r.c.allInCostUsd)}/yr, ${formatPct(r.c.allInPct)})`).join(", ")} are the lowest all-in cost for ${usd0(amount)}/week over 52 weeks. Verify current fees in-app before buying.`,
    },
    {
      q: `How much do fees cost on ${usd0(amount)} a week of Bitcoin over a year?`,
      a: `You invest ${usd0(yearly)} a year. All-in costs (buy fees, spread, custody) range from ${formatUsd(best.c.allInCostUsd)} on ${best.p.name} to ${formatUsd(worst.c.allInCostUsd)} on ${worst.p.name} — a ${formatUsd(gap)} difference for the same Bitcoin.`,
    },
    {
      q: "Does the weekly amount change which platform is cheapest?",
      a: "Mostly the percentages stay the same, but some platforms change with size: Strike and River charge their standard fee on the first recurring buy, and PayPal's fee tier depends on the order amount (2.20% under $75 down to 1.50% above $1,000). Compare the other weekly amounts below.",
    },
  ];

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Cheapest way to DCA ${usd0(amount)} a week into Bitcoin`,
      itemListElement: ranked.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: r.p.name, url: r.page ? `${SITE_URL}/costs/${r.page.slug}` : r.p.website })),
    },
  ];

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-zinc-500">
        <Link href="/" className="text-amber-400 hover:underline">StackCost</Link>
        <span className="mx-2">/</span>
        <Link href={`/costs/${HUB_SLUG}`} className="hover:text-zinc-300">Costs</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-400">{usd0(amount)} a week</span>
      </nav>
      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-500/90">DCA by amount · Updated {LAST_UPDATED}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">The cheapest way to DCA {usd0(amount)} a week into Bitcoin</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-300">
          Buying {usd0(amount)} of Bitcoin every week puts {usd0(yearly)} to work over a year. On the recurring-buy paths we model,{" "}
          <strong className="text-amber-400">{best.p.name}</strong> costs {formatUsd(best.c.allInCostUsd)} all-in, while {worst.p.name} costs{" "}
          {formatUsd(worst.c.allInCostUsd)}. That is {formatUsd(gap)} a year for the same Bitcoin.
        </p>
      </header>
      <div className="mt-6"><AffiliateDisclosure /></div>

      <section className="mt-10 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Buy fees / yr</th>
              <th className="px-4 py-3">Spread / yr</th>
              <th className="px-4 py-3">All-in / yr</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r, i) => (
              <tr key={r.p.id} className="border-b border-zinc-800/80 last:border-0 text-zinc-200">
                <td className="px-4 py-3 text-zinc-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{r.p.name}<div className="text-xs font-normal text-zinc-500">{r.p.pathModeled}</div></td>
                <td className="px-4 py-3 tabular-nums">{formatUsd(r.c.buyFeesPaid)}</td>
                <td className="px-4 py-3 tabular-nums">{formatUsd(r.c.spreadPaid)}{r.p.spreadConfidence === "estimate" && r.p.spreadEstimatePct > 0 ? <div className="text-xs text-zinc-500">estimate</div> : null}</td>
                <td className="px-4 py-3 tabular-nums">{formatUsd(r.c.allInCostUsd)}<div className="text-xs text-zinc-500">{formatPct(r.c.allInPct)}</div></td>
                <td className="px-4 py-3">{r.page ? <Link href={`/costs/${r.page.slug}`} className="text-amber-400 hover:underline">True cost →</Link> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <p className="mt-3 text-xs text-zinc-500">
        52 weekly buys of {usd0(amount)}. Custody fees are included where our modeled path pays them. Withdrawal and miner fees are excluded; see{" "}
        <Link href="/costs/bitcoin-withdrawal-fees" className="text-amber-400 hover:underline">Bitcoin withdrawal fees</Link>.{" "}
        <Link href="/methodology" className="text-amber-400 hover:underline">Methodology</Link>
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-zinc-50">Other weekly amounts</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {DCA_AMOUNTS.map((a) =>
            a === amount ? (
              <span key={a} className="rounded-lg border border-amber-500/50 px-3 py-1.5 text-amber-400">{usd0(a)}/week</span>
            ) : (
              <Link key={a} href={`/costs/dca/${dcaSlug(a)}`} className="rounded-lg border border-zinc-800 px-3 py-1.5 text-zinc-300 hover:border-amber-500/50 hover:text-amber-400">{usd0(a)}/week</Link>
            ),
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-zinc-50">FAQ</h2>
        <dl className="mt-4 space-y-5">
          {faqs.map((f) => (<div key={f.q}><dt className="font-medium text-zinc-100">{f.q}</dt><dd className="mt-1 text-sm text-zinc-400">{f.a}</dd></div>))}
        </dl>
      </section>

      <section id="alerts" className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-zinc-50">Get alerted when fees change.</h2>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">We re-check these platforms and email when the ranking moves. Unsubscribe anytime.</p>
        <div className="relative mt-5 max-w-lg"><NewsletterForm /></div>
      </section>
      <div className="mt-10"><AffiliateDisclosure compact /></div>
    </article>
  );
}
