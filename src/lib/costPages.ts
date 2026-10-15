/** True-cost SEO explainer content. Fee numbers come from platforms.ts (single source of truth). */
export interface CostPage {
  slug: string;
  platformId: string;
  title: string;
  h1: string;
  intro: string;
  gotchas: string[];
  cheaperPath: string;
  faqs: { q: string; a: string }[];
}

export const HUB_SLUG = "cheapest-bitcoin-dca-us";

export const costPages: CostPage[] = [
  {
    slug: "coinbase-recurring-buy-fees",
    platformId: "coinbase",
    title: "Coinbase Recurring Buy Fees (2026): True All-In Cost of Bitcoin DCA",
    h1: "Coinbase recurring buy fees in 2026 — the true cost",
    intro:
      "Coinbase recurring buys are convenient, but the fee shown at preview is only part of the cost. Coinbase no longer publishes a fixed Simple Buy percentage, and a spread is built into the quoted price. We model ~1.49% fee + ~0.5% spread (ESTIMATE) for small ACH recurring buys.",
    gotchas: [
      "The fee is shown at order preview and can vary by amount, payment method, and region — our 1.49% figure is an estimate for small ACH buys.",
      "A spread (~0.5% estimated) is embedded in the quoted price on top of the fee.",
      "Debit card funding is typically more expensive than ACH.",
      "Lightning sends carry a 0.2% processing fee; on-chain withdrawals pay a network fee estimate.",
    ],
    cheaperPath:
      "Coinbase Advanced Trade uses a maker/taker schedule that is usually far cheaper than Simple/recurring buys, but it has no native auto-DCA on most accounts — you place orders manually.",
    faqs: [
      {
        q: "How much does Coinbase charge for recurring Bitcoin buys?",
        a: "Coinbase shows the fee at order preview rather than publishing a fixed rate. For small ACH recurring buys we model about 1.49% plus an estimated ~0.5% spread — roughly 2% all-in. Verify in-app before buying.",
      },
      {
        q: "Is Coinbase Advanced cheaper than recurring buys?",
        a: "Usually yes. Advanced Trade uses a maker/taker fee schedule with no Simple-Buy spread, but you trade manually instead of on an automatic schedule.",
      },
      {
        q: "Does Coinbase charge to withdraw Bitcoin?",
        a: "On-chain withdrawals pay a network fee estimate shown at send. Lightning sends carry a 0.2% processing fee.",
      },
    ],
  },
  {
    slug: "cash-app-bitcoin-fees",
    platformId: "cashapp",
    title: "Cash App Bitcoin Fees (2026): Auto Invest vs Market Buy True Cost",
    h1: "Cash App Bitcoin fees in 2026 — the true cost",
    intro:
      "Cash App's fee depends entirely on how you buy. Per Cash App's fee page, Auto Invest (recurring) buys are 0% fee and 0% spread, while one-off market buys of $1–$499 cost 2.0% plus a possible spread. Path matters more than platform here.",
    gotchas: [
      "Market Buy at $1–$499 is 2.0% — using it instead of Auto Invest is one of the most expensive ways to DCA.",
      "Standard on-chain withdrawals are free above the ₿0.001 (100k sats) minimum; Rush/Priority speeds can carry fees.",
      "Lightning is available but not in New York.",
      "Cash App is custodial; pairing with a self-custody wallet (e.g. Bitkey) is a separate step.",
    ],
    cheaperPath:
      "Use Auto Invest / Auto Buy instead of manual Market Buys. That is the path we model at 0% fee and 0% spread.",
    faqs: [
      {
        q: "Does Cash App charge fees on recurring Bitcoin buys?",
        a: "Per Cash App's published fee page (accessed 2026-10-15), Auto Invest recurring buys carry 0% fee and 0% spread. One-off market buys of $1–$499 are 2.0%.",
      },
      {
        q: "How much does Cash App charge to withdraw Bitcoin?",
        a: "Standard on-chain withdrawals are free with a ₿0.001 minimum. Faster Rush/Priority options may charge a fee.",
      },
      {
        q: "Is Cash App the cheapest way to DCA Bitcoin?",
        a: "On the Auto Invest path, Cash App ties for the lowest modeled cost in our comparison. See the ranking for the full picture.",
      },
    ],
  },
  {
    slug: "strike-bitcoin-fees",
    platformId: "strike",
    title: "Strike Bitcoin Fees (2026): True Cost of Recurring Buys",
    h1: "Strike Bitcoin fees in 2026 — the true cost",
    intro:
      "Strike waives the trading fee on recurring purchases for personal accounts after the first weekly buy. The first purchase pays the standard tiered fee (0.89% at low volume), so the all-in cost over a year is close to zero.",
    gotchas: [
      "Your first recurring purchase pays the standard tiered fee (0.89% at low volume).",
      "One-time buys are tiered and not free — the waiver applies to recurring purchases.",
      "On-chain withdrawals pay the network fee shown at send; Lightning is typically cheaper.",
    ],
    cheaperPath:
      "Set up a weekly recurring purchase rather than manual one-time buys, and withdraw over Lightning or in batches to minimize network fees.",
    faqs: [
      {
        q: "Does Strike charge fees on recurring Bitcoin buys?",
        a: "Strike states recurring purchases are fee-free for personal accounts after the first purchase. The first buy pays the standard fee (0.89% at low volume).",
      },
      {
        q: "What are Strike's one-time buy fees?",
        a: "One-time buys use a tiered schedule starting around 0.89% at low monthly volume.",
      },
      {
        q: "Does Strike have a spread?",
        a: "Strike documents its pricing on the fee FAQ; we model 0% spread on the recurring path based on that disclosure.",
      },
    ],
  },
  {
    slug: "river-bitcoin-fees",
    platformId: "river",
    title: "River Bitcoin Fees (2026): True Cost of Recurring Buys",
    h1: "River Bitcoin fees in 2026 — the true cost",
    intro:
      "River offers free recurring buys from the second order onward, full-reserve cold storage, and one free on-chain withdrawal per month. The first order pays the standard fee (~1%). Spread size isn't publicly fixed, so our 0% spread is labeled an estimate.",
    gotchas: [
      "The first recurring order pays the standard fee (~1% modeled).",
      "Spread on priced orders is not publicly fixed — our 0% is an ESTIMATE until measured.",
      "Only one free on-chain withdrawal per month; extra sends pay network fee by speed.",
    ],
    cheaperPath:
      "Stick to scheduled recurring buys and batch withdrawals into the one free monthly send.",
    faqs: [
      {
        q: "Are River recurring buys free?",
        a: "River states recurring buys are free from the second weekly order onward. The first order pays the standard fee.",
      },
      {
        q: "Does River charge to withdraw Bitcoin?",
        a: "River includes one free on-chain withdrawal per month; additional sends pay a network fee based on speed.",
      },
      {
        q: "Is River full reserve?",
        a: "River publishes monthly Proof of Reserves and states it does not lend client bitcoin.",
      },
    ],
  },
  {
    slug: "swan-bitcoin-fees",
    platformId: "swan",
    title: "Swan Bitcoin Fees (2026): True Cost of Recurring Buys",
    h1: "Swan Bitcoin fees in 2026 — the true cost",
    intro:
      "Swan charges a standard 1% on recurring buys (the Jul–Sep 2026 0.50% promo has ended). Withdrawals are complimentary, and the Swan Safe custody fee of 0.03%/month is waived when auto-withdrawal is enabled — which is the path we model.",
    gotchas: [
      "1% buy fee applies to every recurring purchase — no free-DCA waiver.",
      "Promo rates expire; the 0.50% Jul–Sep 2026 promo ended. Verify in-app.",
      "Without auto-withdrawal, add ~0.03%/month custody on your balance.",
    ],
    cheaperPath:
      "Enable auto-withdrawal to a self-custody wallet to avoid the Swan Safe custody fee; Swan covers miner fees on withdrawals per its FAQ.",
    faqs: [
      {
        q: "How much does Swan charge for recurring Bitcoin buys?",
        a: "Swan's standard recurring buy fee is 1% per its fee FAQ (updated 2026-09-09). Promotional rates may apply temporarily.",
      },
      {
        q: "Does Swan charge to withdraw Bitcoin?",
        a: "Swan states BTC and USD withdrawals are complimentary, with Swan covering miner fees.",
      },
      {
        q: "Does Swan charge a custody fee?",
        a: "Swan Safe is 0.03%/month of assets, waived when auto-withdrawal is enabled.",
      },
    ],
  },
  {
    slug: "kraken-recurring-buy-fees",
    platformId: "kraken",
    title: "Kraken Recurring Buy Fees (2026): True All-In Cost of Bitcoin DCA",
    h1: "Kraken recurring buy fees in 2026 — the true cost",
    intro:
      "Kraken's app charges a documented 1% on Instant and recurring buys, plus a variable spread we estimate at ~0.5%. Kraken Pro's order book is much cheaper, but recurring orders live in the Kraken app, not Pro.",
    gotchas: [
      "1% trading fee on Instant/recurring buys is documented; the ~0.5% spread is an ESTIMATE.",
      "Kraken+ waives the trading fee up to $10k/month, but spreads still apply.",
      "Crypto withdrawal fees are shown at confirm.",
    ],
    cheaperPath:
      "Kraken Pro spot trading starts around 0.40%/0.80% maker/taker with no Instant Buy spread, but you place orders manually.",
    faqs: [
      {
        q: "What does Kraken charge for recurring buys?",
        a: "Kraken documents a 1% fee on Instant and recurring buys in the Kraken app, plus a variable spread (we estimate ~0.5%).",
      },
      {
        q: "Is Kraken Pro cheaper than recurring buys?",
        a: "Yes, Pro spot fees start around 0.40% maker / 0.80% taker, but Pro doesn't offer the app's recurring buy feature.",
      },
      {
        q: "Does Kraken charge for ACH deposits?",
        a: "Plaid ACH Instant Buy has no funding fee, and USD ACH withdrawals are free.",
      },
    ],
  },
];

export function getCostPage(slug: string) {
  return costPages.find((c) => c.slug === slug);
}
