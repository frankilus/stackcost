import Link from "next/link";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { SITE_URL } from "@/lib/compares";
import { LAST_UPDATED, platforms } from "@/lib/platforms";
import { CalculatorClient } from "./CalculatorClient";

const title = "Bitcoin DCA Fee Calculator — Yearly All-In Cost by Platform";
const description = `Enter any weekly or monthly Bitcoin DCA amount and see the yearly all-in cost (buy fees + spread + first-buy fee + custody) on ${platforms.length} US platforms, ranked. Same formula as our methodology. Updated ${LAST_UPDATED}.`;

export const metadata: Metadata = {
  title: `${title} | StackCost`,
  description,
  alternates: { canonical: `${SITE_URL}/calculator` },
  openGraph: { title, description, url: `${SITE_URL}/calculator`, type: "website" },
};

export default function CalculatorPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <nav className="text-sm text-zinc-500">
        <Link href="/" className="text-amber-400 hover:underline">StackCost</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-400">Calculator</span>
      </nav>
      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-500/90">DCA calculator · Data reviewed {LAST_UPDATED}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">Bitcoin DCA fee calculator</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-300">
          Enter how much you buy and how often. We rank every platform by what a year of recurring buys costs you all-in:
          buy fees, spread, the standard fee on the first buy where it applies, and custody. Spreads marked
          &ldquo;estimate&rdquo; are our estimates from each platform&rsquo;s disclosures.
        </p>
      </header>
      <div className="mt-6"><AffiliateDisclosure /></div>
      <CalculatorClient />
      <p className="mt-3 text-xs text-zinc-500">
        Weekly = 52 buys; monthly = 12 buys. Same cost functions as every other page on StackCost (see{" "}
        <Link href="/methodology" className="text-amber-400 hover:underline">methodology</Link>). Withdrawal and miner fees are excluded; see{" "}
        <Link href="/costs/bitcoin-withdrawal-fees" className="text-amber-400 hover:underline">Bitcoin withdrawal fees</Link>. Track changes on the{" "}
        <Link href="/fee-changes" className="text-amber-400 hover:underline">fee change log</Link>. Not financial advice.
      </p>
    </article>
  );
}
