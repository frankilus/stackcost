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
  title: "StackCost — Real all-in cost to DCA Bitcoin",
  description:
    "Living comparison of the true all-in cost to buy Bitcoin on a schedule across US platforms. Transparent fees, spreads, and custody.",
  openGraph: {
    title: "StackCost",
    description: "The real all-in cost to buy Bitcoin on a schedule.",
    type: "website",
    url: SITE_URL,
  },
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
        <header className="border-b border-zinc-800/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <a href="/" className="text-lg font-semibold tracking-tight text-zinc-50">
              Stack<span className="text-amber-400">Cost</span>
            </a>
            <nav className="flex gap-5 text-sm text-zinc-400">
              <a href="/#compare" className="hover:text-zinc-100">
                Table
              </a>
              <a href="/compare" className="hover:text-zinc-100">
                Compare
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
