import Link from "next/link";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { LAST_UPDATED } from "@/lib/platforms";
import { costPages } from "@/lib/costPages";
import { DCA_AMOUNTS, dcaSlug } from "@/lib/dcaAmounts";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <AffiliateDisclosure />
        <p className="mt-6 text-sm leading-relaxed text-zinc-400">
          <strong className="font-medium text-zinc-200">Disclaimer:</strong> StackCost
          is for informational purposes only and is{" "}
          <strong className="font-medium text-zinc-200">not financial advice</strong>.
          Fees, spreads, and policies change without notice. Always verify current
          pricing with each platform before buying or withdrawing. Estimates are
          labeled as such. Data last reviewed {LAST_UPDATED} (ET).
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-500">
          <Link href="/methodology" className="hover:text-amber-400">
            Methodology
          </Link>
          <span aria-hidden>·</span>
          <Link href="/costs/cheapest-bitcoin-dca-us" className="hover:text-amber-400">
            Cheapest DCA
          </Link>
          <span aria-hidden>·</span>
          <Link href="/calculator" className="hover:text-amber-400">
            DCA calculator
          </Link>
          <span aria-hidden>·</span>
          <Link href="/costs/bitcoin-withdrawal-fees" className="hover:text-amber-400">
            Withdrawal fees
          </Link>
          <span aria-hidden>·</span>
          <Link href="/compare" className="hover:text-amber-400">
            Head-to-head
          </Link>
          <span aria-hidden>·</span>
          <Link href="/#compare" className="hover:text-amber-400">
            Full table
          </Link>
          <span aria-hidden>·</span>
          <Link href="/fee-changes" className="hover:text-amber-400">
            Fee change log
          </Link>
          <span aria-hidden>·</span>
          <Link href="/#alerts" className="hover:text-amber-400">
            Fee alerts
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600">
          {costPages.map((c) => (
            <Link key={c.slug} href={`/costs/${c.slug}`} className="hover:text-amber-400">
              {c.h1.split(" — ")[0]}
            </Link>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600">
          {DCA_AMOUNTS.map((a) => (
            <Link key={a} href={`/costs/dca/${dcaSlug(a)}`} className="hover:text-amber-400">
              DCA ${a.toLocaleString("en-US")}/week
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-zinc-600">© {new Date().getFullYear()} StackCost</p>
      </div>
    </footer>
  );
}
