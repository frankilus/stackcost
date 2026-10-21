import { platforms, type Platform } from "./platforms";

export const SITE_URL = "https://stackcost-pink.vercel.app";

export interface ComparePair {
  slug: string;
  a: Platform;
  b: Platform;
}

/** Original six platforms get every unique pair. */
export const CORE_IDS = ["strike", "river", "swan", "coinbase", "kraken", "cashapp"] as const;

/** Hand-picked high-intent pairs for platforms added later (slug order = [a, b]). */
export const EXTRA_PAIRS: [string, string][] = [
  ["robinhood", "strike"],
  ["robinhood", "coinbase"],
  ["robinhood", "cashapp"],
  ["paypal", "cashapp"],
  ["paypal", "coinbase"],
  ["paypal", "robinhood"],
];

/** Core pairs (slug = `{earlierId}-vs-{laterId}` in platforms order) plus EXTRA_PAIRS. */
export function getAllComparePairs(): ComparePair[] {
  const pairs: ComparePair[] = [];
  const core = platforms.filter((p) => (CORE_IDS as readonly string[]).includes(p.id));
  for (let i = 0; i < core.length; i++) {
    for (let j = i + 1; j < core.length; j++) {
      const a = core[i];
      const b = core[j];
      pairs.push({
        slug: `${a.id}-vs-${b.id}`,
        a,
        b,
      });
    }
  }
  for (const [aId, bId] of EXTRA_PAIRS) {
    const a = platforms.find((p) => p.id === aId);
    const b = platforms.find((p) => p.id === bId);
    if (a && b) pairs.push({ slug: `${a.id}-vs-${b.id}`, a, b });
  }
  return pairs;
}

export function getPairsForPlatform(id: string): ComparePair[] {
  return getAllComparePairs().filter((p) => p.a.id === id || p.b.id === id);
}

export function getComparePair(slug: string): ComparePair | undefined {
  return getAllComparePairs().find((p) => p.slug === slug);
}

export function parseCompareSlug(slug: string): { aId: string; bId: string } | null {
  const m = /^([a-z0-9]+)-vs-([a-z0-9]+)$/.exec(slug);
  if (!m) return null;
  return { aId: m[1], bId: m[2] };
}

export function getPlatformById(id: string): Platform | undefined {
  return platforms.find((p) => p.id === id);
}

/** Resolve slug even if order is reversed (cashapp-vs-strike ↔ strike-vs-cashapp). */
export function resolveComparePair(slug: string): ComparePair | undefined {
  const direct = getComparePair(slug);
  if (direct) return direct;
  const parsed = parseCompareSlug(slug);
  if (!parsed) return undefined;
  const a = getPlatformById(parsed.aId);
  const b = getPlatformById(parsed.bId);
  if (!a || !b || a.id === b.id) return undefined;
  // Only pairs we actually publish; reversed slugs resolve to the canonical one.
  return getComparePair(`${b.id}-vs-${a.id}`);
}
