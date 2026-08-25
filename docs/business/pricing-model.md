---
name: firstcall-pricing-model
description: "What's actually live vs. pre-scoped-but-unpublished in First Call's pricing/package structure"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3c9e8418-9912-4187-ae76-f91f185d848c
  modified: 2026-08-24T02:00:17.932Z
---

Only **Foundation** (CAD $4,500/month, month-to-month) is a live, purchasable product — wired to Stripe Checkout via `/start` and `/api/checkout`.

**Growth** (~CAD $1,500–2,500/mo), **Domination** (~CAD $3,000–5,000/mo), a standalone **Technical SEO Audit** (~CAD $500–2,000 one-time), and a **GEO/AI-Visibility add-on** (~CAD $300–1,000/mo) are fully scoped — descriptions and price ranges live in `src/lib/content.ts` as `upcomingPackages` and `oneOffAndAddOns`, and render on `/pricing` under "Beyond Foundation" as "coming soon" — but none of them have a Stripe price or checkout flow.

**Why:** 2026-08-23 decision — the user wanted to see the tradeoff before committing, and the call made was to keep the *first sale* simple (matches the site's existing "first-sale offer" positioning and the sourced operating manual's own advice to niche down and avoid decision paralysis on a prospect's first purchase), while having Growth/Domination ready to switch on the moment there are Foundation clients to upsell.

**How to apply:** Don't build Stripe products/checkout for Growth/Domination/Audit/GEO-addon unless the user explicitly asks to start selling them — the content is intentionally pre-scoped-but-dormant. When that time comes, the numbers and scope are already written in `content.ts`; no need to re-derive them.
