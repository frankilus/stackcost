import data from "@/data/fee-changes.json";
import { platforms } from "@/lib/platforms";

export type FeeChangeType = "baseline" | "fee-change" | "spread-change" | "policy-change" | "no-change";
export interface FeeChange { date: string; platformId: string; type: FeeChangeType; summary: string; source: string }

export const feeChanges: FeeChange[] = (data.entries as FeeChange[])
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date));

export const platformName = (id: string) => platforms.find((p) => p.id === id)?.name ?? id;
export const latestFeeChangeDate = feeChanges[0]?.date;
