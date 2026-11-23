import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/compares";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: { google: "9tORGYiEX2iqEdbe1s6BacBEZU9-t-XEKmHAOZlHkc0" },
  title: "StackCost — Cheapest Way to DCA Bitcoin in the US (2026 True-Cost Comparison)",
  description:
    "True all-in cost of recurring Bitcoin buys on Cash App, Strike, River, Robinhood, Swan, Kraken, Coinbase, PayPal and Fold. Fees, spreads and custody modeled for $100/week DCA — sources linked, estimates labeled.",
  openGraph: {
    title: "StackCost — The real all-in cost to DCA Bitcoin",
    description:
      "Fees + spreads + custody for recurring Bitcoin buys on 9 US platforms. Find the cheapest DCA path.",
    type: "website",
    url: SITE_URL,
    siteName: "StackCost",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackCost — Cheapest way to DCA Bitcoin (US)",
    description: "True all-in cost of recurring Bitcoin buys across 9 US platforms.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "StackCost",
      url: SITE_URL,
      description: "Independent true-cost comparison of US Bitcoin DCA platforms.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "StackCost",
      url: SITE_URL,
      inLanguage: "en-US",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-950 text-zinc-100 antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <header className="border-b border-zinc-800/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-50">
              Stack<span className="text-amber-400">Cost</span>
            </Link>
            <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-400">
              <Link href="/#compare" className="hover:text-zinc-100">
                Table
              </Link>
              <Link href="/costs/cheapest-bitcoin-dca-us" className="hover:text-zinc-100">
                Cheapest
              </Link>
              <Link href="/calculator" className="hover:text-zinc-100">
                Calculator
              </Link>
              <Link href="/costs/buy" className="hover:text-zinc-100">
                One-time
              </Link>
              <Link href="/costs/bitcoin-withdrawal-fees" className="hover:text-zinc-100">
                Withdrawals
              </Link>
              <Link href="/compare" className="hover:text-zinc-100">
                Compare
              </Link>
              <Link href="/fee-changes" className="hover:text-zinc-100">
                Fee changes
              </Link>
              <Link href="/methodology" className="hover:text-zinc-100">
                Methodology
              </Link>
              <Link href="/#alerts" className="hover:text-zinc-100">
                Alerts
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
