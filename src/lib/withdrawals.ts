/**
 * Bitcoin withdrawal (send-to-self-custody) fees by platform.
 * Re-verified 2026-11-16 (America/New_York) from each platform's public pages.
 * "documented" = stated on the platform's own page. "estimate"/"varies" = not a fixed published number.
 */
export const WITHDRAWALS_VERIFIED = "2026-11-16";
export const WITHDRAWALS_SLUG = "bitcoin-withdrawal-fees";

export interface WithdrawalPolicy {
  platformId: string;
  /** Longtail slug: /costs/{slug} */
  slug: string;
  /** 1 = cheapest documented path to self-custody. Ties broken by doc order. */
  rank: number;
  /** One-line answer to "how much does X charge to withdraw bitcoin?" */
  answer: string;
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
    slug: "swan-bitcoin-withdrawal-fee",
    rank: 1,
    answer: "Nothing. Swan states BTC withdrawals are complimentary and its custody partner pays the miner fee, including on auto-withdrawals.",
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
    slug: "strike-bitcoin-withdrawal-fee",
    rank: 2,
    answer: "Zero on-chain fee at Flexible speed (~24 hours) and on auto-withdrawals; Priority (~10 min) and Standard (~1 hour) carry an on-chain fee shown before you confirm.",
    headline: "Free on 'Flexible' (~24h) speed",
    freeOnchainPath: "yes",
    freePathDetail: "On-chain sends at Flexible speed (~24 hours) carry no on-chain fee — Strike covers it. Auto-withdrawals use the Flexible tier and are free.",
    paidPathDetail: "Priority (~10 min) and Standard (~1 hour) charge an on-chain fee shown before you confirm.",
    lightning: "Supported; Strike passes through a small routing fee with no extra charge.",
    minimum: "Auto-withdrawal threshold 1,000,000 sats (₿0.01) to 500,000,000 sats (₿5). No manual on-chain minimum stated.",
    confidence: "documented",
    tip: "Pick Flexible speed or set an auto-withdrawal threshold. Send from your bitcoin balance, not your cash balance — sending from cash applies a 1% conversion spread.",
    sources: [
            { label: "Strike: how do I send cash or bitcoin?", url: "https://strike.me/support/how-do-i-send-cash-or-bitcoin/" },
      { label: "Strike: how do I withdraw bitcoin? (auto-withdrawals)", url: "https://strike.me/support/how-do-i-withdraw-bitcoin/" },
    ],
  },
  {
    platformId: "cashapp",
    slug: "cash-app-bitcoin-withdrawal-fee",
    rank: 3,
    answer: "Free at standard speed (24 hours or less) with a 100,000-sat (₿0.001) minimum. Cash App also charges no Lightning fees.",
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
    slug: "river-bitcoin-withdrawal-fee",
    rank: 4,
    answer: "One free standard on-chain send per month; additional sends pay River's network-fee estimate for the speed you choose (Standard or Priority).",
    headline: "1 free send per month",
    freeOnchainPath: "limited",
    freePathDetail: "Each client gets one free standard on-chain send per month, available on the 1st. Standard sends are batched and estimated to complete in about 4 hours.",
    paidPathDetail: "Additional sends pay River's estimate of the network fee for the speed you pick: Standard (batched, ~4h) or Priority (~1h, costs more).",
    lightning: "Not covered on the cited River pages; check in-app.",
    minimum: "No send limit stated; only bitcoin past the holding period can be sent (ForceField accounts have a weekly cap).",
    confidence: "documented",
    tip: "DCA weekly, withdraw monthly using the free send.",
    sources: [
      { label: "River: choosing transaction fees when sending", url: "https://support.river.com/hc/en-us/articles/45801155517843-Can-I-choose-my-transaction-fees-when-sending-bitcoin" },
      { label: "River: account limits", url: "https://support.river.com/hc/en-us/articles/50081107902611-What-are-my-account-limits" },
    ],
  },
  {
    platformId: "kraken",
    slug: "kraken-bitcoin-withdrawal-fee",
    rank: 6,
    answer: "A flat ₿0.000015 (1,500 sats) per on-chain BTC withdrawal, with a ₿0.000218 minimum, per Kraken's published table. Lightning: 0 + 0.1%.",
    headline: "Flat fee ₿0.000015 on-chain",
    freeOnchainPath: "no",
    freePathDetail: "No free on-chain path documented.",
    paidPathDetail: "Published BTC on-chain withdrawal fee ₿0.00001500 (1,500 sats), minimum ₿0.000218. Kraken says fees can change; the fee at confirmation is final.",
    lightning: "Supported. Kraken's table lists Bitcoin (Lightning) at 0 + 0.1% with a ₿0.00001 minimum.",
    minimum: "₿0.000218 on-chain (including fee) per Kraken's table, checked 2026-11-16.",
    confidence: "documented",
    tip: "Fewer, larger withdrawals keep the flat fee small as a % of what you move. ACH/Plaid purchases trigger a temporary withdrawal hold.",
    sources: [
      { label: "Kraken crypto withdrawal fees & minimums", url: "https://support.kraken.com/articles/360000767986-cryptocurrency-withdrawal-fees-and-minimums" },
      { label: "Kraken: how to withdraw crypto", url: "https://support.kraken.com/articles/360000672763-how-to-withdraw-cryptocurrencies-from-your-kraken-account" },
    ],
  },
  {
    platformId: "coinbase",
    slug: "coinbase-bitcoin-withdrawal-fee",
    rank: 9,
    answer: "Coinbase charges its estimate of the prevailing network fee for a standalone send (varies, shown at send). Lightning sends cost 0.2% of the amount.",
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
  {
    platformId: "robinhood",
    slug: "robinhood-bitcoin-withdrawal-fee",
    rank: 7,
    answer: "Robinhood charges $0 itself, but every transfer pays a Bitcoin network fee that varies with network activity. No fixed number is published.",
    headline: "$0 Robinhood fee + network fee",
    freeOnchainPath: "no",
    freePathDetail: "No free on-chain path documented. Robinhood itself charges nothing for transfers.",
    paidPathDetail: "Every crypto transfer pays a blockchain network fee that varies with network activity.",
    lightning: "Not covered on the cited Robinhood pages.",
    minimum: "Not stated on the fee schedule.",
    confidence: "varies",
    tip: "Batch withdrawals so the network fee is a smaller share of what you move.",
    sources: [
      { label: "Robinhood Crypto fee schedule (PDF)", url: "https://cdn.robinhood.com/assets/robinhood/legal/rhc-fee-schedule.pdf" },
    ],
  },
  {
    platformId: "paypal",
    slug: "paypal-bitcoin-withdrawal-fee",
    rank: 8,
    answer: "No PayPal fee, but sending to an outside address pays a variable crypto network fee shown right before you transfer. No fixed number is published.",
    headline: "Network fee (varies); no PayPal fee",
    freeOnchainPath: "no",
    freePathDetail: "No free external path documented. Transfers to other PayPal or Venmo crypto accounts are free.",
    paidPathDetail: "Sending to an address outside PayPal/Venmo pays a variable crypto network fee, shown right before you transfer.",
    lightning: "Not covered on PayPal's fee page.",
    minimum: "Not stated on the fee page.",
    confidence: "varies",
    tip: "Venmo uses the same rule. Check the network fee on the confirm screen and batch transfers.",
    sources: [
      { label: "PayPal consumer fees", url: "https://www.paypal.com/us/digital-wallet/paypal-consumer-fees" },
      { label: "Venmo fees", url: "https://venmo.com/resources/our-fees/" },
    ],
  },
  {
    platformId: "fold",
    slug: "fold-bitcoin-withdrawal-fee",
    rank: 5,
    answer: "Fold charges no withdrawal fee of its own. Without a $5,000+ Reserve balance you pay the third-party network fee; with Reserve, Fold pays it up to in-app limits.",
    headline: "No Fold fee; network fee varies (Fold pays it with Reserve)",
    freeOnchainPath: "limited",
    freePathDetail: "Fold charges no bitcoin withdrawal fee. With a $5,000+ Reserve balance Fold also pays the network fee on on-chain withdrawals, up to limits shown in the app.",
    paidPathDetail: "Without a Reserve balance, the third-party network fee applies (charged by the network, not Fold).",
    lightning: "Not covered on the cited Fold pages.",
    minimum: "Not stated on the cited pages.",
    confidence: "documented",
    tip: "The fee-free path depends on holding $5,000+ in Reserve; otherwise batch withdrawals to dilute the network fee.",
    sources: [
      { label: "Fold: Getting back to what we do best", url: "https://blog.foldapp.com/getting-back-to-what-we-do-best" },
      { label: "Fold: No Transaction Fees. No Added Spread.", url: "https://foldapp.com/blog/no-transaction-fees-no-added-spread-just-bitcoin" },
    ],
  },
];

export const withdrawalsRanked = [...withdrawals].sort((a, b) => a.rank - b.rank);
export function getWithdrawalBySlug(slug: string) {
  return withdrawals.find((w) => w.slug === slug);
}
export function getWithdrawalByPlatform(platformId: string) {
  return withdrawals.find((w) => w.platformId === platformId);
}
