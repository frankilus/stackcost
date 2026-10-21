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
      "Cash App's fee depends entirely on how you buy. Per Cash App's fee page (accessed 2026-10-15), Auto Invest, Round Ups, Paid in Bitcoin, and buys over $2,000 are 0% fee and 0% spread. One-off Market Buys of $1–$499 cost 2.0% plus a possible 0–0.75% spread. StackCost models Auto Invest only — Market Buy is a different, much more expensive path.",
    gotchas: [
      "Market Buy at $1–$499 is 2.0% plus possible 0–0.75% spread — using it instead of Auto Invest is one of the most expensive ways to DCA.",
      "Our $0 all-in figure applies ONLY to Auto Invest / Auto Buy / Round Ups / Paid in Bitcoin — not to one-off Market Buys.",
      "Standard-speed on-chain withdrawals are free above the 100k-sat (₿0.001) minimum per Cash App's fee page; any faster option shows its fee before you confirm.",
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
        a: "Per Cash App's fee page, standard-speed withdrawals are free (minimum 100,000 sats / ₿0.001) and complete within 24 hours. Any faster option shows its fee before you confirm.",
      },
      {
        q: "Is Cash App the cheapest way to DCA Bitcoin?",
        a: "On the Auto Invest / Auto Buy path (0% fee and 0% spread per Cash App's fee page), Cash App is the lowest modeled cost in our $100/week comparison. Market Buy is much more expensive — do not confuse the two paths.",
      },
    ],
  },
  {
    slug: "strike-bitcoin-fees",
    platformId: "strike",
    title: "Strike Bitcoin Fees (2026): True Cost of Recurring Buys",
    h1: "Strike Bitcoin fees in 2026 — the true cost",
    intro:
      "Strike waives the trading fee on recurring purchases for personal accounts after the first weekly buy (0.89% at low volume on that first buy). Separately, Strike's fee FAQ states it targets an all-in spread of ~0.22% on buys and sells — the fee waiver does not remove that spread. We model both.",
    gotchas: [
      "Your first recurring purchase pays the standard tiered trading fee (0.89% at low volume).",
      "The recurring trading-fee waiver does NOT remove spread — Strike targets ~0.22% all-in spread on every buy/sell (actual may vary; ESTIMATE).",
      "One-time buys are fully tiered and not fee-free — the waiver applies only to recurring purchases.",
      "On-chain withdrawals are free at Flexible speed (~24h) and via auto-withdrawal; Priority/Standard speeds pay an on-chain fee shown at send.",
    ],
    cheaperPath:
      "Set up a weekly recurring purchase rather than manual one-time buys (to get the trading-fee waiver after week 1), and withdraw at the free Flexible speed (or set an auto-withdrawal) to avoid on-chain fees. Expect the ~0.22% target spread on each fill.",
    faqs: [
      {
        q: "Does Strike charge fees on recurring Bitcoin buys?",
        a: "Strike states personal accounts pay zero trading fees on recurring purchases after the first week. The first buy pays the standard fee (0.89% at low volume). Spread is separate — see below.",
      },
      {
        q: "What are Strike's one-time buy fees?",
        a: "One-time buys use a tiered schedule starting at 0.89% at low monthly volume (≤$4,999.99).",
      },
      {
        q: "Does Strike have a spread?",
        a: "Yes. Strike's trading-fees FAQ (accessed 2026-10-15) states: 'Strike targets an all-in spread of 0.22%.' The actual spread may be higher or lower and is reflected in the quoted buy/sell price. The recurring trading-fee waiver does not eliminate this spread. We model 0.22% as an ESTIMATE on every purchase.",
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
  {
    slug: "robinhood-bitcoin-fees",
    platformId: "robinhood",
    title: "Robinhood Bitcoin Fees (2026): True Cost of Recurring Crypto Buys",
    h1: "Robinhood Bitcoin fees in 2026 — the true cost",
    intro:
      "Robinhood advertises no commission on crypto, but that does not mean free. On the default in-app setting (market maker routing), Robinhood says it receives $0.95 for every $100 of crypto volume from its market makers, and that this payment is included in the spread you pay. So a $100 recurring Bitcoin buy carries a spread of at least about 0.95%. We model 0.95% as an ESTIMATE.",
    gotchas: [
      "\"No commission\" on market maker routing. The cost sits in the spread: Robinhood discloses a 0.95% market-maker payment that is part of that spread (ESTIMATE floor; can be higher).",
      "Exchange routing swaps the spread markup for an explicit fee: 0.95% taker at $0–$10K 30-day volume, plus the exchange's market spread. At $100/week it is not cheaper.",
      "Recurring crypto orders run around 5:30–7:00 PM ET and are placed as limits collared up to 1% above last trade. If the price jumps more than 1%, that week's buy is skipped.",
      "Robinhood charges $0 for crypto transfers, but the Bitcoin network fee still applies.",
    ],
    cheaperPath:
      "For pure Bitcoin DCA, a platform with a free recurring path and a smaller disclosed spread (Strike's ~0.22% target, or Cash App Auto Invest at 0%) costs less than Robinhood's ~0.95%+ spread.",
    faqs: [
      {
        q: "Does Robinhood charge fees on recurring Bitcoin buys?",
        a: "On the default market maker routing there is no commission. Robinhood is paid through the spread: its order-routing page says it receives $0.95 per $100 of market-maker-routed crypto volume, included in the spread. We model that as a ~0.95% spread (ESTIMATE, a floor), about $49 a year at $100/week.",
      },
      {
        q: "What is Robinhood's crypto spread?",
        a: "Robinhood does not publish a fixed spread. Its example shows a 0.96% buy spread on a $100 order, of which Robinhood keeps $0.95. You can see the live bid/ask on the order review screen before you buy.",
      },
      {
        q: "Is exchange routing cheaper on Robinhood?",
        a: "Not at small sizes. Exchange routing charges a 0.95% taker fee at $0–$10K of 30-day volume, plus the exchange's market spread. Fees fall at higher volume tiers.",
      },
      {
        q: "Does Robinhood charge to withdraw Bitcoin?",
        a: "Robinhood's fee schedule lists $0 for crypto transfers. Every on-chain transfer still pays a network fee that varies with activity.",
      },
    ],
  },
  {
    slug: "paypal-bitcoin-fees",
    platformId: "paypal",
    title: "PayPal (and Venmo) Bitcoin Fees (2026): True Cost of Recurring Buys",
    h1: "PayPal Bitcoin fees in 2026 — the true cost",
    intro:
      "PayPal Recurring Buys pay a documented tiered fee (2.00% on a $100 buy) plus a spread that PayPal itself estimates at 1.00% in its crypto terms. That is about 3% all-in at $100/week, the most expensive path we model. Venmo uses the same fee table.",
    gotchas: [
      "Fee tiers: 2.20% on $1–$74.99, 2.00% on $75–$200, 1.80% on $200.01–$1,000, 1.50% above $1,000. Small weekly buys sit in the expensive tiers.",
      "The spread is on top of the fee. PayPal's terms state an 'estimated spread of one percent (1.00%)' that may be higher or lower, and PayPal does not disclose it per transaction (ESTIMATE).",
      "The exchange rate for future Recurring Buys is not shown when you set them up and may vary significantly.",
      "Sending BTC to an outside wallet has no PayPal fee, but a variable network fee applies.",
      "Venmo shares this fee table but documents no general recurring Bitcoin buy, only Cash Back to Crypto.",
    ],
    cheaperPath:
      "Buying less often in larger amounts lowers the fee tier (1.80% from $200.01). Either way, dedicated DCA apps with free recurring buys (Cash App Auto Invest, Strike, River) cost a fraction of PayPal's ~3%.",
    faqs: [
      {
        q: "How much does PayPal charge for recurring Bitcoin buys?",
        a: "Recurring Buys pay the same tiered fee as one-time buys: 2.00% on a $100 order (2.20% under $75). Add PayPal's estimated 1.00% spread for about 3% all-in, roughly $156 a year at $100/week.",
      },
      {
        q: "What is PayPal's crypto spread?",
        a: "PayPal's Cryptocurrency Terms say the exchange rate includes an estimated spread of 1.00%, which may be higher or lower with market conditions. PayPal does not calculate or disclose the spread on each transaction.",
      },
      {
        q: "Are Venmo's Bitcoin fees the same as PayPal's?",
        a: "Yes, the fee table matches: 2.20% / 2.00% / 1.80% / 1.50% by amount, and Venmo crypto is also run by PayPal Digital. Venmo says its exchange rate includes a spread. Venmo's help pages document no general recurring Bitcoin buy.",
      },
      {
        q: "Can I withdraw Bitcoin from PayPal?",
        a: "Yes. Transfers to an outside address have no PayPal fee, but a variable crypto network fee is charged and shown before you send.",
      },
    ],
  },
];

export function getCostPage(slug: string) {
  return costPages.find((c) => c.slug === slug);
}
