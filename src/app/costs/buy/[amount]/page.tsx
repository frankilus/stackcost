import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { NewsletterForm } from "@/components/NewsletterForm";
import { formatPct, formatUsd } from "@/lib/calc";
import { SITE_URL } from "@/lib/compares";
import { costPages } from "@/lib/costPages";
import { DCA_AMOUNTS, DCA_MONTHLY_AMOUNTS, dcaSlug } from "@/lib/dcaAmounts";
import { BUY_AMOUNTS, BUY_HUB_PATH, buyPath, buySlug, ONE_TIME_VERIFIED, parseBuySlug, rankOneTime } from "@/lib/oneTimeBuys";
import { platforms } from "@/lib/platforms";

export const dynamicParams = false;

export function generateStaticParams() {
  return BUY_AMOUNTS.map((a) => ({ amount: buySlug(a) }));
}

function usd0(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export async function generateMetadata({ params }: { params: Promise<{ amount: string }> }): Promise<Metadata> {
  const { amount: slug } = await params;
  const amount = parseBuySlug(slug);
  if (!amount) return { title: "StackCost" };
  const r = rankOneTime(amount);
  const best = r[0];
  const worst = r[r.length - 1];
  const title = `How Much Does It Cost to Buy ${usd0(amount)} of Bitcoin? (2026 Fees Compared)`;
  const description = `A one-time ${usd0(amount)} Bitcoin buy costs ${formatUsd(best.totalUsd)} on ${best.platform.name} up to ${formatUsd(worst.totalUsd)} on ${worst.platform.name} in fees + spread. ${platforms.length} US platforms ranked. Verified ${ONE_TIME_VERIFIED}.`;
  const url = `${SITE_URL}${buyPath(amount)}`;
  return {
    title: `${title} | StackCost`,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
  };
}

export default async function BuyAmountPage({ params }: { params: Promise<{ amount: string }> }) {
  const { amount: slug } = await params;
  const amount = parseBuySlug(slug);
  if (!amount) notFound();
  const ranked = rankOneTime(amount);
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];
  const gap = worst.totalUsd - best.totalUsd;
  const pageFor = (id: string) => costPages.find((c) => c.platformId === id);
  const cash = ranked.find((r) => r.platform.id === "cashapp")!;
  const strike = ranked.find((r) => r.platform.id === "strike")!;
  const robinhood = ranked.find((r) => r.platform.id === "robinhood")!;
  const nearestWeekly = [...DCA_AMOUNTS].reverse().find((a) => a <= amount / 4) ?? DCA_AMOUNTS[0];
  const nearestMonthly = [...DCA_MONTHLY_AMOUNTS].reverse().find((a) => a <= amount) ?? DCA_MONTHLY_AMOUNTS[0];

  const faqs = [
    {
      q: `How much does it cost to buy ${usd0(amount)} of Bitcoin?`,
      a: `On the one-time buy paths we model, fees plus spread on a single ${usd0(amount)} purchase range from ${formatUsd(best.totalUsd)} (${formatPct(best.totalPct)}) on ${best.platform.name} to ${formatUsd(worst.totalUsd)} (${formatPct(worst.totalPct)}) on ${worst.platform.name}. Several spreads are estimates; the exact price is shown on each app's confirmation screen.`,
    },
    {
      q: `What is the cheapest way to buy ${usd0(amount)} of Bitcoin at once?`,
      a: `${ranked.slice(0, 3).map((r) => `${r.platform.name} (${formatUsd(r.totalUsd)})`).join(", ")} are the lowest modeled all-in costs for a one-time ${usd0(amount)} buy. ${best.spreadConfidence === "estimate" ? `${best.platform.name}'s figure relies on an estimated spread, so check the quote before you confirm.` : ""}`.trim(),
    },
    {
      q: "Are one-time Bitcoin buys more expensive than recurring buys?",
      a: `Often, yes. Strike and River waive their trading fee on recurring buys after the first one, and Cash App charges 0% on Auto Invest, but none of those waivers apply to a one-time buy. Here Strike charges ${formatPct(strike.feePct)} and Cash App charges ${formatPct(cash.feePct)} on a ${usd0(amount)} one-time buy.`,
    },
    amount >= 2000
      ? {
          q: `Is Cash App really free for a ${usd0(amount)} Bitcoin buy?`,
          a: "Cash App's fee page says buys over $2,000 carry zero fees and zero spread. That is the documented rule we use; confirm the quoted price before you buy.",
        }
      : {
          q: "Why is Robinhood near the top if it charges no commission?",
          a: `Robinhood's cost is inside the spread. It discloses receiving $0.95 per $100 of market-maker-routed crypto, which is included in the spread, so we model ${formatPct(robinhood.spreadPct)} as a floor estimate (${formatUsd(robinhood.totalUsd)} here). The real spread can be higher, especially in volatile markets.`,
        },
  ];

  const crumbs = [
    { name: "StackCost", url: SITE_URL },
    { name: "One-time buy costs", url: `${SITE_URL}${BUY_HUB_PATH}` },
    { name: `Buy ${usd0(amount)} of Bitcoin`, url: `${SITE_URL}${buyPath(amount)}` },
  ];

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Cheapest way to buy ${usd0(amount)} of Bitcoin (one-time)`,
      itemListElement: ranked.map((r, i) => {
        const pg = pageFor(r.platform.id);
        return { "@type": "ListItem", position: i + 1, name: r.platform.name, url: pg ? `${SITE_URL}/costs/${pg.slug}` : r.platform.website };
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })),
    },
  ];

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-zinc-500">
        <Link href="/" className="text-amber-400 hover:underline">StackCost</Link>
        <span className="mx-2">/</span>
        <Link href={BUY_HUB_PATH} className="hover:text-zinc-300">One-time buys</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-400">{usd0(amount)}</span>
      </nav>
      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-500/90">One-time buy · Verified {ONE_TIME_VERIFIED}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">How much does it cost to buy {usd0(amount)} of Bitcoin?</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-300">
          A single {usd0(amount)} purchase costs between <strong className="text-amber-400">{formatUsd(best.totalUsd)}</strong> on {best.platform.name} and{" "}
          {formatUsd(worst.totalUsd)} on {worst.platform.name} in fees and spread. That is a {formatUsd(gap)} difference for the same Bitcoin.
          Recurring-buy waivers don&apos;t apply to one-time buys, so this ranking differs from our DCA rankings.
        </p>
      </header>
      <div className="mt-6"><AffiliateDisclosure /></div>

      <section className="mt-10 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Spread</th>
              <th className="px-4 py-3">All-in</th>
              <th className="px-4 py-3">BTC you get (of {usd0(amount)})</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r, i) => {
              const pg = pageFor(r.platform.id);
              return (
                <tr key={r.platform.id} className="border-b border-zinc-800/80 last:border-0 text-zinc-200">
                  <td className="px-4 py-3 text-zinc-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{r.platform.name}<div className="text-xs font-normal text-zinc-500">{r.path}</div></td>
                  <td className="px-4 py-3 tabular-nums">{formatUsd(r.feeUsd)}<div className="text-xs text-zinc-500">{formatPct(r.feePct)}{r.feeConfidence === "estimate" ? " · estimate" : ""}</div></td>
                  <td className="px-4 py-3 tabular-nums">{formatUsd(r.spreadUsd)}<div className="text-xs text-zinc-500">{formatPct(r.spreadPct)}{r.spreadConfidence === "estimate" && r.spreadPct > 0 ? " · estimate" : ""}</div></td>
                  <td className="px-4 py-3 tabular-nums font-medium">{formatUsd(r.totalUsd)}<div className="text-xs font-normal text-zinc-500">{formatPct(r.totalPct)}</div></td>
                  <td className="px-4 py-3 tabular-nums">≈{formatUsd(amount - r.totalUsd)}<div className="text-xs text-zinc-500">at mid-market price</div></td>
                  <td className="px-4 py-3">{pg ? <Link href={`/costs/${pg.slug}`} className="text-amber-400 hover:underline">True cost →</Link> : null}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <p className="mt-3 text-xs text-zinc-500">
        One {usd0(amount)} buy funded by bank transfer (ACH) where offered. Fees are the platform&apos;s published one-time rates on {ONE_TIME_VERIFIED} (Coinbase is an estimate because it only shows its fee at order preview).
        Spreads marked &ldquo;estimate&rdquo; are our estimates from each platform&apos;s disclosures. Strike assumes no other Strike trades this month or last.
        Card funding, withdrawal and miner fees are excluded; see <Link href="/costs/bitcoin-withdrawal-fees" className="text-amber-400 hover:underline">Bitcoin withdrawal fees</Link>.{" "}
        <Link href="/methodology" className="text-amber-400 hover:underline">Methodology</Link> · <Link href="/fee-changes" className="text-amber-400 hover:underline">Fee change log</Link>
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-zinc-50">Other one-time amounts</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {BUY_AMOUNTS.map((a) =>
            a === amount ? (
              <span key={a} className="rounded-lg border border-amber-500/50 px-3 py-1.5 text-amber-400">Buy {usd0(a)}</span>
            ) : (
              <Link key={a} href={buyPath(a)} className="rounded-lg border border-zinc-800 px-3 py-1.5 text-zinc-300 hover:border-amber-500/50 hover:text-amber-400">Buy {usd0(a)}</Link>
            ),
          )}
        </div>
        <p className="mt-4 text-sm text-zinc-400">
          Splitting {usd0(amount)} into recurring buys can be cheaper: see{" "}
          <Link href={`/costs/dca/${dcaSlug(nearestWeekly, "week")}`} className="text-amber-400 hover:underline">DCA {usd0(nearestWeekly)} a week</Link>,{" "}
          <Link href={`/costs/dca/${dcaSlug(nearestMonthly, "month")}`} className="text-amber-400 hover:underline">DCA {usd0(nearestMonthly)} a month</Link>, or the{" "}
          <Link href="/calculator" className="text-amber-400 hover:underline">DCA cost calculator</Link>.
        </p>
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
