import { Platform, SCENARIO } from "./platforms";

export interface CostBreakdown {
  platformId: string;
  weeklyUsd: number;
  weeks: number;
  totalInvested: number;
  buyFeesPaid: number;
  spreadPaid: number;
  custodyPaid: number;
  /** All-in dollars lost to fees/spread/custody over the year (excl. network miner fees). */
  allInCostUsd: number;
  /** All-in as % of dollars invested. */
  allInPct: number;
  /** Lower is better; used for ranking (same as allInPct). */
  score: number;
}

export const COMPARE_WEEKLIES = [25, 100, 500] as const;
export type CompareWeekly = (typeof COMPARE_WEEKLIES)[number];

/**
 * Transparent formula (documented on /methodology):
 *
 * invested = weekly * weeks
 *
 * If the platform publishes per-order fee tiers (e.g. PayPal), the tier matching the weekly amount is used.
 *
 * If firstBuyPaysStandardFee:
 *   buyFees = weekly * standardBuyFeePct  +  weekly * buyFeePct * (weeks - 1)
 * Else:
 *   buyFees = weekly * buyFeePct * weeks
 *
 * spreadPaid = weekly * spreadEstimatePct * weeks
 *
 * custodyPaid ≈ average balance * custodyMonthlyPct * 12
 *   average balance ≈ invested / 2  (linear DCA into custody)
 *
 * allInCostUsd = buyFees + spreadPaid + custodyPaid
 * allInPct = allInCostUsd / invested
 *
 * Network miner fees for withdrawals are excluded (variable); platform withdrawal policy
 * is noted qualitatively in the table.
 */
export function computeCost(
  p: Platform,
  weeklyUsd: number = SCENARIO.weeklyUsd,
  weeks: number = SCENARIO.weeks,
): CostBreakdown {
  const invested = weeklyUsd * weeks;

  const tier = p.buyFeeTiers?.find((t) => weeklyUsd <= t.maxUsd);
  const feePct = tier ? tier.pct : p.buyFeePct;
  const standardPct = tier ? tier.pct : p.standardBuyFeePct;

  let buyFeesPaid: number;
  if (p.firstBuyPaysStandardFee) {
    buyFeesPaid =
      weeklyUsd * standardPct + weeklyUsd * feePct * (weeks - 1);
  } else {
    buyFeesPaid = weeklyUsd * feePct * weeks;
  }

  const spreadPaid = weeklyUsd * p.spreadEstimatePct * weeks;

  // Linear DCA: average custody balance ≈ half of year-end stack of cash deployed.
  const avgBalance = invested / 2;
  const custodyPaid = avgBalance * p.custodyMonthlyPct * 12;

  const allInCostUsd = buyFeesPaid + spreadPaid + custodyPaid;
  const allInPct = invested > 0 ? allInCostUsd / invested : 0;

  return {
    platformId: p.id,
    weeklyUsd,
    weeks,
    totalInvested: invested,
    buyFeesPaid,
    spreadPaid,
    custodyPaid,
    allInCostUsd,
    allInPct,
    score: allInPct,
  };
}

export function formatUsd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPct(n: number, digits = 2): string {
  return `${(n * 100).toFixed(digits)}%`;
}
