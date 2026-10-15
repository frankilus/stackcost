# StackCost

Living comparison of the **true all-in cost** to DCA Bitcoin by platform (US-first), plus fee-change email alerts.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Newsletter: Resend Contacts → segment `StackCost Fee Alerts`
- Deploy: Vercel

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

## Methodology

See `/methodology` and `src/lib/calc.ts`. Fee seeds live in `src/lib/platforms.ts` with source URLs.

## Disclaimer

Not financial advice. Fees change. Verify with each platform.
