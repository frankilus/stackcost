/** Weekly-amount longtail pages: /costs/dca/{amount}-a-week. Numbers computed from platforms.ts. */
export const DCA_AMOUNTS = [10, 25, 50, 100, 250, 500, 1000] as const;

export function dcaSlug(amount: number) {
  return `${amount}-a-week`;
}

export function parseDcaSlug(slug: string): number | undefined {
  const m = /^(\d+)-a-week$/.exec(slug);
  if (!m) return undefined;
  const n = Number(m[1]);
  return (DCA_AMOUNTS as readonly number[]).includes(n) ? n : undefined;
}
