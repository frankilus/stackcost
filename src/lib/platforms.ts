/**
 * StackCost platform fee data — US-focused DCA comparison.
 * lastUpdated: 2026-10-15 (America/New_York)
 * All figures labeled from public fee pages; estimates marked clearly.
 */

export type Confidence = "documented" | "estimate";

export interface Platform {
  id: string;
  name: string;
  website: string;
  /** Recurring/DCA buy fee as decimal (0.01 = 1%). After any free-DCA waiver where applicable. */
  buyFeePct: number;
  /** Estimated bid/ask or quoted spread as decimal. 0 when platform states none for this path. */
  spreadEstimatePct: number;
  spreadConfidence: Confidence;
  /** First purchase may still pay standard fee before DCA waiver kicks in. */
  firstBuyPaysStandardFee: boolean;
  /** Standard (non-DCA) fee used for first buy when waiver applies. */
  standardBuyFeePct: number;
  fundingNotes: string;
  withdrawalBtc: string;
  custodyNotes: string;
  /** Monthly custody as % of AOP (0 if waived under our modeled path). */
  custodyMonthlyPct: number;
  pathModeled: string;
  sources: { label: string; url: string; accessed: string }[];
  notes: string;
}

export const LAST_UPDATED = "2026-10-15";
export const SCENARIO = {
  weeklyUsd: 100,
  weeks: 52,
  label: "$100 weekly DCA for 1 year",
} as const;

export const platforms: Platform[] = [
  {
    id: "strike",
    name: "Strike",
    website: "https://strike.me",
    buyFeePct: 0,
    spreadEstimatePct: 0.0022,
    spreadConfidence: "estimate",
    firstBuyPaysStandardFee: true,
    standardBuyFeePct: 0.0089,
    fundingNotes: "ACH / linked bank; trading fee waived on recurring after first weekly purchase (personal accounts). Spread still applies.",
    withdrawalBtc: "On-chain / Lightning supported; network fees apply as shown at send.",
    custodyNotes: "Custodial balance; designed for frequent move-to-self-custody.",
    custodyMonthlyPct: 0,
    pathModeled: "Weekly recurring buys (personal) — trading fee waived from 2nd purchase; ~0.22% target spread ESTIMATE on every buy.",
    sources: [
      {
        label: "Strike trading fees FAQ",
        url: "https://strike.me/en/faq/what-are-the-bitcoin-trading-fees-on-strike/",
        accessed: "2026-10-15",
      },
      {
        label: "Strike recurring purchase FAQ",
        url: "https://strike.me/en/faq/how-do-i-set-up-a-recurring-purchase/",
        accessed: "2026-10-15",
      },
    ],
    notes: "Trading-fee waiver is separate from spread. Strike's fee FAQ states it 'targets an all-in spread of 0.22%' (actual may be higher/lower; reflected in quoted price). We model 0.22% as ESTIMATE on every purchase, plus 0.89% trading fee on the first weekly buy only. One-time buys remain fully tiered.",
  },
  {
    id: "river",
    name: "River",
    website: "https://river.com",
    buyFeePct: 0,
    spreadEstimatePct: 0,
    spreadConfidence: "estimate",
    firstBuyPaysStandardFee: true,
    standardBuyFeePct: 0.01,
    fundingNotes: "ACH; free recurring buys from 2nd weekly order; free payroll conversion up to $30k/mo.",
    withdrawalBtc: "1 free on-chain send/month; additional sends pay network fee by speed.",
    custodyNotes: "Full-reserve cold storage; monthly Proof of Reserves; no client BTC lending.",
    custodyMonthlyPct: 0,
    pathModeled: "Weekly recurring buys — zero fee from 2nd order; assume free monthly withdraw.",
    sources: [
      {
        label: "River fees help article",
        url: "https://support.river.com/hc/en-us/articles/50055900679315-What-are-River-s-fees",
        accessed: "2026-10-15",
      },
      {
        label: "River Proof of Reserves",
        url: "https://river.com/reserves",
        accessed: "2026-10-15",
      },
    ],
    notes: "River may include a spread on priced orders; size not publicly fixed — marked estimate 0% for free recurring path until measured.",
  },
  {
    id: "swan",
    name: "Swan",
    website: "https://www.swanbitcoin.com",
    buyFeePct: 0.01,
    spreadEstimatePct: 0,
    spreadConfidence: "documented",
    firstBuyPaysStandardFee: false,
    standardBuyFeePct: 0.01,
    fundingNotes: "ACH recurring buys at standard 1% buy fee (promo rates expire; verify in-app).",
    withdrawalBtc: "Complimentary BTC & USD withdrawals (Swan covers miner fees per FAQ).",
    custodyNotes: "Swan Safe 0.03%/mo AOP — waived when auto-withdrawal enabled (modeled path).",
    custodyMonthlyPct: 0,
    pathModeled: "1% recurring buy + auto-withdraw enabled (custody waived).",
    sources: [
      {
        label: "Swan fees FAQ (updated 2026-09-09)",
        url: "https://help.swanbitcoin.com/hc/en-us/articles/360045394134-What-are-Swan-Bitcoin-s-fees",
        accessed: "2026-10-15",
      },
      {
        label: "Swan withdrawal FAQ",
        url: "https://help.swanbitcoin.com/hc/en-us/articles/360051178073-How-much-does-Swan-charge-to-withdraw-Bitcoin",
        accessed: "2026-10-15",
      },
    ],
    notes: "Jul–Sep 2026 0.50% promo ended; table uses standard 1%. Without auto-withdraw, add ~0.03%/mo custody.",
  },
  {
    id: "coinbase",
    name: "Coinbase",
    website: "https://www.coinbase.com",
    buyFeePct: 0.0149,
    spreadEstimatePct: 0.005,
    spreadConfidence: "estimate",
    firstBuyPaysStandardFee: false,
    standardBuyFeePct: 0.0149,
    fundingNotes: "ACH to Primary Balance then Simple Buy / Recurring; Advanced Trade has separate maker/taker schedule.",
    withdrawalBtc: "Network fee estimate at withdrawal; Lightning send = 0.2% processing fee.",
    custodyNotes: "Hosted custody free; not a self-custody product.",
    custodyMonthlyPct: 0,
    pathModeled: "Simple/recurring buy path (retail default) — fee+spread ESTIMATED from public disclosures.",
    sources: [
      {
        label: "Coinbase pricing & fees disclosures",
        url: "https://help.coinbase.com/en/coinbase/trading-and-funding/pricing-and-fees/fees",
        accessed: "2026-10-15",
      },
      {
        label: "Coinbase Advanced fees",
        url: "https://help.coinbase.com/en/coinbase/trading-and-funding/advanced-trade/advanced-trade-fees",
        accessed: "2026-10-15",
      },
    ],
    notes: "Coinbase no longer publishes a fixed Simple Buy % — shown at order preview. 1.49% + ~0.5% spread is an ESTIMATE for small ACH buys; verify in-app. Advanced Trade can be cheaper.",
  },
  {
    id: "kraken",
    name: "Kraken",
    website: "https://www.kraken.com",
    buyFeePct: 0.01,
    spreadEstimatePct: 0.005,
    spreadConfidence: "estimate",
    firstBuyPaysStandardFee: false,
    standardBuyFeePct: 0.01,
    fundingNotes: "Plaid ACH Instant Buy (no funding fee); recurring orders available on Kraken app (not Pro).",
    withdrawalBtc: "Crypto withdrawal fees shown at confirm; USD ACH withdrawals free.",
    custodyNotes: "Exchange custody; Pro order book available for lower fees at volume.",
    custodyMonthlyPct: 0,
    pathModeled: "Kraken Instant/Recurring Buy at 1% trading fee + estimated spread (not Pro spot).",
    sources: [
      {
        label: "Kraken fee schedule",
        url: "https://www.kraken.com/features/fee-schedule",
        accessed: "2026-10-15",
      },
      {
        label: "Kraken recurring orders",
        url: "https://support.kraken.com/articles/recurring-orders",
        accessed: "2026-10-15",
      },
    ],
    notes: "1% documented on instant/recurring. Spread is variable — 0.5% ESTIMATE. Kraken+ waives trading fee up to $10k/mo but spreads still apply. Pro spot starts ~0.40%/0.80% maker/taker.",
  },
  {
    id: "cashapp",
    name: "Cash App",
    website: "https://cash.app/bitcoin",
    buyFeePct: 0,
    spreadEstimatePct: 0,
    spreadConfidence: "documented",
    firstBuyPaysStandardFee: false,
    standardBuyFeePct: 0.02,
    fundingNotes: "Auto Invest / recurring: 0% fee & 0% spread. Market buys $1–499 are 2.0%.",
    withdrawalBtc: "Standard on-chain withdraw free (min ₿0.001 / 100k sats); Rush/Priority may fee.",
    custodyNotes: "Custodial; Bitkey pairing for self-custody path. Lightning available (not NY).",
    custodyMonthlyPct: 0,
    pathModeled: "Auto Invest / Auto Buy / Round Ups only — documented 0% fee & 0% spread (NOT Market Buy).",
    sources: [
      {
        label: "Cash App bitcoin fees",
        url: "https://cash.app/bitcoin/fees",
        accessed: "2026-10-15",
      },
      {
        label: "Cash App fee/withdrawal update (2026-02-09)",
        url: "https://cash.app/press/cash-bitcoin-updates-fees-withdrawals",
        accessed: "2026-10-15",
      },
    ],
    notes: "Modeled path is Auto Invest / Auto Buy / Round Ups / Paid in Bitcoin only — Cash App's fee page (accessed 2026-10-15) states zero fees and zero spread on that path. Market Buy at $1–$499 is 2.0% plus a possible 0–0.75% spread and is NOT what this row models. Do not compare Market Buy numbers to this Auto Invest figure.",
  },
];
