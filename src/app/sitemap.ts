import type { MetadataRoute } from "next";
import { getAllComparePairs, SITE_URL } from "@/lib/compares";
import { costPages, HUB_SLUG } from "@/lib/costPages";
import { LAST_UPDATED } from "@/lib/platforms";
import { allDcaSlugs } from "@/lib/dcaAmounts";
import { BUY_AMOUNTS, BUY_HUB_PATH, buyPath, ONE_TIME_VERIFIED } from "@/lib/oneTimeBuys";
import { withdrawals, WITHDRAWALS_SLUG, WITHDRAWALS_VERIFIED } from "@/lib/withdrawals";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${LAST_UPDATED}T12:00:00-04:00`);
  const pairs = getAllComparePairs();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/methodology`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/calculator`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/costs/${HUB_SLUG}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/costs/${WITHDRAWALS_SLUG}`,
      lastModified: new Date(`${WITHDRAWALS_VERIFIED}T12:00:00-05:00`),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/fee-changes`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...costPages.map((c) => ({
      url: `${SITE_URL}/costs/${c.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...withdrawals.map((w) => ({
      url: `${SITE_URL}/costs/${w.slug}`,
      lastModified: new Date(`${WITHDRAWALS_VERIFIED}T12:00:00-05:00`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...allDcaSlugs().map((slug) => ({
      url: `${SITE_URL}/costs/dca/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}${BUY_HUB_PATH}`,
      lastModified: new Date(`${ONE_TIME_VERIFIED}T12:00:00-05:00`),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    ...BUY_AMOUNTS.map((a) => ({
      url: `${SITE_URL}${buyPath(a)}`,
      lastModified: new Date(`${ONE_TIME_VERIFIED}T12:00:00-05:00`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...pairs.map((p) => ({
      url: `${SITE_URL}/compare/${p.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
