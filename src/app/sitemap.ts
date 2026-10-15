import type { MetadataRoute } from "next";
import { getAllComparePairs, SITE_URL } from "@/lib/compares";
import { LAST_UPDATED } from "@/lib/platforms";

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
      url: `${SITE_URL}/compare`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...pairs.map((p) => ({
      url: `${SITE_URL}/compare/${p.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
