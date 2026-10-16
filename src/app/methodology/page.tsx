import Link from "next/link";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { LAST_UPDATED, SCENARIO, platforms } from "@/lib/platforms";
import { COMPARE_WEEKLIES, computeCost, formatPct, formatUsd } from "@/lib/calc";
import { SITE_URL } from "@/lib/compares";

export const metadata: Metadata = {
  title: "Methodology — StackCost",
  description:
    "How StackCost computes all-in DCA Bitcoin costs across platforms. Verified fee data and transparent formula.",
  alternates: { canonical: `${SITE_URL}/methodology` },
};

export default function MethodologyPage() {
  const example = computeCost(platforms[0]);

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link href="/" className="text-sm text-amber-400 hover:underline">
        ← Back to comparison
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-zinc-50">Methodology</h1>

      <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-zinc-300">
        <p>
          <strong className="font-medium text-amber-400">Verified:</strong> Fee inputs
          last reviewed <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> (America/New_York).
          Source links on each platform row and compare page show the access date.
        </p>
      </div>

      <p className="mt-4 text-sm text-zinc-500">
        Default homepage scenario: {SCENARIO.label}. Head-to-head pages also show $
        {COMPARE_WEEKLIES.join(", $")}/week for 52 weeks.
      </p>

      <div className="mt-6">
        <AffiliateDisclosure />
      </div>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-zinc-300">
        <h2 className="text-lg font-medium text-zinc-100">What “all-in” means</h2>
        <p>
          All-in cost is the dollars you lose to platform buy fees, estimated spread, and
          modeled custody over one year of weekly DCA — before Bitcoin network miner fees.
          We do <em>not</em> model price appreciation, taxes, payment-card cash-advance fees,
          or FX.
        </p>

        <h2 className="text-lg font-medium text-zinc-100">Formula</h2>
        <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-xs text-zinc-300">
{`invested = weekly × weeks
          = weekly × ${SCENARIO.weeks}

# Platforms with free DCA after first buy (Strike, River weekly):
buyFees = weekly × standardBuyFeePct
        + weekly × buyFeePct × (weeks − 1)

# Everyone else:
buyFees = weekly × buyFeePct × weeks

spreadPaid = weekly × spreadEstimatePct × weeks

avgBalance ≈ invested / 2   # linear DCA into custody
custodyPaid = avgBalance × custodyMonthlyPct × 12

allInCostUsd = buyFees + spreadPaid + custodyPaid
allInPct     = allInCostUsd / invested`}
        </pre>

        <p>
          Example ({platforms[0].name} at ${SCENARIO.weeklyUsd}/wk): buy fees{" "}
          {formatUsd(example.buyFeesPaid)}, spread {formatUsd(example.spreadPaid)}, custody{" "}
          {formatUsd(example.custodyPaid)} → all-in{" "}
          <strong className="text-zinc-100">{formatUsd(example.allInCostUsd)}</strong> (
          {formatPct(example.allInPct)} of invested).
        </p>

        <h2 className="text-lg font-medium text-zinc-100">Head-to-head pages</h2>
        <p>
          Every unique pair among the six platforms gets a compare URL (15 pages). The
          “winner” is whoever has the lower modeled all-in cost at that weekly amount —
          never by affiliate status. See{" "}
          <Link href="/compare" className="text-amber-400 hover:underline">
            all comparisons
          </Link>
          .
        </p>

        <h2 className="text-lg font-medium text-zinc-100">Path choices</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-400">
          <li>
            We pick the <strong className="text-zinc-200">retail DCA path</strong> each
            platform markets (recurring / Auto Invest), not the absolute cheapest pro desk
            unless that is the default UX.
          </li>
          <li>
            Swan is modeled with <strong className="text-zinc-200">auto-withdrawal on</strong>{" "}
            so Swan Safe custody is waived.
          </li>
          <li>
            Coinbase Simple Buy % is <strong className="text-zinc-200">estimated</strong> —
            Coinbase shows exact fee+spread only at order preview.
          </li>
          <li>
            Kraken spread is <strong className="text-zinc-200">estimated</strong>; documented
            trading fee on Instant/Recurring is 1%.
          </li>
          <li>Cash App uses Auto Invest (0% fee / 0% spread per Cash App), not Market Buy (2% at $100 + possible spread).</li>
          <li>
            Strike recurring waives the <strong className="text-zinc-200">trading fee</strong>{" "}
            after the first weekly buy, but Strike&apos;s fee FAQ targets an all-in{" "}
            <strong className="text-zinc-200">spread of ~0.22%</strong> on every fill — we
            model that as an ESTIMATE (actual may vary).
          </li>
        </ul>

        <h2 className="text-lg font-medium text-zinc-100">Confidence labels</h2>
        <p>
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs">documented</code> means
          the number appears on a public fee page we linked.{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs">estimate</code> means
          the platform discloses a variable range or only shows the figure in-app — we state
          assumptions in each row.
        </p>

        <h2 className="text-lg font-medium text-zinc-100">What we leave out</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-400">
          <li>On-chain / Lightning network fees (vary by mempool; noted qualitatively).</li>
          <li>Opportunity cost of withdrawal holds (e.g. ACH hold periods).</li>
          <li>Subscription products (Coinbase One, Kraken+) unless noted in row notes.</li>
        </ul>

        <p className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-zinc-400">
          This is not financial advice. Fees change. Verify with each platform before you
          buy or withdraw.
        </p>
      </section>
    </article>
  );
}
