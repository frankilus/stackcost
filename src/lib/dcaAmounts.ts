/**
 * DCA-by-amount longtail pages, computed from platforms.ts:
 *   /costs/dca/{amount}-a-week  (52 buys/yr)
 *   /costs/dca/{amount}-a-month (12 buys/yr)
 */
export const DCA_AMOUNTS = [10, 25, 50, 100, 250, 500, 1000] as const;
export const DCA_MONTHLY_AMOUNTS = [50, 100, 200, 500, 1000, 2000] as const;

export type DcaFreq = "week" | "month";

export function dcaSlug(amount: number, freq: DcaFreq = "week") {
  return `${amount}-a-${freq}`;
}

export function buysPerYear(freq: DcaFreq) {
  return freq === "week" ? 52 : 12;
}

export function allDcaSlugs() {
  return [
    ...DCA_AMOUNTS.map((a) => dcaSlug(a, "week")),
    ...DCA_MONTHLY_AMOUNTS.map((a) => dcaSlug(a, "month")),
  ];
}

export function parseDcaSlug(slug: string): { amount: number; freq: DcaFreq } | undefined {
  const m = /^(\d+)-a-(week|month)$/.exec(slug);
  if (!m) return undefined;
  const amount = Number(m[1]);
  const freq = m[2] as DcaFreq;
  const list = (freq === "week" ? DCA_AMOUNTS : DCA_MONTHLY_AMOUNTS) as readonly number[];
  return list.includes(amount) ? { amount, freq } : undefined;
}
