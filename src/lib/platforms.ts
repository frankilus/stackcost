/**
 * StackCost platform fee data — US-focused DCA comparison.
 * lastUpdated: 2026-10-26 (America/New_York). River spread corrected to documented ~0.25% typical (estimate); others re-verified 2026-10-26 (no changes).
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
  /** Optional per-order fee tiers (ascending maxUsd). When set, overrides buyFeePct/standardBuyFeePct by order size. */
  buyFeeTiers?: { maxUsd: number; pct: number }[];
  fundingNotes: string;
  withdrawalBtc: string;
  custodyNotes: string;
  /** Monthly custody as % of AOP (0 if waived under our modeled path). */
  custodyMonthlyPct: number;
  pathModeled: string;
  sources: { label: string; url: string; accessed: string }[];
  notes: string;
}

export const LAST_UPDATED = "2026-10-26";
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
    withdrawalBtc: "On-chain free at Flexible speed (~24h) and via auto-withdrawal; Priority/Standard speeds pay an on-chain fee shown at send. Lightning: small pass-through routing fee.",
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
    spreadEstimatePct: 0.0025,
    spreadConfidence: "estimate",
    firstBuyPaysStandardFee: true,
    standardBuyFeePct: 0.01,
    fundingNotes: "ACH; free recurring buys from 2nd weekly order; free payroll conversion up to $30k/mo.",
    withdrawalBtc: "1 free on-chain send/month; additional sends pay network fee by speed.",
    custodyNotes: "Full-reserve cold storage; monthly Proof of Reserves; no client BTC lending.",
    custodyMonthlyPct: 0,
    pathModeled: "Weekly recurring buys — zero fee from 2nd order; ~0.25% typical buy spread ESTIMATE on every buy; assume free monthly withdraw.",
    sources: [
      {
        label: "River fees help article",
        url: "https://support.river.com/hc/en-us/articles/50055900679315-What-are-River-s-fees",
        accessed: "2026-10-26",
      },
      {
        label: "River: Does River charge a spread?",
        url: "https://support.river.com/hc/en-us/articles/45688848337811-Does-River-charge-a-spread",
        accessed: "2026-10-26",
      },
      {
        label: "River Proof of Reserves",
        url: "https://river.com/reserves",
        accessed: "2026-10-15",
      },
    ],
    notes: "Recurring-buy fee waiver is separate from spread. River's help center states buy orders include a spread that 'typically falls around 0.25%' (sells ~0.50%), varying with market conditions and shown before you confirm. We model 0.25% as an ESTIMATE on every purchase, plus the 1.00% standard fee on the first weekly buy only. Instant cash (USD) withdrawals cost 1% ($1 min, $150 max); standard cash withdrawals are free.",
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
    withdrawalBtc: "BTC on-chain withdrawal fee ₿0.000015 per Kraken's published table (min ₿0.000218), final fee shown at confirm; USD ACH withdrawals free.",
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
    withdrawalBtc: "Standard-speed on-chain withdraw free (min 100k sats / ₿0.001); any faster option shows its fee before you confirm. No Lightning fees.",
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
  {
    id: "robinhood",
    name: "Robinhood",
    website: "https://robinhood.com/us/en/crypto/",
    buyFeePct: 0,
    spreadEstimatePct: 0.0095,
    spreadConfidence: "estimate",
    firstBuyPaysStandardFee: false,
    standardBuyFeePct: 0,
    fundingNotes: "Recurring crypto orders funded by buying power or linked bank. Default in-app routing is market maker routing: no commission, cost is in the spread.",
    withdrawalBtc: "Robinhood charges $0 for crypto transfers; the Bitcoin network fee still applies and varies.",
    custodyNotes: "Custodial (Robinhood Crypto); no custody fee.",
    custodyMonthlyPct: 0,
    pathModeled: "Recurring BTC buy on default market maker routing: $0 commission + ~0.95% spread ESTIMATE (floor from Robinhood's disclosed 0.95% market-maker payment, which is included in the spread).",
    sources: [
      {
        label: "Robinhood crypto order routing (0.95% market-maker payment disclosure)",
        url: "https://robinhood.com/us/en/support/articles/crypto-order-routing/",
        accessed: "2026-10-21",
      },
      {
        label: "Robinhood Crypto fee schedule (PDF)",
        url: "https://cdn.robinhood.com/assets/robinhood/legal/rhc-fee-schedule.pdf",
        accessed: "2026-10-21",
      },
      {
        label: "Robinhood recurring investments",
        url: "https://robinhood.com/us/en/support/articles/recurring-investments/",
        accessed: "2026-10-21",
      },
    ],
    notes: "Robinhood's order-routing page states that, as of June 15, 2026, Robinhood Crypto receives $0.95 per $100 of market-maker-routed crypto volume, and that this amount is included in the spread (its example: a 0.96% buy spread, of which Robinhood gets $0.95). So the buy spread is at least ~0.95%. We model 0.95% as an ESTIMATE; the real spread can be higher, especially in volatile markets. Alternative: exchange routing charges an explicit fee (0.95% taker at $0–$10K 30-day volume) plus the exchange's market spread, so it is not cheaper at $100/week. Recurring orders are placed as limits collared up to 1% above last trade.",
  },
  {
    id: "paypal",
    name: "PayPal",
    website: "https://www.paypal.com/us/digital-wallet/manage-money/crypto",
    buyFeePct: 0.02,
    spreadEstimatePct: 0.01,
    spreadConfidence: "estimate",
    firstBuyPaysStandardFee: false,
    standardBuyFeePct: 0.02,
    buyFeeTiers: [
      { maxUsd: 74.99, pct: 0.022 },
      { maxUsd: 200, pct: 0.02 },
      { maxUsd: 1000, pct: 0.018 },
      { maxUsd: Infinity, pct: 0.015 },
    ],
    fundingNotes: "Recurring Buy (daily/weekly/biweekly/monthly) from a linked bank, debit card or PayPal balance. Tiered fee: 2.00% on $75.00–$200.00 buys (2.20% under $75).",
    withdrawalBtc: "No PayPal fee to send to an external address, but a variable crypto network fee is charged (shown before you transfer).",
    custodyNotes: "Custodial (PayPal Digital, Inc.); no fee for holding crypto.",
    custodyMonthlyPct: 0,
    pathModeled: "Weekly Recurring Buy of $100: documented 2.00% fee + 1.00% spread ESTIMATE (PayPal's own stated estimate). Venmo uses the same fee table (see notes).",
    sources: [
      {
        label: "PayPal consumer fees (crypto buy/sell table)",
        url: "https://www.paypal.com/us/digital-wallet/paypal-consumer-fees",
        accessed: "2026-10-21",
      },
      {
        label: "PayPal Cryptocurrency Terms (Recurring Buys; 'estimated spread of one percent')",
        url: "https://www.paypal.com/us/legalhub/paypal/cryptocurrencies-tnc",
        accessed: "2026-10-21",
      },
      {
        label: "Venmo fees (same crypto fee table)",
        url: "https://venmo.com/resources/our-fees/",
        accessed: "2026-10-21",
      },
    ],
    notes: "PayPal's crypto terms say each Recurring Buy includes a transaction fee and an exchange rate including PayPal's spread, and that 'the exchange rate will include an estimated spread of one percent (1.00%)… the actual spread may be higher or lower based on market conditions.' We use that 1.00% as an ESTIMATE. The 2.00% fee is documented for $75–$200 orders. Venmo: crypto on Venmo is also run by PayPal Digital (dba Venmo Digital) and Venmo's fee page lists the identical 2.20% / 2.00% / 1.80% / 1.50% table, so we model this once. Venmo's help pages document no general recurring Bitcoin buy (only Cash Back to Crypto for Venmo Credit Card rewards), so Venmo is not ranked as a separate DCA path.",
  },
];
