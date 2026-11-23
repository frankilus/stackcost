/**
 * One-time (single, non-recurring) Bitcoin buy cost model.
 * Recurring-buy waivers (Strike, River, Cash App Auto Invest) do NOT apply to one-time buys,
 * so each platform's one-time path is modeled explicitly here. Spread estimates reuse
 * platforms.ts (single source of truth) except where a platform documents a different
 * spread rule for one-time buys (Cash App market buys).
 * Re-verified against official fee pages 2026-11-23 (America/New_York): Strike, River, Swan, Cash App.
 */
import { platforms, type Platform } from "./platforms";

export const ONE_TIME_VERIFIED = "2026-11-23";
export const BUY_AMOUNTS = [100, 500, 1000, 5000, 10000] as const;
export const BUY_HUB_PATH = "/costs/buy";

export function buySlug(amount: number) {
  return `${amount}-of-bitcoin`;
}
export function buyPath(amount: number) {
  return `${BUY_HUB_PATH}/${buySlug(amount)}`;
}
export function parseBuySlug(slug: string): number | undefined {
  const m = /^(\d+)-of-bitcoin$/.exec(slug);
  if (!m) return undefined;
  const n = Number(m[1]);
  return (BUY_AMOUNTS as readonly number[]).includes(n) ? n : undefined;
}

export interface OneTimeCost {
  platform: Platform;
  amount: number;
  feePct: number;
  feeUsd: number;
  feeConfidence: "documented" | "estimate";
  spreadPct: number;
  spreadUsd: number;
  spreadConfidence: "documented" | "estimate";
  totalUsd: number;
  totalPct: number;
  /** Plain-English description of the one-time path and the rule applied at this amount. */
  path: string;
}

/** Strike one-time fee tiers (monthly traded volume, cumulative volume includes the trade itself). */
const STRIKE_TIERS: { minUsd: number; pct: number }[] = [
  { minUsd: 15_000_000, pct: 0.0025 },
  { minUsd: 5_000_000, pct: 0.0039 },
  { minUsd: 500_000, pct: 0.0059 },
  { minUsd: 50_000, pct: 0.0069 },
  { minUsd: 5_000, pct: 0.0079 },
  { minUsd: 0, pct: 0.0089 },
];

/** Cash App Market Buy fee by transaction size (cash.app/bitcoin/fees). Spread 0–0.75% except over $2,000 (0%). */
function cashAppMarketBuy(amount: number): { pct: number; spread: number; band: string } {
  if (amount >= 2000) return { pct: 0, spread: 0, band: "$2,000+: 0% fee and no spread" };
  const spread = 0.00375; // midpoint of Cash App's disclosed 0–0.75% range (ESTIMATE)
  if (amount >= 1000) return { pct: 0.009, spread, band: "$1,000–$1,999: 0.9% fee" };
  if (amount >= 500) return { pct: 0.015, spread, band: "$500–$999: 1.5% fee" };
  return { pct: 0.02, spread, band: "$1–$499: 2.0% fee" };
}

export function computeOneTime(p: Platform, amount: number): OneTimeCost {
  let feePct = p.standardBuyFeePct;
  let feeConfidence: "documented" | "estimate" = "documented";
  let spreadPct = p.spreadEstimatePct;
  let spreadConfidence = p.spreadConfidence;
  let path = "";

  switch (p.id) {
    case "strike": {
      feePct = STRIKE_TIERS.find((t) => amount >= t.minUsd)!.pct;
      path = `One-time buy, tiered by monthly volume (the trade counts toward its own tier). Assumes no other Strike trades this month or last: ${(feePct * 100).toFixed(2)}% fee + ~${(p.spreadEstimatePct * 100).toFixed(2)}% target spread.`;
      break;
    }
    case "river":
      feePct = 0.01;
      path = "One-time order under $1M: 1.00% fee (recurring-buy waiver does not apply) + ~0.25% typical spread.";
      break;
    case "swan":
      feePct = 0.01;
      path = "Standard 1% buy fee; Swan documents no separate spread.";
      break;
    case "coinbase":
      feeConfidence = "estimate";
      path = "Simple Buy: fee shown only at order preview. ~1.49% fee + ~0.5% spread are estimates; Advanced Trade is usually cheaper.";
      break;
    case "kraken":
      path = "Instant Buy: documented 1% fee + ~0.5% spread estimate (Kraken Pro order book is cheaper but manual).";
      break;
    case "cashapp": {
      const c = cashAppMarketBuy(amount);
      feePct = c.pct;
      spreadPct = c.spread;
      spreadConfidence = c.spread === 0 ? "documented" : "estimate";
      path = `Market Buy (one-time), ${c.band}${c.spread ? " + 0–0.75% spread (we use the 0.375% midpoint)" : ""}.`;
      break;
    }
    case "robinhood":
      feePct = 0;
      path = "Default market-maker routing: $0 commission; cost is in the spread (~0.95% floor from Robinhood's disclosed payment).";
      break;
    case "paypal": {
      const tier = p.buyFeeTiers!.find((t) => amount <= t.maxUsd)!;
      feePct = tier.pct;
      path = `Tiered fee by order size: ${(tier.pct * 100).toFixed(2)}% at this amount + PayPal's own ~1.00% spread estimate.`;
      break;
    }
    case "fold":
      feePct = 0.01;
      path = "Free plan without a $5,000 Reserve balance: 1% fee + ~0.5% Fold/BitGo spread estimate.";
      break;
    default:
      path = p.pathModeled;
  }

  const feeUsd = amount * feePct;
  const spreadUsd = amount * spreadPct;
  const totalUsd = feeUsd + spreadUsd;
  return {
    platform: p,
    amount,
    feePct,
    feeUsd,
    feeConfidence,
    spreadPct,
    spreadUsd,
    spreadConfidence,
    totalUsd,
    totalPct: totalUsd / amount,
    path,
  };
}

export function rankOneTime(amount: number): OneTimeCost[] {
  return platforms.map((p) => computeOneTime(p, amount)).sort((a, b) => a.totalUsd - b.totalUsd || a.platform.name.localeCompare(b.platform.name));
}
