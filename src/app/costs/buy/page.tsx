import Link from "next/link";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { formatPct, formatUsd } from "@/lib/calc";
import { SITE_URL } from "@/lib/compares";
import { HUB_SLUG } from "@/lib/costPages";
import { BUY_AMOUNTS, BUY_HUB_PATH, buyPath, ONE_TIME_VERIFIED, rankOneTime } from "@/lib/oneTimeBuys";
import { platforms } from "@/lib/platforms";

const TITLE = "Cost to Buy Bitcoin Once: One-Time Purchase Fees Compared (2026)";
const DESC = `What a single Bitcoin purchase of $100 to $10,000 really costs on ${platforms.length} US platforms: fee + spread, ranked. Verified ${ONE_TIME_VERIFIED}.`;

export const metadata: Metadata = {
  title: `${TITLE} | StackCost`,
  description: DESC,
  alternates: { canonical: `${SITE_URL}${BUY_HUB_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `${SITE_URL}${BUY_HUB_PATH}`, type: "article" },
};

function usd0(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function BuyHub() {
  const rows = BUY_AMOUNTS.map((a) => ({ a, r: rankOneTime(a) }));
  const ids = platforms.map((p) => p.id);
  const byPlatform = ids
    .map((id) => ({ p: platforms.find((x) => x.id === id)!, costs: rows.map(({ r }) => r.find((x) => x.platform.id === id)!) }))
    .sort((x, y) => x.costs[2].totalUsd - y.costs[2].totalUsd);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: TITLE,
      itemListElement: BUY_AMOUNTS.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: `Buy ${usd0(a)} of Bitcoin`, url: `${SITE_URL}${buyPath(a)}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "StackCost", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "One-time buy costs", item: `${SITE_URL}${BUY_HUB_PATH}` },
      ],
    },
  ];
  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-zinc-500">
        <Link href="/" className="text-amber-400 hover:underline">StackCost</Link>
        <span className="mx-2">/</span><span className="text-zinc-400">One-time buys</span>
      </nav>
      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-500/90">One-time buy · Verified {ONE_TIME_VERIFIED}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">What it costs to buy Bitcoin once</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-300">
          Fee + spread on a single purchase, by amount. Recurring-buy waivers (Strike, River, Cash App Auto Invest) don&apos;t apply here.
          For recurring buys see the <Link href={`/costs/${HUB_SLUG}`} className="text-amber-400 hover:underline">cheapest Bitcoin DCA ranking</Link>.
        </p>
      </header>
      <div className="mt-6"><AffiliateDisclosure /></div>
      <section className="mt-10 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
              <th className="px-4 py-3">Platform</th>
              {BUY_AMOUNTS.map((a) => (
                <th key={a} className="px-4 py-3"><Link href={buyPath(a)} className="hover:text-amber-400">{usd0(a)}</Link></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {byPlatform.map(({ p, costs }) => (
              <tr key={p.id} className="border-b border-zinc-800/80 last:border-0 text-zinc-200">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                {costs.map((c) => (
                  <td key={c.amount} className="px-4 py-3 tabular-nums">{formatUsd(c.totalUsd)}<div className="text-xs text-zinc-500">{formatPct(c.totalPct)}</div></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <p className="mt-3 text-xs text-zinc-500">Sorted by the $1,000 column. Several spreads are estimates; see each amount page for the fee/spread split. <Link href="/methodology" className="text-amber-400 hover:underline">Methodology</Link></p>
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-zinc-50">Cheapest by amount</h2>
        <ul className="mt-4 space-y-2 text-sm text-zinc-300">
          {rows.map(({ a, r }) => (
            <li key={a}>
              <Link href={buyPath(a)} className="text-amber-400 hover:underline">How much does it cost to buy {usd0(a)} of Bitcoin?</Link>{" "}
              Cheapest: {r[0].platform.name} at {formatUsd(r[0].totalUsd)}.
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-10"><AffiliateDisclosure compact /></div>
    </article>
  );
}
