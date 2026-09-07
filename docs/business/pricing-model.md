---
name: firstcall-pricing-model
description: "What's actually live vs. pre-scoped-but-unpublished in First Call's pricing/package structure"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3c9e8418-9912-4187-ae76-f91f185d848c
  modified: 2026-08-29T19:45:00.000Z
---

Only **Foundation** (CAD $2,799 one-time setup + $139.99/month retainer, month-to-month) is a live, purchasable product — wired to Stripe Checkout via `/start` and `/api/checkout`.

**Growth** (~CAD $3,800 one-time + $249–$349/mo), **Domination** (~CAD $5,500 one-time + $449–$649/mo), a standalone **Technical SEO Audit** (~CAD $497–$997 one-time), and a **GEO/AI-Visibility add-on** (~CAD $99–$199/mo) are fully scoped — descriptions and prices live in `src/lib/content.ts` as `upcomingPackages` and `oneOffAndAddOns`, and render on `/pricing` under "Beyond Foundation" as "coming soon" — but none of them have a Stripe price or checkout flow.

**Why:** 2026-08-23 decision — the user wanted to see the tradeoff before committing, and the call made was to keep the *first sale* simple (matches the site's existing "first-sale offer" positioning and the sourced operating manual's own advice to niche down and avoid decision paralysis on a prospect's first purchase), while having Growth/Domination ready to switch on the moment there are Foundation clients to upsell. **Superseding repricing decision, same evening** (commit `b7ec368`, 2026-08-23 21:39): Foundation was repriced from a flat CAD $4,500/month down to a CAD $2,799 one-time setup + $139.99/month retainer, specifically to undercut market rate and lower the barrier to entry for the first sale — Growth/Domination/Audit/GEO-addon were rescaled off this new baseline, and checkout, proposal, legal (MSA/SOW), and lead-email copy were all updated to match. This doc previously still showed the pre-reprice $4,500/month figure, out of sync with the code — corrected 2026-08-29 after the mismatch was caught while grounding a sales/outreach agent task. Live code is the source of truth for price; treat this doc as a restatement of it, not an independent number.

**How to apply:** Don't build Stripe products/checkout for Growth/Domination/Audit/GEO-addon unless the user explicitly asks to start selling them — the content is intentionally pre-scoped-but-dormant. When that time comes, the numbers and scope are already written in `content.ts`; no need to re-derive them. Any agent or document quoting a Foundation price should say **CAD $2,799 one-time + $139.99/month** — if you see $4,500/month anywhere (including in past outputs), it's the stale pre-reprice number.
