import { platforms, type Platform } from "./platforms";

export const SITE_URL = "https://stackcost-pink.vercel.app";

export interface ComparePair {
  slug: string;
  a: Platform;
  b: Platform;
}

/** Canonical unordered pairs among all platforms, slug = `{earlierId}-vs-{laterId}` in platforms order. */
export function getAllComparePairs(): ComparePair[] {
  const pairs: ComparePair[] = [];
  for (let i = 0; i < platforms.length; i++) {
    for (let j = i + 1; j < platforms.length; j++) {
      const a = platforms[i];
      const b = platforms[j];
      pairs.push({
        slug: `${a.id}-vs-${b.id}`,
        a,
        b,
      });
    }
  }
  return pairs;
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
  // Canonicalize to platforms-array order
  const ai = platforms.findIndex((p) => p.id === a.id);
  const bi = platforms.findIndex((p) => p.id === b.id);
  const [first, second] = ai < bi ? [a, b] : [b, a];
  return {
    slug: `${first.id}-vs-${second.id}`,
    a: first,
    b: second,
  };
}
