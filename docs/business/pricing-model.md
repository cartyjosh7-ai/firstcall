---
name: firstcall-pricing-model
description: "What's live vs. dormant in First Call's pricing/package structure"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3c9e8418-9912-4187-ae76-f91f185d848c
  modified: 2026-09-06T00:00:00.000Z
---

**Foundation** (CAD $2,799 one-time setup + $139.99/month retainer), **Growth** (CAD $3,800 one-time +
$249/month), **Domination** (CAD $5,500 one-time + $449/month), and a standalone **Technical SEO
Audit** (CAD $497 one-time) are all live, purchasable products — wired to Stripe Checkout via
`/start?package=<id>` and `/api/checkout`. All four live in `src/lib/content.ts` as `salesPackages`.

Only the **GEO/AI-Visibility add-on** (~CAD $99–$199/mo) remains dormant — `dormantAddOns` in
`content.ts` — because it only makes sense attached to an *existing* retainer client's subscription,
and that CRM flow ("add this to a current client") isn't built yet. Not a pricing decision, an
unbuilt-feature gap.

**Why:** 2026-08-23 decision was Foundation-only for the first sale (see the superseded reasoning
below, kept for history). **Superseding decision, 2026-09-06:** the user asked to activate all of
Growth/Domination/Audit for checkout immediately, not gated behind landing a first Foundation client.
Growth/Domination/Audit were originally scoped as *ranges* (e.g. Domination $449–$649/mo) because real
scope varies per client (location count, competitiveness) — asked to resolve that ambiguity, the user
chose to fix each at the **low end of its range** as the self-serve checkout price, rather than gating
these three behind a sales conversation. That means a client whose actual scope justifies the higher
end of the old range is a manual upsell after the sale, not something checkout enforces — don't
"correct" this by raising the fixed price without asking, that was the explicit tradeoff made.

*(Prior reasoning, superseded but kept for context: 2026-08-23 — keep the first sale simple, matches
the site's "first-sale offer" positioning and the sourced operating manual's advice to niche down on a
prospect's first purchase, while having Growth/Domination ready to switch on later. Same evening,
commit `b7ec368`, Foundation was repriced from flat CAD $4,500/month down to $2,799 one-time +
$139.99/month to undercut market rate and lower the barrier to entry — Growth/Domination/Audit/GEO-addon
were rescaled off that new baseline.)*

**How to apply:** Live code (`content.ts`) is the source of truth for price — treat this doc as a
restatement of it, not an independent number. Each package's SOW (`/legal/sow?package=<id>`) and the
MSA already reflect all four live offers. If the GEO add-on's CRM attach-flow ever gets built, update
this doc to mark it live too.
