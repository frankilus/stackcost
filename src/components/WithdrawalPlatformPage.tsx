import Link from "next/link";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SITE_URL } from "@/lib/compares";
import { costPages, HUB_SLUG } from "@/lib/costPages";
import { platforms } from "@/lib/platforms";
import { type WithdrawalPolicy, withdrawalsRanked, WITHDRAWALS_SLUG, WITHDRAWALS_VERIFIED } from "@/lib/withdrawals";

const BADGE = { yes: "Free path", limited: "Limited free", no: "Paid" } as const;

export function withdrawalPageMeta(w: WithdrawalPolicy) {
  const name = platforms.find((p) => p.id === w.platformId)!.name;
  const title = `${name} Bitcoin Withdrawal Fee (2026): Cost to Send BTC to Your Own Wallet`;
  const description = `${w.answer} Sourced from ${name}'s own pages, verified ${WITHDRAWALS_VERIFIED}.`.slice(0, 300);
  return { name, title, description, url: `${SITE_URL}/costs/${w.slug}` };
}

export function withdrawalFaqs(w: WithdrawalPolicy, name: string) {
  const pos = withdrawalsRanked.findIndex((x) => x.platformId === w.platformId) + 1;
  return [
    { q: `How much does ${name} charge to withdraw bitcoin?`, a: w.answer },
    {
      q: `Is there a free way to withdraw bitcoin from ${name}?`,
      a: w.freeOnchainPath === "no" ? `Not documented. ${w.freePathDetail} ${w.paidPathDetail}` : w.freePathDetail,
    },
    { q: `Can I withdraw bitcoin from ${name} over Lightning?`, a: w.lightning },
    { q: `What is the minimum bitcoin withdrawal on ${name}?`, a: w.minimum },
    {
      q: `How does ${name} compare with other apps on withdrawal cost?`,
      a: `StackCost ranks ${name} #${pos} of ${withdrawalsRanked.length} US Bitcoin apps on the cost of moving BTC to self-custody (free paths first, then flat fees, then variable network-fee pass-throughs). Ranking checked ${WITHDRAWALS_VERIFIED}.`,
    },
  ];
}

export function WithdrawalPlatformPage({ w }: { w: WithdrawalPolicy }) {
  const { name, url } = withdrawalPageMeta(w);
  const p = platforms.find((x) => x.id === w.platformId)!;
  const buyPage = costPages.find((c) => c.platformId === w.platformId);
  const faqs = withdrawalFaqs(w, name);
  const pos = withdrawalsRanked.findIndex((x) => x.platformId === w.platformId) + 1;
  const h1 = `${name} bitcoin withdrawal fee (2026)`;

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "Article", headline: h1, dateModified: WITHDRAWALS_VERIFIED, datePublished: WITHDRAWALS_VERIFIED, url, publisher: { "@type": "Organization", name: "StackCost" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "StackCost", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Bitcoin withdrawal fees", item: `${SITE_URL}/costs/${WITHDRAWALS_SLUG}` },
      { "@type": "ListItem", position: 3, name: `${name} withdrawal fee`, item: url },
    ] },
  ];

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-zinc-500">
        <Link href="/" className="text-amber-400 hover:underline">StackCost</Link>
        <span className="mx-2">/</span>
        <Link href={`/costs/${WITHDRAWALS_SLUG}`} className="hover:text-zinc-300">Withdrawal fees</Link>
        <span className="mx-2">/</span><span className="text-zinc-400">{name}</span>
      </nav>
      <header className="mt-6">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-500/90">Self-custody costs · Verified {WITHDRAWALS_VERIFIED}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">{h1}</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-300">
          What it costs to move bitcoin from {name} to a wallet you control: on-chain, Lightning, and minimums, from {name}&apos;s own pages.
        </p>
      </header>
      <div className="mt-6"><AffiliateDisclosure /></div>

      <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className={`inline-block rounded px-2 py-0.5 text-xs ${w.freeOnchainPath === "yes" ? "bg-emerald-500/15 text-emerald-300" : w.freeOnchainPath === "limited" ? "bg-amber-500/15 text-amber-300" : "bg-zinc-700/40 text-zinc-300"}`}>{BADGE[w.freeOnchainPath]} · #{pos} of {withdrawalsRanked.length}</div>
        <p className="mt-3 text-lg text-zinc-200"><strong className="text-zinc-50">Short answer:</strong> {w.answer}</p>
        {w.confidence === "varies" ? <p className="mt-2 text-sm text-zinc-500">Varies; {name} does not publish a fixed number. Check the fee on the confirm screen.</p> : null}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-zinc-50">{name} withdrawal details</h2>
        <ul className="mt-4 space-y-2 text-sm text-zinc-300">
          <li><strong className="text-zinc-200">Free path:</strong> {w.freePathDetail}</li>
          <li><strong className="text-zinc-200">Paid path:</strong> {w.paidPathDetail}</li>
          <li><strong className="text-zinc-200">Lightning:</strong> {w.lightning}</li>
          <li><strong className="text-zinc-200">Minimum:</strong> {w.minimum}</li>
          <li><strong className="text-amber-400">How to pay less:</strong> {w.tip}</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-zinc-50">How {name} ranks on withdrawal cost</h2>
        <p className="mt-1 text-sm text-zinc-500">Free paths first, then flat published fees, then variable network-fee pass-throughs.</p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-4 py-3">#</th><th className="px-4 py-3">Platform</th><th className="px-4 py-3">On-chain withdrawal</th><th className="px-4 py-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalsRanked.map((x, i) => {
                const n = platforms.find((pp) => pp.id === x.platformId)!.name;
                const me = x.platformId === w.platformId;
                return (
                  <tr key={x.slug} className={`border-b border-zinc-800/80 last:border-0 ${me ? "bg-amber-500/5 text-zinc-50" : "text-zinc-300"}`}>
                    <td className="px-4 py-3 tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{me ? n : <Link href={`/costs/${x.slug}`} className="text-amber-400 hover:underline">{n}</Link>}</td>
                    <td className="px-4 py-3">{x.headline}</td>
                    <td className="px-4 py-3 text-zinc-400">{BADGE[x.freeOnchainPath]}{x.confidence === "varies" ? " · varies" : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Full details for every app: <Link href={`/costs/${WITHDRAWALS_SLUG}`} className="text-amber-400 hover:underline">Bitcoin withdrawal fees by platform</Link>.
          Withdrawal costs are not part of our <Link href={`/costs/${HUB_SLUG}`} className="text-amber-400 hover:underline">all-in DCA ranking</Link>.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-zinc-50">FAQ</h2>
        <dl className="mt-4 space-y-5">
          {faqs.map((f) => (<div key={f.q}><dt className="font-medium text-zinc-100">{f.q}</dt><dd className="mt-1 text-sm leading-relaxed text-zinc-400">{f.a}</dd></div>))}
        </dl>
      </section>

      <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
        <h2 className="font-medium text-zinc-100">Sources</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {w.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="nofollow noopener noreferrer" className="text-amber-400 hover:underline">{s.label}</a>
              <span className="text-xs text-zinc-600"> · checked {WITHDRAWALS_VERIFIED}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-zinc-500">Policies as stated on {name}&apos;s public pages (ET). Network fees and in-app quotes change; the fee on the confirm screen is final.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-50">Buying on {name}?</h2>
        <p className="mt-2 text-sm text-zinc-400">
          {buyPage ? <><Link href={`/costs/${buyPage.slug}`} className="text-amber-400 hover:underline">{p.name} buy-side true cost (fees + spread)</Link> · </> : null}
          <Link href="/calculator" className="text-amber-400 hover:underline">DCA cost calculator</Link> · <Link href={`/costs/${HUB_SLUG}`} className="text-amber-400 hover:underline">Cheapest Bitcoin DCA in the US</Link>
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {withdrawalsRanked.filter((x) => x.platformId !== w.platformId).map((x) => (
            <li key={x.slug}>
              <Link href={`/costs/${x.slug}`} className="inline-block rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-300 hover:border-amber-500/40 hover:text-amber-400">{platforms.find((pp) => pp.id === x.platformId)!.name} withdrawal fee</Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="alerts" className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-zinc-50">Get alerted when {name} changes fees</h2>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">Occasional email when fees, spreads, or withdrawal policies move. Unsubscribe anytime.</p>
        <div className="relative mt-5 max-w-lg"><NewsletterForm /></div>
      </section>
      <div className="mt-10"><AffiliateDisclosure compact /></div>
    </article>
  );
}
