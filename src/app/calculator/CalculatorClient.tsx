"use client";

import { useEffect, useMemo, useState } from "react";
import { computeCost, formatPct, formatUsd } from "@/lib/calc";
import { platforms } from "@/lib/platforms";
import { costPages } from "@/lib/costPages";

type Freq = "weekly" | "monthly";
const BUYS: Record<Freq, number> = { weekly: 52, monthly: 12 };
const MAX = 1_000_000;

export function CalculatorClient() {
  const [raw, setRaw] = useState("100");
  const [freq, setFreq] = useState<Freq>("weekly");

  // Allow deep links: /calculator?amount=75&freq=monthly
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const a = q.get("amount");
    const f = q.get("freq");
    if (a && Number(a) > 0) setRaw(a);
    if (f === "weekly" || f === "monthly") setFreq(f);
  }, []);

  const amount = Number(raw);
  const valid = Number.isFinite(amount) && amount > 0 && amount <= MAX;
  const buys = BUYS[freq];

  const ranked = useMemo(() => {
    if (!valid) return [];
    return platforms
      .map((p) => ({ p, c: computeCost(p, amount, buys), page: costPages.find((c) => c.platformId === p.id) }))
      .sort((a, b) => a.c.allInCostUsd - b.c.allInCostUsd);
  }, [amount, buys, valid]);

  const invested = valid ? amount * buys : 0;

  return (
    <section className="mt-8">
      <form className="flex flex-wrap items-end gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5" onSubmit={(e) => e.preventDefault()}>
        <label className="flex flex-col text-sm text-zinc-400">
          Amount per buy (USD)
          <div className="mt-1 flex items-center rounded-lg border border-zinc-700 bg-zinc-950 px-3">
            <span className="text-zinc-500">$</span>
            <input
              type="number"
              inputMode="decimal"
              min={1}
              max={MAX}
              step="any"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="w-36 bg-transparent px-2 py-2 text-lg text-zinc-50 outline-none"
              aria-label="Amount per buy in US dollars"
            />
          </div>
        </label>
        <fieldset className="flex gap-2 text-sm">
          <legend className="mb-1 text-zinc-400">Frequency</legend>
          {(["weekly", "monthly"] as Freq[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFreq(f)}
              aria-pressed={freq === f}
              className={`rounded-lg border px-4 py-2 capitalize ${freq === f ? "border-amber-500 text-amber-400" : "border-zinc-700 text-zinc-300 hover:border-zinc-500"}`}
            >
              {f}
            </button>
          ))}
        </fieldset>
        {valid ? (
          <p className="text-sm text-zinc-400">
            {buys} buys · {formatUsd(invested)} invested per year
          </p>
        ) : (
          <p className="text-sm text-red-400">Enter an amount between $1 and $1,000,000.</p>
        )}
      </form>

      {valid && ranked.length > 0 && (
        <>
          <p className="mt-6 text-base text-zinc-300">
            Cheapest: <strong className="text-amber-400">{ranked[0].p.name}</strong> at {formatUsd(ranked[0].c.allInCostUsd)}/yr.
            Most expensive: {ranked[ranked.length - 1].p.name} at {formatUsd(ranked[ranked.length - 1].c.allInCostUsd)}/yr — a{" "}
            {formatUsd(ranked[ranked.length - 1].c.allInCostUsd - ranked[0].c.allInCostUsd)} difference.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Platform</th>
                  <th className="px-4 py-3">Buy fees / yr</th>
                  <th className="px-4 py-3">Spread / yr</th>
                  <th className="px-4 py-3">Custody / yr</th>
                  <th className="px-4 py-3">All-in / yr</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((r, i) => (
                  <tr key={r.p.id} className="border-b border-zinc-800/80 last:border-0 text-zinc-200">
                    <td className="px-4 py-3 text-zinc-500">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{r.p.name}</td>
                    <td className="px-4 py-3 tabular-nums">{formatUsd(r.c.buyFeesPaid)}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatUsd(r.c.spreadPaid)}
                      {r.p.spreadConfidence === "estimate" && r.p.spreadEstimatePct > 0 ? <div className="text-xs text-zinc-500">estimate</div> : null}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{formatUsd(r.c.custodyPaid)}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatUsd(r.c.allInCostUsd)}
                      <div className="text-xs text-zinc-500">{formatPct(r.c.allInPct)}</div>
                    </td>
                    <td className="px-4 py-3">
                      {r.page ? <a href={`/costs/${r.page.slug}`} className="text-amber-400 hover:underline">True cost →</a> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
