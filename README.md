# StackCost

Living comparison of the **true all-in cost** to DCA Bitcoin by platform (US-first), plus fee-change email alerts.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Newsletter: Resend Contacts → segment `StackCost Fee Alerts`
- Deploy: Vercel (`https://stackcost-pink.vercel.app`)

## Local

```bash
npm install
cp .env.example .env.local   # optional RESEND_API_KEY
npm run dev
```

## Env

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Store newsletter signups in Resend (free tier). Without it, `/api/subscribe` stubs successfully. |
| `RESEND_SEGMENT_ID` | Optional; defaults to StackCost Fee Alerts segment. |

## Pages

- `/` — full platform table ($100/wk scenario)
- `/compare` — index of 15 head-to-head pairs
- `/compare/{a}-vs-{b}` — all-in at $25 / $100 / $500 weekly for 1 year
- `/methodology` — formula + verified date stamp
- `/sitemap.xml`, `/robots.txt` — crawl discovery

Fee seeds: `src/lib/platforms.ts`. Calc: `src/lib/calc.ts`. Pairs: `src/lib/compares.ts`.

## Disclaimer

Not financial advice. Fees change. Verify with each platform. Affiliate disclosure is shown site-wide; no live affiliate links yet.
