import type { Metadata } from "next";
import Link from "next/link";
import { ComparisonTable } from "@/components/ComparisonTable";
import { NewsletterForm } from "@/components/NewsletterForm";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { getAllComparePairs } from "@/lib/compares";
import { LAST_UPDATED, SCENARIO, platforms } from "@/lib/platforms";
import { costPages, HUB_SLUG } from "@/lib/costPages";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const hubs = [
  {
    href: `/costs/${HUB_SLUG}`,
    title: "Cheapest Bitcoin DCA in the US",
    body: "Ranked all-in cost for recurring buys — the short answer.",
  },
  {
    href: "/costs/bitcoin-withdrawal-fees",
    title: "Bitcoin withdrawal fees",
    body: "Which apps let you move BTC to your own wallet for free.",
  },
  {
    href: "/compare",
    title: "Head-to-head comparisons",
    body: "Platform vs platform at $25, $100 and $500 per week.",
  },
  {
    href: "/fee-changes",
    title: "Fee change log",
    body: "Every promo, tier and fee change we track, dated.",
  },
  {
    href: "/methodology",
    title: "Methodology",
    body: "The exact formula, assumptions and sources behind every number.",
  },
];

export default function HomePage() {
  const samplePairs = getAllComparePairs().slice(0, 6);

  return (
    <>
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.12),_transparent_55%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-amber-500/90">
            US platforms · DCA focus
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            The cheapest way to DCA Bitcoin in the US
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-300 sm:text-xl">
            The real all-in cost to buy Bitcoin on a schedule.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500">
            Fee pages advertise buy %, but spreads, first-purchase charges, custody, and
            withdrawal friction decide what you actually keep. We model{" "}
            <span className="text-zinc-300">{SCENARIO.label}</span> with a transparent
            formula — estimates labeled, sources linked.
          </p>
          <p className="mt-6 text-xs text-zinc-600">
            Fee data last reviewed {LAST_UPDATED} (ET). Not financial advice.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#compare"
              className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400"
            >
              View comparison
            </a>
            <Link
              href="/compare"
              className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500"
            >
              Head-to-head
            </Link>
            <Link
              href="/methodology"
              className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500"
            >
              How we calculate
            </Link>
            <Link
              href="/fee-changes"
              className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500"
            >
              Fee change log
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <h2 className="sr-only">Explore StackCost</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {hubs.map((h) => (
            <li key={h.href}>
              <Link
                href={h.href}
                className="block h-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-amber-500/40"
              >
                <span className="font-medium text-zinc-100">{h.title} →</span>
                <span className="mt-1 block text-sm text-zinc-500">{h.body}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-zinc-500">
          True-cost guides:{" "}
          {costPages.map((c, i) => {
            const name = platforms.find((p) => p.id === c.platformId)?.name ?? c.slug;
            return (
              <span key={c.slug}>
                {i > 0 && " · "}
                <Link href={`/costs/${c.slug}`} className="text-amber-400 hover:underline">
                  {name} fees
                </Link>
              </span>
            );
          })}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <AffiliateDisclosure />
      </section>

      <section id="compare" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-50">Platform comparison</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Scenario: {SCENARIO.label} (${SCENARIO.weeklyUsd * SCENARIO.weeks} invested).
              Expand a row for sources and breakdown.
            </p>
          </div>
          <Link href="/methodology" className="text-sm text-amber-400 hover:underline">
            Full methodology →
          </Link>
        </div>
        <ComparisonTable />
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900/20">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-50">Head-to-head</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {getAllComparePairs().length} pair pages with $25 / $100 / $500 weekly all-in for 1 year.
              </p>
            </div>
            <Link href="/compare" className="text-sm text-amber-400 hover:underline">
              All comparisons →
            </Link>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {samplePairs.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/compare/${p.slug}`}
                  className="block rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-200 transition hover:border-amber-500/40 hover:text-amber-400"
                >
                  {p.a.name} vs {p.b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="alerts"
        className="border-b border-zinc-800 bg-zinc-900/30"
      >
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold text-zinc-50">Get fee-change alerts</h2>
          <p className="mt-2 max-w-xl text-sm text-zinc-400">
            Platforms quietly change tiers and promos. Join the list for occasional updates
            when US DCA costs move — no spam, unsubscribe anytime.
          </p>
          <div className="relative mt-6 max-w-lg">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
