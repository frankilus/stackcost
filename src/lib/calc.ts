import { Platform, SCENARIO } from "./platforms";

export interface CostBreakdown {
  platformId: string;
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

/**
 * Transparent formula (documented on /methodology):
 *
 * weekly = $100, weeks = 52, invested = weekly * weeks
 *
 * If firstBuyPaysStandardFee:
 *   buyFees = weekly * standardBuyFeePct  +  weekly * buyFeePct * (weeks - 1)
 * Else:
 *   buyFees = weekly * buyFeePct * weeks
 *
 * spreadPaid = weekly * spreadEstimatePct * weeks
 *   (or only after first buy when firstBuyPaysStandardFee — we apply spread all weeks;
 *    for free-DCA platforms spread is 0)
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
export function computeCost(p: Platform): CostBreakdown {
  const { weeklyUsd, weeks } = SCENARIO;
  const invested = weeklyUsd * weeks;

  let buyFeesPaid: number;
  if (p.firstBuyPaysStandardFee) {
    buyFeesPaid =
      weeklyUsd * p.standardBuyFeePct + weeklyUsd * p.buyFeePct * (weeks - 1);
  } else {
    buyFeesPaid = weeklyUsd * p.buyFeePct * weeks;
  }

  const spreadPaid = weeklyUsd * p.spreadEstimatePct * weeks;

  // Linear DCA: average custody balance ≈ half of year-end stack of cash deployed.
  const avgBalance = invested / 2;
  const custodyPaid = avgBalance * p.custodyMonthlyPct * 12;

  const allInCostUsd = buyFeesPaid + spreadPaid + custodyPaid;
  const allInPct = invested > 0 ? allInCostUsd / invested : 0;

  return {
    platformId: p.id,
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
