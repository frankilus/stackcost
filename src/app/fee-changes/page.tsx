import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { feeChanges, platformName } from "@/lib/feeChanges";

export const metadata: Metadata = {
  title: "Bitcoin DCA Fee Change Log — StackCost",
  description: "Dated public log of fee, spread, and policy changes for Strike, River, Swan, Coinbase, Kraken, and Cash App bitcoin recurring buys.",
  alternates: { canonical: "/fee-changes" },
};

const label: Record<string, string> = {
  baseline: "Baseline verification", "fee-change": "Fee change", "spread-change": "Spread change",
  "policy-change": "Policy change", "no-change": "Re-checked, no change",
};

export default function FeeChangesPage() {
  const byDate = feeChanges.reduce<Record<string, typeof feeChanges>>((acc, e) => ((acc[e.date] ??= []).push(e), acc), {});
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm text-zinc-500"><Link href="/" className="text-amber-400 hover:underline">StackCost</Link> / Fee change log</p>
      <h1 className="mt-3 text-3xl font-bold text-zinc-50">Fee change log</h1>
      <p className="mt-3 text-zinc-400">Every dated fee, spread, and policy note we record for the platforms we track. We re-check weekly. Entries cite the public source checked that day. Dates are ET.</p>
      {Object.entries(byDate).map(([date, entries]) => (
        <section key={date} className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-100"><time dateTime={date}>{date}</time></h2>
          <ul className="mt-4 space-y-4">
            {entries.map((e) => (
              <li key={e.platformId + e.type + e.summary} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium text-zinc-100">{platformName(e.platformId)}</span>
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">{label[e.type] ?? e.type}</span>
                </div>
                <p className="mt-2 text-sm text-zinc-400">{e.summary}</p>
                <a href={e.source} rel="nofollow noopener" target="_blank" className="mt-2 inline-block text-xs text-amber-400 hover:underline">Source →</a>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section id="alerts" className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-xl font-semibold text-zinc-50">Get alerted when fees change.</h2>
        <p className="mt-2 text-sm text-zinc-400">One email when a tracked fee or spread moves. Unsubscribe anytime.</p>
        <div className="mt-5 max-w-lg"><NewsletterForm /></div>
      </section>
      <p className="mt-8 text-xs text-zinc-500">Not financial advice. See <Link href="/methodology" className="text-amber-400 hover:underline">methodology</Link> and the <Link href="/costs/cheapest-bitcoin-dca-us" className="text-amber-400 hover:underline">cheapest DCA ranking</Link>.</p>
    </article>
  );
}
