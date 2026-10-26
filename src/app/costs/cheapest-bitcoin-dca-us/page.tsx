import Link from "next/link";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { NewsletterForm } from "@/components/NewsletterForm";
import { COMPARE_WEEKLIES, computeCost, formatPct, formatUsd } from "@/lib/calc";
import { SITE_URL } from "@/lib/compares";
import { costPages, HUB_SLUG } from "@/lib/costPages";
import { DCA_AMOUNTS, dcaSlug } from "@/lib/dcaAmounts";
import { LAST_UPDATED, platforms } from "@/lib/platforms";

const TITLE = "Cheapest Way to DCA Bitcoin in the US (2026): All-In Cost Ranking";
const DESC = `${platforms.length} US Bitcoin DCA platforms ranked by true all-in cost — fees, spread, custody — at $25, $100, $500/week. Sources linked. Updated ${LAST_UPDATED}.`;

export const metadata: Metadata = {
  title: `${TITLE} | StackCost`,
  description: DESC,
  alternates: { canonical: `${SITE_URL}/costs/${HUB_SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `${SITE_URL}/costs/${HUB_SLUG}`, type: "article" },
};

export default function Hub() {
  const ranked = platforms
    .map((p) => ({ p, costs: COMPARE_WEEKLIES.map((w) => computeCost(p, w)), page: costPages.find((c) => c.platformId === p.id) }))
    .sort((a, b) => a.costs[1].allInCostUsd - b.costs[1].allInCostUsd);
  const best = ranked[0];
  const faqs = [
    {
      q: "What is the cheapest way to DCA Bitcoin in the US in 2026?",
      a: `On our modeled recurring-buy paths at $100/week, ${ranked.slice(0, 3).map((r) => `${r.p.name} (${formatUsd(r.costs[1].allInCostUsd)}/yr)`).join(", ")} are the lowest all-in cost. Verify current fees before buying.`,
    },
    {
      q: "What does all-in cost include?",
      a: "Buy fees, documented or estimated spread, and modeled custody fees over 52 weekly buys. Network miner fees for withdrawals are excluded because they vary.",
    },
    {
      q: "Why are Coinbase, Kraken, Robinhood and PayPal more expensive?",
      a: "Their default recurring-buy paths charge a percentage fee, an embedded spread, or both. Robinhood has no commission but discloses a ~0.95% market-maker payment inside the spread. PayPal charges 2.00% on a $100 buy plus an estimated 1.00% spread. Coinbase Advanced and Kraken Pro order books are cheaper but don't offer automatic DCA.",
    },
  ];
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "ItemList", name: TITLE, itemListElement: ranked.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: r.p.name, url: r.page ? `${SITE_URL}/costs/${r.page.slug}` : r.p.website })) },
  ];

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-zinc-500">
        <Link href="/" className="text-amber-400 hover:underline">StackCost</Link>
        <span className="mx-2">/</span><span className="text-zinc-400">Cheapest Bitcoin DCA (US)</span>
      </nav>
      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-500/90">Ranking · Updated {LAST_UPDATED}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">The cheapest way to DCA Bitcoin in the US (2026)</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-300">
          We ranked {platforms.length} US platforms by the true all-in cost of a weekly recurring Bitcoin buy — fees, spread, and custody — not the headline fee.
          At $100/week, <strong className="text-amber-400">{best.p.name}</strong> is cheapest at {formatUsd(best.costs[1].allInCostUsd)} per year on its modeled path.
        </p>
      </header>
      <div className="mt-6"><AffiliateDisclosure /></div>

      <section className="mt-10 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
              <th className="px-4 py-3">#</th><th className="px-4 py-3">Platform</th>
              {COMPARE_WEEKLIES.map((w) => <th key={w} className="px-4 py-3">${w}/wk all-in</th>)}
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r, i) => (
              <tr key={r.p.id} className="border-b border-zinc-800/80 last:border-0 text-zinc-200">
                <td className="px-4 py-3 text-zinc-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{r.p.name}<div className="text-xs font-normal text-zinc-500">{r.p.pathModeled}</div></td>
                {r.costs.map((c, j) => (
                  <td key={j} className="px-4 py-3 tabular-nums">{formatUsd(c.allInCostUsd)}<div className="text-xs text-zinc-500">{formatPct(c.allInPct)}</div></td>
                ))}
                <td className="px-4 py-3">{r.page ? <Link href={`/costs/${r.page.slug}`} className="text-amber-400 hover:underline">True cost →</Link> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <p className="mt-3 text-xs text-zinc-500">52 weekly buys. Spreads marked estimate on Strike, Coinbase, Kraken, River, Robinhood, PayPal. Withdrawal/miner fees excluded — see <Link href="/costs/bitcoin-withdrawal-fees" className="text-amber-400 hover:underline">Bitcoin withdrawal fees</Link>. <Link href="/methodology" className="text-amber-400 hover:underline">Methodology</Link> · <Link href="/compare" className="text-amber-400 hover:underline">Head-to-head pages</Link> · <Link href="/fee-changes" className="text-amber-400 hover:underline">Fee change log</Link></p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-zinc-50">Cheapest platform by weekly amount</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {DCA_AMOUNTS.map((a) => (
            <Link key={a} href={`/costs/dca/${dcaSlug(a)}`} className="rounded-lg border border-zinc-800 px-3 py-1.5 text-zinc-300 hover:border-amber-500/50 hover:text-amber-400">${a.toLocaleString("en-US")}/week</Link>
          ))}
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
