import type { Metadata } from "next";
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
  title: "StackCost — Cheapest Way to DCA Bitcoin in the US (2026 True-Cost Comparison)",
  description:
    "Compare the true all-in cost of recurring Bitcoin buys on Strike, River, Swan, Coinbase, Kraken and Cash App. Fees, spreads, custody and withdrawals modeled for $100/week DCA — sources linked, estimates labeled.",
  openGraph: {
    title: "StackCost — The real all-in cost to DCA Bitcoin",
    description:
      "Fees + spreads + custody for recurring Bitcoin buys on 8 US platforms. Find the cheapest DCA path.",
    type: "website",
    url: SITE_URL,
    siteName: "StackCost",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackCost — Cheapest way to DCA Bitcoin (US)",
    description: "True all-in cost of recurring Bitcoin buys across 8 US platforms.",
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
            <a href="/" className="text-lg font-semibold tracking-tight text-zinc-50">
              Stack<span className="text-amber-400">Cost</span>
            </a>
            <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-400">
              <a href="/#compare" className="hover:text-zinc-100">
                Table
              </a>
              <a href="/costs/cheapest-bitcoin-dca-us" className="hover:text-zinc-100">
                Cheapest
              </a>
              <a href="/calculator" className="hover:text-zinc-100">
                Calculator
              </a>
              <a href="/costs/bitcoin-withdrawal-fees" className="hover:text-zinc-100">
                Withdrawals
              </a>
              <a href="/compare" className="hover:text-zinc-100">
                Compare
              </a>
              <a href="/fee-changes" className="hover:text-zinc-100">
                Fee changes
              </a>
              <a href="/methodology" className="hover:text-zinc-100">
                Methodology
              </a>
              <a href="/#alerts" className="hover:text-zinc-100">
                Alerts
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
