---
name: firstcall-seo-operating-manual
description: "Source and location of the Perplexity-researched SEO/website-business operating manual now embedded in First Call's agents"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 3c9e8418-9912-4187-ae76-f91f185d848c
  modified: 2026-08-24T02:00:28.710Z
---

The user supplied a 33-page "SEO & Website Creation Business — Complete Operating Manual for AI Agents," produced via a Perplexity deep-dive, saved at `C:\Users\carty\Downloads\SEO & Website Business — AI Operating Manual.pdf` (downloaded 2026-08-23). It covers the business model, technical SEO (Core Web Vitals thresholds, crawlability, schema), E-E-A-T, GEO/AEO (AI search optimization), local SEO/GBP weighting, link-building rules, website platform comparisons, pricing benchmarks, Canadian compliance (CASL/PIPEDA), SOPs, and client-facing templates — sourced from industry reporting as of August 2026, with an explicit note to re-verify anything older than 6 months (i.e. re-check Google policy/CWV thresholds/tool pricing claims from around **February 2027** onward).

**Where its content now lives in the codebase** (as of the 2026-08-23 session):
- `src/lib/agents/research-agent.ts` and `src/lib/agents/implementation-agent.ts` — the manual's core technical/E-E-A-T/local/GEO standards and white-hat-only link-building rule are embedded directly in both agents' system prompts (the manual's own §17 "AI Agent Operating Rules" is written to be pasted as standing agent instructions — this is effectively what was done).
- `src/lib/agents/mock-engine.ts` — the same standards, condensed, drive the free zero-cost rule-based path (see [[firstcall_pricing_model]] and the mock-mode memory if one exists on the agent engine itself).
- `src/lib/content.ts` — the manual's package/pricing model (§10.2) informs `upcomingPackages`/`oneOffAndAddOns`.
- Compliance sections (§12) drove [[firstcall_compliance_rules]].

**How to apply:** For any future work that touches SEO methodology, pricing benchmarks, or Canadian compliance, this manual is the source of truth already reflected in the code above — no need to ask the user to re-paste it. If a claim needs re-verification (see 6-month staleness note above), say so rather than treating it as evergreen.
