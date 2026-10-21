import Link from "next/link";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SITE_URL } from "@/lib/compares";
import { costPages, HUB_SLUG } from "@/lib/costPages";
import { platforms } from "@/lib/platforms";
import { withdrawals, WITHDRAWALS_SLUG, WITHDRAWALS_VERIFIED } from "@/lib/withdrawals";

const TITLE = "Bitcoin Withdrawal Fees by Platform (2026): Swan, Strike, Cash App, River, Kraken, Coinbase";
const DESC = `What it costs to move bitcoin to your own wallet from six US apps — free paths, flat fees, Lightning, minimums. Sourced from each platform's own pages. Verified ${WITHDRAWALS_VERIFIED}.`;
const URL = `${SITE_URL}/costs/${WITHDRAWALS_SLUG}`;

export const metadata: Metadata = {
  title: `${TITLE} | StackCost`,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: "article" },
};

const ORDER = { yes: 0, limited: 1, no: 2 } as const;
const BADGE = { yes: "Free path", limited: "Limited free", no: "Paid" } as const;

export default function WithdrawalFees() {
  const rows = [...withdrawals]
    .sort((a, b) => ORDER[a.freeOnchainPath] - ORDER[b.freeOnchainPath])
    .map((w) => ({ w, p: platforms.find((p) => p.id === w.platformId)!, page: costPages.find((c) => c.platformId === w.platformId) }));
  const freeNames = rows.filter((r) => r.w.freeOnchainPath === "yes").map((r) => r.p.name);

  const faqs = [
    {
      q: "Which Bitcoin apps let you withdraw for free?",
      a: `Per their own fee pages (checked ${WITHDRAWALS_VERIFIED}): ${freeNames.join(", ")} each document a zero-fee on-chain withdrawal path (Strike at its Flexible ~24h speed, Cash App at standard speed). River gives one free on-chain send per month. Kraken and Coinbase charge on every on-chain withdrawal.`,
    },
    {
      q: "How much does Kraken charge to withdraw Bitcoin?",
      a: "Kraken's published BTC on-chain withdrawal fee was ₿0.000015 (1,500 sats) with a ₿0.000218 minimum when we checked. Kraken notes fees can change and the amount at confirmation is final.",
    },
    {
      q: "How much does Coinbase charge to withdraw Bitcoin?",
      a: "Coinbase charges its estimate of the current network fee for a standalone send (shown at send), and a 0.2% processing fee for Lightning sends. There is no fixed published number.",
    },
    {
      q: "Are withdrawal fees included in StackCost's all-in cost ranking?",
      a: "No. The DCA ranking covers buy fees, spread and custody. Withdrawal costs depend on how often you withdraw and on network conditions, so we list them separately here.",
    },
  ];
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "StackCost", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Costs", item: `${SITE_URL}/costs/${HUB_SLUG}` },
      { "@type": "ListItem", position: 3, name: "Bitcoin withdrawal fees", item: URL },
    ] },
  ];

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-zinc-500">
        <Link href="/" className="text-amber-400 hover:underline">StackCost</Link>
        <span className="mx-2">/</span>
        <Link href={`/costs/${HUB_SLUG}`} className="hover:text-zinc-300">Costs</Link>
        <span className="mx-2">/</span><span className="text-zinc-400">Bitcoin withdrawal fees</span>
      </nav>
      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-500/90">Self-custody costs · Verified {WITHDRAWALS_VERIFIED}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">Bitcoin withdrawal fees by platform (2026)</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-300">
          Buying cheaply is half the job. Moving your bitcoin to your own wallet can be free or can cost a fee every time.
          Here is what each US DCA app documents for withdrawals. Every row cites the platform&apos;s own page.
        </p>
      </header>
      <div className="mt-6"><AffiliateDisclosure /></div>

      <section className="mt-10 overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">On-chain withdrawal</th>
              <th className="px-4 py-3">Free path</th>
              <th className="px-4 py-3">Paid path</th>
              <th className="px-4 py-3">Lightning</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ w, p }) => (
              <tr key={w.platformId} className="border-b border-zinc-800/80 align-top last:border-0 text-zinc-200">
                <td className="px-4 py-3 font-medium">{p.name}
                  <div className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[11px] font-normal ${w.freeOnchainPath === "yes" ? "bg-emerald-500/15 text-emerald-300" : w.freeOnchainPath === "limited" ? "bg-amber-500/15 text-amber-300" : "bg-zinc-700/40 text-zinc-300"}`}>{BADGE[w.freeOnchainPath]}</div>
                </td>
                <td className="px-4 py-3">{w.headline}{w.confidence === "varies" ? <div className="text-xs text-zinc-500">Varies; not a fixed published number</div> : null}</td>
                <td className="px-4 py-3 text-zinc-400">{w.freePathDetail}</td>
                <td className="px-4 py-3 text-zinc-400">{w.paidPathDetail}</td>
                <td className="px-4 py-3 text-zinc-400">{w.lightning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <p className="mt-3 text-xs text-zinc-500">
        Policies as stated on each platform&apos;s public pages, checked {WITHDRAWALS_VERIFIED} (ET). Network fees and in-app quotes change. Always check the fee on the confirm screen.
        Withdrawal costs are <strong className="text-zinc-400">not</strong> part of our <Link href={`/costs/${HUB_SLUG}`} className="text-amber-400 hover:underline">all-in DCA ranking</Link>. See the <Link href="/methodology" className="text-amber-400 hover:underline">methodology</Link>.
      </p>

      <section className="mt-12 space-y-8">
        <h2 className="text-xl font-semibold text-zinc-50">Platform details and how to pay less</h2>
        {rows.map(({ w, p, page }) => (
          <div key={w.platformId} id={w.platformId} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-lg font-semibold text-zinc-100">{p.name} bitcoin withdrawal fee</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-zinc-300">
              <li><strong className="text-zinc-200">Free path:</strong> {w.freePathDetail}</li>
              <li><strong className="text-zinc-200">Paid path:</strong> {w.paidPathDetail}</li>
              <li><strong className="text-zinc-200">Lightning:</strong> {w.lightning}</li>
              <li><strong className="text-zinc-200">Minimum:</strong> {w.minimum}</li>
              <li><strong className="text-amber-400">Tip:</strong> {w.tip}</li>
            </ul>
            <p className="mt-3 text-xs text-zinc-500">
              Sources: {w.sources.map((s, i) => (<span key={s.url}>{i > 0 ? " · " : ""}<a href={s.url} rel="nofollow noopener" target="_blank" className="text-amber-400/90 hover:underline">{s.label}</a></span>))}
              {page ? <> · <Link href={`/costs/${page.slug}`} className="text-amber-400 hover:underline">{p.name} buy-side true cost →</Link></> : null}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-50">FAQ</h2>
        <dl className="mt-4 space-y-5">
          {faqs.map((f) => (<div key={f.q}><dt className="font-medium text-zinc-100">{f.q}</dt><dd className="mt-1 text-sm text-zinc-400">{f.a}</dd></div>))}
        </dl>
      </section>

      <section id="alerts" className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-zinc-50">Get alerted when fees change.</h2>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">We re-check these platforms weekly and email when something moves. Unsubscribe anytime.</p>
        <div className="relative mt-5 max-w-lg"><NewsletterForm /></div>
      </section>
      <div className="mt-10"><AffiliateDisclosure compact /></div>
    </article>
  );
}
