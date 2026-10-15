import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { NewsletterForm } from "@/components/NewsletterForm";
import {
  COMPARE_WEEKLIES,
  computeCost,
  formatPct,
  formatUsd,
  type CostBreakdown,
} from "@/lib/calc";
import {
  getAllComparePairs,
  resolveComparePair,
  SITE_URL,
} from "@/lib/compares";
import { LAST_UPDATED, type Platform } from "@/lib/platforms";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllComparePairs().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pair = resolveComparePair(slug);
  if (!pair) return { title: "Compare — StackCost" };
  const title = `${pair.a.name} vs ${pair.b.name} — Bitcoin DCA cost`;
  const description = `All-in cost of weekly Bitcoin DCA on ${pair.a.name} vs ${pair.b.name} at $25, $100, and $500/week for 1 year. Sources linked. Last verified ${LAST_UPDATED}.`;
  return {
    title: `${title} | StackCost`,
    description,
    alternates: { canonical: `${SITE_URL}/compare/${pair.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/compare/${pair.slug}`,
      type: "article",
    },
  };
}

function winnerLabel(
  a: Platform,
  b: Platform,
  costA: CostBreakdown,
  costB: CostBreakdown,
): { winner: Platform | null; loser: Platform | null; savings: number; tie: boolean } {
  const diff = costA.allInCostUsd - costB.allInCostUsd;
  if (Math.abs(diff) < 0.005) {
    return { winner: null, loser: null, savings: 0, tie: true };
  }
  if (diff < 0) {
    return { winner: a, loser: b, savings: -diff, tie: false };
  }
  return { winner: b, loser: a, savings: diff, tie: false };
}

function PlatformCard({
  platform,
  cost,
  isWinner,
  isTie,
}: {
  platform: Platform;
  cost: CostBreakdown;
  isWinner: boolean;
  isTie: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        isWinner && !isTie
          ? "border-amber-500/60 bg-amber-500/5"
          : "border-zinc-800 bg-zinc-900/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-zinc-50">{platform.name}</h3>
          <p className="mt-1 text-xs text-zinc-500">{platform.pathModeled}</p>
        </div>
        {isWinner && !isTie ? (
          <span className="shrink-0 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-zinc-950">
            Lower cost
          </span>
        ) : null}
        {isTie ? (
          <span className="shrink-0 rounded-full border border-zinc-600 px-2.5 py-1 text-xs font-medium text-zinc-300">
            Tie
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-semibold tabular-nums text-amber-400">
        {formatUsd(cost.allInCostUsd)}
      </p>
      <p className="text-sm tabular-nums text-zinc-500">
        {formatPct(cost.allInPct)} of {formatUsd(cost.totalInvested)} invested
      </p>
      <ul className="mt-4 space-y-1 text-sm text-zinc-400">
        <li>Buy fees: {formatUsd(cost.buyFeesPaid)}</li>
        <li>
          Spread ({platform.spreadConfidence}): {formatUsd(cost.spreadPaid)}
        </li>
        <li>Custody (modeled): {formatUsd(cost.custodyPaid)}</li>
      </ul>
      <a
        href={platform.website}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm text-amber-400 hover:underline"
      >
        Official site →
      </a>
      <span className="ml-2 text-xs text-zinc-600">[no affiliate link]</span>
    </div>
  );
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pair = resolveComparePair(slug);
  if (!pair) notFound();
  if (pair.slug !== slug) {
    redirect(`/compare/${pair.slug}`);
  }

  const { a, b } = pair;
  const scenarios = COMPARE_WEEKLIES.map((weekly) => {
    const costA = computeCost(a, weekly);
    const costB = computeCost(b, weekly);
    const result = winnerLabel(a, b, costA, costB);
    return { weekly, costA, costB, ...result };
  });

  // Primary callout uses $100/week (middle / homepage scenario)
  const primary = scenarios.find((s) => s.weekly === 100) ?? scenarios[0];
  const otherPairs = getAllComparePairs().filter(
    (p) =>
      p.slug !== pair.slug &&
      (p.a.id === a.id ||
        p.a.id === b.id ||
        p.b.id === a.id ||
        p.b.id === b.id),
  );

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <nav className="text-sm text-zinc-500">
        <Link href="/" className="text-amber-400 hover:underline">
          StackCost
        </Link>
        <span className="mx-2">/</span>
        <Link href="/compare" className="hover:text-zinc-300">
          Compare
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-400">
          {a.name} vs {b.name}
        </span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-500/90">
          Head-to-head · US DCA
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          {a.name} vs {b.name}
        </h1>
        <p className="mt-3 text-base text-zinc-400">
          All-in cost to buy Bitcoin on a weekly schedule for 1 year — fees, estimated
          spread, and modeled custody. Network miner fees excluded.
        </p>
        <p className="mt-3 text-xs text-zinc-600">
          Fee data last verified {LAST_UPDATED} (ET).{" "}
          <Link href="/methodology" className="text-amber-400 hover:underline">
            Methodology
          </Link>
          .
        </p>
      </header>

      <div className="mt-6">
        <AffiliateDisclosure />
      </div>

      {/* Winner banner @ $100 */}
      <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        {primary.tie ? (
          <p className="text-lg text-zinc-200">
            At <strong className="text-zinc-50">$100/week</strong>, {a.name} and {b.name}{" "}
            tie on modeled all-in cost (
            {formatUsd(primary.costA.allInCostUsd)} / year).
          </p>
        ) : (
          <p className="text-lg text-zinc-200">
            At <strong className="text-zinc-50">$100/week for 1 year</strong>,{" "}
            <strong className="text-amber-400">{primary.winner!.name}</strong> wins on
            cost — about{" "}
            <strong className="text-zinc-50">{formatUsd(primary.savings)}</strong> less
            than {primary.loser!.name} (
            {formatUsd(
              primary.winner!.id === a.id
                ? primary.costA.allInCostUsd
                : primary.costB.allInCostUsd,
            )}{" "}
            vs{" "}
            {formatUsd(
              primary.loser!.id === a.id
                ? primary.costA.allInCostUsd
                : primary.costB.allInCostUsd,
            )}
            ).
          </p>
        )}
        <p className="mt-2 text-sm text-zinc-500">
          Ranked by modeled all-in cost only — not custody preference, UX, or future
          affiliate relationships.
        </p>
      </section>

      {/* Scenario table */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-zinc-50">
          All-in at $25 / $100 / $500 weekly
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Each scenario is 52 weekly buys (1 year). Same fee inputs; only the weekly
          dollar amount changes.
        </p>
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-4 py-3 font-medium">Weekly DCA</th>
                  <th className="px-4 py-3 font-medium">{a.name} all-in</th>
                  <th className="px-4 py-3 font-medium">{b.name} all-in</th>
                  <th className="px-4 py-3 font-medium">Winner</th>
                  <th className="px-4 py-3 font-medium">Savings</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s) => (
                  <tr
                    key={s.weekly}
                    className="border-b border-zinc-800/80 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-200">
                      ${s.weekly}/wk
                      <div className="text-xs font-normal text-zinc-500">
                        {formatUsd(s.weekly * 52)} invested
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-zinc-200">
                      {formatUsd(s.costA.allInCostUsd)}
                      <div className="text-xs text-zinc-500">
                        {formatPct(s.costA.allInPct)}
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-zinc-200">
                      {formatUsd(s.costB.allInCostUsd)}
                      <div className="text-xs text-zinc-500">
                        {formatPct(s.costB.allInPct)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-200">
                      {s.tie ? "Tie" : s.winner!.name}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-amber-400">
                      {s.tie ? "—" : formatUsd(s.savings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Side-by-side @ $100 */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-zinc-50">
          Breakdown at $100 / week
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <PlatformCard
            platform={a}
            cost={primary.costA}
            isWinner={!primary.tie && primary.winner?.id === a.id}
            isTie={primary.tie}
          />
          <PlatformCard
            platform={b}
            cost={primary.costB}
            isWinner={!primary.tie && primary.winner?.id === b.id}
            isTie={primary.tie}
          />
        </div>
      </section>

      {/* Sources */}
      <section className="mt-10 grid gap-6 md:grid-cols-2">
        {[a, b].map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5"
          >
            <h3 className="font-medium text-zinc-100">{p.name} sources</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Last verified {LAST_UPDATED} (ET)
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {p.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline"
                  >
                    {s.label}
                  </a>
                  <span className="text-xs text-zinc-600"> · accessed {s.accessed}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500">{p.notes}</p>
          </div>
        ))}
      </section>

      {/* Newsletter CTA */}
      <section
        id="alerts"
        className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8"
      >
        <h2 className="text-xl font-semibold text-zinc-50">
          Fee-change alerts for {a.name} &amp; {b.name}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">
          Get occasional email when {a.name} or {b.name} (or other US DCA platforms) change
          fees, spreads, or promos that move these numbers. Unsubscribe anytime.
        </p>
        <div className="relative mt-5 max-w-lg">
          <NewsletterForm />
        </div>
      </section>

      {/* Related compares */}
      {otherPairs.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-zinc-50">Related comparisons</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {otherPairs.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/compare/${p.slug}`}
                  className="inline-block rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-300 hover:border-amber-500/40 hover:text-amber-400"
                >
                  {p.a.name} vs {p.b.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <Link href="/compare" className="text-sm text-amber-400 hover:underline">
              All head-to-head pages →
            </Link>
          </p>
        </section>
      ) : null}

      <div className="mt-10">
        <AffiliateDisclosure compact />
      </div>
    </article>
  );
}
