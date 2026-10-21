/**
 * Bitcoin withdrawal (send-to-self-custody) fees by platform.
 * Verified 2026-10-21 (America/New_York) from each platform's public pages.
 * "documented" = stated on the platform's own page. "estimate"/"varies" = not a fixed published number.
 */
export const WITHDRAWALS_VERIFIED = "2026-10-21";
export const WITHDRAWALS_SLUG = "bitcoin-withdrawal-fees";

export interface WithdrawalPolicy {
  platformId: string;
  /** Short headline for the table. */
  headline: string;
  /** Is there a documented zero-fee way to withdraw on-chain? */
  freeOnchainPath: "yes" | "limited" | "no";
  freePathDetail: string;
  paidPathDetail: string;
  lightning: string;
  minimum: string;
  confidence: "documented" | "varies";
  tip: string;
  sources: { label: string; url: string }[];
}

export const withdrawals: WithdrawalPolicy[] = [
  {
    platformId: "swan",
    headline: "Free — Swan covers miner fees",
    freeOnchainPath: "yes",
    freePathDetail: "All BTC and USD withdrawals are complimentary; Swan's custody partner pays the miner fee. Auto-withdrawal is also free.",
    paidPathDetail: "None documented.",
    lightning: "Not covered on Swan's fee pages.",
    minimum: "Not stated on fee FAQ.",
    confidence: "documented",
    tip: "Turn on auto-withdrawal: it is free and also waives the 0.03%/mo Swan Safe custody fee.",
    sources: [
      { label: "Swan withdrawal FAQ", url: "https://help.swanbitcoin.com/hc/en-us/articles/360051178073-How-much-does-Swan-charge-to-withdraw-Bitcoin" },
      { label: "Swan fees FAQ", url: "https://help.swanbitcoin.com/hc/en-us/articles/360045394134-What-are-Swan-Bitcoin-s-fees" },
    ],
  },
  {
    platformId: "strike",
    headline: "Free on 'Flexible' (~24h) speed",
    freeOnchainPath: "yes",
    freePathDetail: "On-chain sends at Flexible speed (~24 hours) carry no on-chain fee — Strike covers it. Auto-withdrawals use the Flexible tier and are free.",
    paidPathDetail: "Priority (~10 min) and Standard (~1 hour) charge an on-chain fee shown before you confirm.",
    lightning: "Supported; Strike passes through a small routing fee with no extra charge.",
    minimum: "Auto-withdrawal threshold: 1,000,000 sats (₿0.01) minimum.",
    confidence: "documented",
    tip: "Pick Flexible speed or set an auto-withdrawal threshold. Send from your bitcoin balance, not your cash balance — sending from cash applies a 1% conversion spread.",
    sources: [
      { label: "Strike: fees and rates for bitcoin transactions", url: "https://strike.me/faq/what-fees-and-rates-apply-to-bitcoin-transactions/" },
      { label: "Strike: how do I send cash or bitcoin?", url: "https://strike.me/support/how-do-i-send-cash-or-bitcoin/" },
      { label: "Strike: bitcoin auto-withdrawals", url: "https://strike.me/faq/what-are-bitcoin-auto-withdrawals/" },
    ],
  },
  {
    platformId: "cashapp",
    headline: "Free at standard speed",
    freeOnchainPath: "yes",
    freePathDetail: "No fee to withdraw bitcoin at standard speed; completes in 24 hours or less.",
    paidPathDetail: "Faster speeds, where offered in-app, may carry a fee shown before you confirm (not itemized on the public fee page).",
    lightning: "Cash App states it charges no Lightning Network fees (Lightning not available in New York).",
    minimum: "Standard on-chain minimum 100,000 sats (₿0.001).",
    confidence: "documented",
    tip: "Batch until you are above the 100k-sat minimum and use standard speed.",
    sources: [
      { label: "Cash App bitcoin fees", url: "https://cash.app/bitcoin/fees" },
    ],
  },
  {
    platformId: "river",
    headline: "1 free send per month",
    freeOnchainPath: "limited",
    freePathDetail: "Each client gets one free on-chain send per month (available on the 1st; may take up to 24 hours).",
    paidPathDetail: "Additional sends pay a network fee by speed (Standard or Priority).",
    lightning: "Not covered on the cited River pages; check in-app.",
    minimum: "No send limit stated; only settled bitcoin past the holding period can be sent.",
    confidence: "documented",
    tip: "DCA weekly, withdraw monthly using the free send.",
    sources: [
      { label: "River: choosing transaction fees when sending", url: "https://support.river.com/hc/en-us/articles/45801155517843-Can-I-choose-my-transaction-fees-when-sending-bitcoin" },
      { label: "River: account limits", url: "https://support.river.com/hc/en-us/articles/50081107902611-What-are-my-account-limits" },
    ],
  },
  {
    platformId: "kraken",
    headline: "Flat fee ₿0.000015 on-chain",
    freeOnchainPath: "no",
    freePathDetail: "No free on-chain path documented.",
    paidPathDetail: "Published BTC on-chain withdrawal fee ₿0.00001500 (1,500 sats), minimum ₿0.000218. Kraken says fees can change; the fee at confirmation is final.",
    lightning: "Lightning withdrawals supported (fee shown at confirm).",
    minimum: "₿0.000218 on-chain (per Kraken's table on 2026-10-21).",
    confidence: "documented",
    tip: "Fewer, larger withdrawals keep the flat fee small as a % of what you move. ACH/Plaid purchases trigger a temporary withdrawal hold.",
    sources: [
      { label: "Kraken crypto withdrawal fees & minimums", url: "https://support.kraken.com/articles/360000767986-cryptocurrency-withdrawal-fees-and-minimums" },
      { label: "Kraken: how to withdraw crypto", url: "https://support.kraken.com/articles/360000672763-how-to-withdraw-cryptocurrencies-from-your-kraken-account" },
    ],
  },
  {
    platformId: "coinbase",
    headline: "Network-fee estimate (varies)",
    freeOnchainPath: "no",
    freePathDetail: "No free on-chain path documented.",
    paidPathDetail: "Coinbase charges its estimate of the prevailing network fee for a standalone send; it may exceed what Coinbase actually pays when it batches. Shown at send.",
    lightning: "Lightning sends carry a 0.2% processing fee.",
    minimum: "Not published on the fee disclosure page.",
    confidence: "varies",
    tip: "Check the fee at send and batch withdrawals. On larger amounts, 0.2% Lightning can cost more than on-chain.",
    sources: [
      { label: "Coinbase pricing & fees disclosures", url: "https://help.coinbase.com/en/coinbase/trading-and-funding/pricing-and-fees/fees" },
    ],
  },
];
