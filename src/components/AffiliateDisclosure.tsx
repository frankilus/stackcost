/**
 * Disclosure text only — no live affiliate links yet.
 * Placeholders note where affiliate CTAs may appear later.
 */
export function AffiliateDisclosure({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs leading-relaxed text-zinc-500">
        <strong className="font-medium text-zinc-400">Affiliate disclosure:</strong>{" "}
        StackCost may earn a commission if you sign up through links we add later. We do not
        currently have live affiliate links. Rankings are by modeled all-in cost, not
        commissions.{" "}
        <span className="text-zinc-600">[Affiliate link placeholders — not live]</span>
      </p>
    );
  }

  return (
    <aside
      className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-xs leading-relaxed text-zinc-400"
      role="note"
    >
      <p>
        <strong className="font-medium text-zinc-200">Affiliate disclosure:</strong> Some
        platform links on StackCost may eventually be affiliate or referral links. If you
        sign up through those links, we may earn a commission at{" "}
        <em>no extra cost to you</em>. We do{" "}
        <strong className="font-medium text-zinc-300">not</strong> currently run live
        affiliate programs or redirect through partner URLs — any “Open platform” targets
        are plain official sites.
      </p>
      <p className="mt-2 text-zinc-500">
        Rankings and “winner” callouts are sorted solely by our transparent all-in cost
        model (see{" "}
        <a href="/methodology" className="text-amber-400 hover:underline">
          methodology
        </a>
        ), never by commission rate.{" "}
        <span className="text-zinc-600">
          [Placeholder: affiliate CTAs will appear here once programs are approved — not
          live yet.]
        </span>
      </p>
    </aside>
  );
}
