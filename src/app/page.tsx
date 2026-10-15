import { ComparisonTable } from "@/components/ComparisonTable";
import { NewsletterForm } from "@/components/NewsletterForm";
import { LAST_UPDATED, SCENARIO } from "@/lib/platforms";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.12),_transparent_55%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-amber-500/90">
            US platforms · DCA focus
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            StackCost
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-300 sm:text-xl">
            The real all-in cost to buy Bitcoin on a schedule.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500">
            Fee pages advertise buy %, but spreads, first-purchase charges, custody, and
            withdrawal friction decide what you actually keep. We model{" "}
            <span className="text-zinc-300">{SCENARIO.label}</span> with a transparent
            formula — estimates labeled, sources linked.
          </p>
          <p className="mt-6 text-xs text-zinc-600">
            Fee data last reviewed {LAST_UPDATED} (ET). Not financial advice.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#compare"
              className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400"
            >
              View comparison
            </a>
            <a
              href="/methodology"
              className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500"
            >
              How we calculate
            </a>
          </div>
        </div>
      </section>

      <section id="compare" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-50">Platform comparison</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Scenario: {SCENARIO.label} (${SCENARIO.weeklyUsd * SCENARIO.weeks} invested).
              Expand a row for sources and breakdown.
            </p>
          </div>
          <a href="/methodology" className="text-sm text-amber-400 hover:underline">
            Full methodology →
          </a>
        </div>
        <ComparisonTable />
      </section>

      <section
        id="alerts"
        className="border-y border-zinc-800 bg-zinc-900/30"
      >
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold text-zinc-50">Get fee-change alerts</h2>
          <p className="mt-2 max-w-xl text-sm text-zinc-400">
            Platforms quietly change tiers and promos. Join the list for occasional updates
            when US DCA costs move — no spam, unsubscribe anytime.
          </p>
          <div className="relative mt-6 max-w-lg">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
