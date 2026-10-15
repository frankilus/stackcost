"use client";

import { useMemo, useState } from "react";
import { platforms, type Platform } from "@/lib/platforms";
import { computeCost, formatPct, formatUsd, type CostBreakdown } from "@/lib/calc";

type Row = { platform: Platform; cost: CostBreakdown };

export function ComparisonTable() {
  const [openId, setOpenId] = useState<string | null>(null);

  const rows: Row[] = useMemo(() => {
    return platforms
      .map((platform) => ({ platform, cost: computeCost(platform) }))
      .sort((a, b) => a.cost.score - b.cost.score);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Platform</th>
              <th className="px-4 py-3 font-medium">Buy fee %</th>
              <th className="px-4 py-3 font-medium">Spread est.</th>
              <th className="px-4 py-3 font-medium">Funding</th>
              <th className="px-4 py-3 font-medium">Withdrawal (BTC)</th>
              <th className="px-4 py-3 font-medium">Custody</th>
              <th className="px-4 py-3 font-medium">All-in / yr</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ platform, cost }, i) => {
              const open = openId === platform.id;
              return (
                <FragmentRow
                  key={platform.id}
                  rank={i + 1}
                  platform={platform}
                  cost={cost}
                  open={open}
                  onToggle={() => setOpenId(open ? null : platform.id)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-zinc-800 px-4 py-3 text-xs text-zinc-500">
        Sorted by lowest estimated all-in cost on $100/week for 52 weeks. Tap a row for
        sources &amp; modeled path. Network miner fees excluded.
      </p>
    </div>
  );
}

function FragmentRow({
  rank,
  platform,
  cost,
  open,
  onToggle,
}: {
  rank: number;
  platform: Platform;
  cost: CostBreakdown;
  open: boolean;
  onToggle: () => void;
}) {
  const buyLabel = platform.firstBuyPaysStandardFee
    ? `${formatPct(platform.buyFeePct)} DCA*`
    : formatPct(platform.buyFeePct);
  const spreadLabel =
    platform.spreadConfidence === "estimate"
      ? `~${formatPct(platform.spreadEstimatePct)} est.`
      : formatPct(platform.spreadEstimatePct);

  return (
    <>
      <tr
        className="cursor-pointer border-b border-zinc-800/80 transition hover:bg-zinc-800/40"
        onClick={onToggle}
        aria-expanded={open}
      >
        <td className="px-4 py-3 tabular-nums text-zinc-500">{rank}</td>
        <td className="px-4 py-3">
          <div className="font-medium text-zinc-100">{platform.name}</div>
          <div className="text-xs text-zinc-500">{platform.pathModeled.slice(0, 48)}…</div>
        </td>
        <td className="px-4 py-3 tabular-nums text-zinc-200">{buyLabel}</td>
        <td className="px-4 py-3 tabular-nums text-zinc-200">{spreadLabel}</td>
        <td className="max-w-[160px] px-4 py-3 text-zinc-400">
          <span className="line-clamp-2">{platform.fundingNotes}</span>
        </td>
        <td className="max-w-[160px] px-4 py-3 text-zinc-400">
          <span className="line-clamp-2">{platform.withdrawalBtc}</span>
        </td>
        <td className="max-w-[140px] px-4 py-3 text-zinc-400">
          <span className="line-clamp-2">{platform.custodyNotes}</span>
        </td>
        <td className="px-4 py-3">
          <div className="font-semibold tabular-nums text-amber-400">
            {formatUsd(cost.allInCostUsd)}
          </div>
          <div className="text-xs tabular-nums text-zinc-500">
            {formatPct(cost.allInPct)} of ${cost.totalInvested.toLocaleString()}
          </div>
        </td>
      </tr>
      {open ? (
        <tr className="border-b border-zinc-800 bg-zinc-950/80">
          <td colSpan={8} className="px-4 py-4">
            <div className="grid gap-4 text-sm text-zinc-300 md:grid-cols-2">
              <div>
                <h3 className="mb-1 font-medium text-zinc-100">Modeled path</h3>
                <p className="text-zinc-400">{platform.pathModeled}</p>
                {platform.firstBuyPaysStandardFee ? (
                  <p className="mt-2 text-xs text-zinc-500">
                    * First weekly buy uses standard fee{" "}
                    {formatPct(platform.standardBuyFeePct)}; remaining 51 at{" "}
                    {formatPct(platform.buyFeePct)}.
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-zinc-500">{platform.notes}</p>
              </div>
              <div>
                <h3 className="mb-1 font-medium text-zinc-100">Cost breakdown</h3>
                <ul className="space-y-1 text-zinc-400">
                  <li>Buy fees: {formatUsd(cost.buyFeesPaid)}</li>
                  <li>
                    Spread ({platform.spreadConfidence}): {formatUsd(cost.spreadPaid)}
                  </li>
                  <li>Custody (modeled): {formatUsd(cost.custodyPaid)}</li>
                  <li className="font-medium text-zinc-200">
                    All-in: {formatUsd(cost.allInCostUsd)} ({formatPct(cost.allInPct)})
                  </li>
                </ul>
                <h3 className="mb-1 mt-3 font-medium text-zinc-100">Sources</h3>
                <ul className="space-y-1">
                  {platform.sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {s.label}
                      </a>
                      <span className="text-xs text-zinc-600"> · accessed {s.accessed}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
