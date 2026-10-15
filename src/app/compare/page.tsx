import Link from "next/link";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { computeCost, formatUsd } from "@/lib/calc";
import { getAllComparePairs, SITE_URL } from "@/lib/compares";
import { LAST_UPDATED } from "@/lib/platforms";

export const metadata: Metadata = {
  title: "Compare Bitcoin DCA platforms — StackCost",
  description:
    "Head-to-head all-in cost comparisons for Strike, River, Swan, Coinbase, Kraken, and Cash App weekly Bitcoin DCA.",
  alternates: { canonical: `${SITE_URL}/compare` },
};

export default function CompareIndexPage() {
  const pairs = getAllComparePairs().map((pair) => {
    const costA = computeCost(pair.a, 100);
    const costB = computeCost(pair.b, 100);
    const diff = costA.allInCostUsd - costB.allInCostUsd;
    let winnerName: string;
    let savings: number;
    if (Math.abs(diff) < 0.005) {
      winnerName = "Tie";
      savings = 0;
    } else if (diff < 0) {
      winnerName = pair.a.name;
      savings = -diff;
    } else {
      winnerName = pair.b.name;
      savings = diff;
    }
    return { ...pair, winnerName, savings, costA, costB };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/" className="text-sm text-amber-400 hover:underline">
        ← Back to overview
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-zinc-50">Head-to-head comparisons</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-400">
        All unique pairs among Strike, River, Swan, Coinbase, Kraken, and Cash App. Each
        page shows all-in cost at $25 / $100 / $500 weekly for 1 year. Fee data last
        verified {LAST_UPDATED} (ET).
      </p>
      <div className="mt-6">
        <AffiliateDisclosure />
      </div>

      <ul className="mt-8 divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900/30">
        {pairs.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/compare/${p.slug}`}
              className="flex flex-col gap-1 px-4 py-4 transition hover:bg-zinc-800/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-medium text-zinc-100">
                {p.a.name} vs {p.b.name}
              </span>
              <span className="text-sm text-zinc-500">
                @ $100/wk: {p.a.name} {formatUsd(p.costA.allInCostUsd)} · {p.b.name}{" "}
                {formatUsd(p.costB.allInCostUsd)}
                {p.winnerName !== "Tie" ? (
                  <>
                    {" "}
                    · <span className="text-amber-400">{p.winnerName} cheaper</span> by{" "}
                    {formatUsd(p.savings)}
                  </>
                ) : (
                  <> · tie</>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-zinc-500">
        {pairs.length} comparisons ·{" "}
        <Link href="/methodology" className="text-amber-400 hover:underline">
          How we calculate
        </Link>
      </p>
    </div>
  );
}
