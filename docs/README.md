# First Call — everything in one place

Index of everything built for First Call (`firstcallmarketing.ai`), consolidated here so it's all
visible from inside the project folder instead of scattered across Claude Code's internal storage.

## 1. The application (this repo)

Next.js 15 site, live at the repo root (`..`). Full architecture writeup: [`../CLAUDE.md`](../CLAUDE.md).

| Area | Path |
|---|---|
| Marketing pages (home, pricing, about, industries, services, resources, tools) | `../src/app/` |
| Legal pages (MSA, SOW, privacy, terms) | `../src/app/legal/`, `../src/app/privacy/`, `../src/app/terms/` |
| Lead capture flow (`/start` → Stripe Checkout → webhook) | `../src/app/start/`, `../src/app/api/checkout/`, `../src/app/api/stripe/webhook/` |
| Free audit tool (real live site scanner) | `../src/lib/audit.ts`, `../src/app/audit/`, `../src/app/tools/visibility-checker/` |
| ROI calculator | `../src/app/tools/roi-calculator/` |
| SEO delivery agents (Research + Implementation, Claude tool-use) | `../src/lib/agents/` |
| Report/proposal generation & viewing | `../src/lib/reports.ts`, `../src/app/reports/` |
| Lead storage + CASL-compliant email | `../src/lib/leads.ts`, `../src/lib/unsubscribe.ts` |
| Site copy, trades, industry content | `../src/lib/content.ts` |
| Admin manual-generate endpoint | `../src/app/admin/generate/`, `../src/app/api/agents/run/` |
| CRM — leads, contact logs, employee accounts & KPIs (login-gated, needs one-time DB setup — see `../CLAUDE.md`) | `../src/app/crm/` |
| Env config reference | `../.env.example` |

Also active: a locked git worktree on branch `worktree-seo-agents-backend` at
`../.claude/worktrees/seo-agents-backend/` — in-progress parallel work, not stale.

## 2. Business & compliance knowledge (`docs/business/`)

These are Claude's distilled working notes, copied here from Claude Code's cross-session memory
store (`~/.claude/projects/C--Users-carty-firstcall/memory/`) so they're human-readable in one
place. **The originals there remain the live source Claude reads each session** — treat these
copies as a mirror for you to read, not the canonical copy to edit; if you need to correct one,
say so and both should be updated.

| File | What it covers |
|---|---|
| [`business-context.md`](business/business-context.md) | Who First Call is, where it operates (Calgary/Alberta, Canada), target market |
| [`pricing-model.md`](business/pricing-model.md) | What's actually live for sale (Foundation only) vs. scoped-but-dormant (Growth/Domination/Audit/GEO add-on) |
| [`compliance-rules.md`](business/compliance-rules.md) | CASL/PIPEDA rules governing every email/lead-capture code path |
| [`seo-operating-manual-notes.md`](business/seo-operating-manual-notes.md) | Where the sourced operating manual's knowledge lives in the codebase |

## 3. Sourced research

- [`seo-operating-manual-source.pdf`](seo-operating-manual-source.pdf) — the original 33-page
  "SEO & Website Creation Business — Complete Operating Manual for AI Agents" (Perplexity deep-dive,
  Aug 2026), copied from `~/Downloads/`. Its content is what's embedded in the two agents' system
  prompts and the pricing/compliance docs above. Re-verify any time-sensitive claim (CWV thresholds,
  tool pricing) from ~February 2027 onward per its own staleness note.

## 4. Pitch deck

- [`pitch-deck.html`](pitch-deck.html) — static copy of the pitch deck. The live, sharable version
  is the published Artifact: https://claude.ai/code/artifact/35144ded-d92a-4b07-a1ec-1a12562fd7a0

## 5. Readiness report & Field Manual (2026-08-25)

- [`readiness-report.html`](readiness-report.html) — full inventory of everything built, checked live
  against production, plus the exact punch list before the first sale. Live version:
  https://claude.ai/code/artifact/3b3447ad-cb89-4352-85a6-9e3570909e40
- [`field-manual.html`](field-manual.html) — the operating manual: software stack, leads, the full
  sales-to-delivery process, closing scripts, payment collection, compliance, and a glossary for new
  hires. Live version: https://claude.ai/code/artifact/2de5a1b9-001b-4cd9-926d-1d6b18dfcc24

These two are a snapshot as of 2026-08-25 — re-generate rather than hand-edit once the production
deployment gap (see `../CLAUDE.md`) is fixed, since a lot of their content is "here's what's broken
right now."

## Not included here

Session transcripts (the raw back-and-forth that produced all of this) live in
`~/.claude/projects/C--Users-carty-firstcall/*.jsonl` and `~/.claude/projects/C--Users-carty--claude/*.jsonl`
— not copied here since they're logs, not deliverables. Use `claude --resume` from the project root
to browse and reopen past sessions.
