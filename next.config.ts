import type { NextConfig } from "next";
import { getAllComparePairs } from "./src/lib/compares";

const nextConfig: NextConfig = {
  async redirects() {
    // /compare/b-vs-a -> canonical /compare/a-vs-b (permanent = 308)
    return getAllComparePairs().map((p) => ({
      source: `/compare/${p.b.id}-vs-${p.a.id}`,
      destination: `/compare/${p.slug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
