# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```
npm run dev      # start dev server (Next.js)
npm run build    # production build
npm run start    # run production build
npm run lint     # next lint
```

No test suite exists yet.

## Architecture

Next.js 15 (App Router) SaaS/marketing site for **First Call**, a local SEO / AI-visibility agency
(Calgary, AB) selling a single productized offer — **Foundation** — to Canadian home-service SMBs
(HVAC, roofing, remediation, cleaning, auto, trucking, etc.).

### End-to-end flow

`/start` (lead form) → `POST /api/checkout` creates a Stripe Checkout **subscription** session
(one-time setup price + recurring monthly price, both attached to one subscription — see
`src/lib/stripe.ts`, `src/app/api/checkout/route.ts`) → Stripe redirects to `/start/success` →
Stripe fires `checkout.session.completed` at `POST /api/stripe/webhook`, which responds to Stripe
immediately and then (via Next's `after()`) runs the agent engine and emails the client.

### Agent engine (`src/lib/agents/`)

`orchestrate.ts` → `runEngine(input)` runs two sequential Claude tool-use agents and persists the
result via `saveReport` (`src/lib/reports.ts`, written to `data/reports/<id>.json`):

1. **Research agent** (`research-agent.ts`) — calls `run_site_audit` (real data, see below),
   `keyword_research` and `competitor_scan` (both placeholder/illustrative — no live data provider
   is wired up), then must call `submit_research_brief` exactly once. System prompt encodes First
   Call's actual SEO/GEO methodology (Core Web Vitals thresholds, E-E-A-T, GBP weighting, AI-crawler
   allowlisting, no manipulative tactics) — treat that prompt as the source of truth for the agency's
   standards, don't invent new ones elsewhere.
2. **Implementation agent** (`implementation-agent.ts`) — turns the brief into a 90-day phased plan.

Both agents run through a shared tool-use loop (`loop.ts` → `runToolLoop`), which loops the model
against Anthropic's Messages API until it calls a designated **terminal tool**, and returns that
tool's typed input as the result — this is the pattern used to force structured output instead of
parsing free-text JSON. `ANTHROPIC_AGENT_MODEL` controls the model (defaults to `claude-sonnet-5`).

**Mock mode** (`mockModeEnabled()` in `orchestrate.ts`) is the default whenever `ANTHROPIC_API_KEY`
is unset — `mock-engine.ts` produces the same `ResearchBrief`/`ImplementationPlan` shapes via rule-based
generation, so the full webhook → report → email pipeline is demoable at zero API cost. Force either
mode explicitly with `AGENTS_MOCK_MODE=true|false`. The webhook treats mock reports as unsafe to send
to a paying client automatically — it withholds the client email and flags the internal lead notification
with "MOCK DATA" instead (see `src/app/api/stripe/webhook/route.ts`).

`POST /api/agents/run` is a manual trigger for the same engine (e.g. to regenerate a report after
setting a real API key), gated by `ADMIN_API_SECRET` if that env var is set.

### Site audit (`src/lib/audit.ts`)

Real (non-mocked) scanner: fetches the homepage + up to 3 internal links, checks robots.txt, and scores
0–100 across five categories — Maps, AI Overviews, AI Assistants, Voice, Website/Reviews — via ~25 regex-based
checks against the fetched HTML. Blocks private/internal hostnames (`normalizeAuditUrl`). This is the only
part of the pipeline that touches a real external site; everything downstream (keyword/competitor data) is
explicitly labeled placeholder until a real data provider is integrated.

### Leads & email (`src/lib/leads.ts`, `src/lib/unsubscribe.ts`)

Every lead touchpoint (`audit`, `contact`, `proposal`, `won`) is appended to `data/leads.jsonl` and, if
`RESEND_API_KEY` is set, emailed both to the internal inbox (`LEAD_INBOX`) and to the lead. All outbound
commercial email includes a working unsubscribe link — required by **CASL** (Canadian anti-spam law), along
with a real mailing address (`NEXT_PUBLIC_MAILING_ADDRESS`). Unsubscribe tokens are HMAC-signed
(`UNSUBSCRIBE_SECRET`) so a guessed link can't unsubscribe someone else's address.

### Content/copy (`src/lib/content.ts`)

Central source for site copy, trade list, and per-industry landing page content (`industries` array) — edit
here rather than inline in page components when changing marketing copy.

### CRM (`src/app/crm`, added 2026-08-25)

Internal, login-gated multi-user CRM living inside this same app at `/crm` — no separate deploy, no
extra hosting cost. Stack: **Postgres via Vercel Storage (Neon)** + **Drizzle ORM** (`src/lib/db/`) +
**Auth.js v5** with a Credentials provider (`src/lib/auth.ts`, `src/lib/auth.config.ts`) for email/password
logins, JWT sessions, two roles (`manager` / `employee`). `middleware.ts` gates all of `/crm/*` except
`/crm/login` and `/crm/setup`.

**Lead status is derived, not manually set:** a lead starts `cold` if `source: "scraper"`, else `warm`
(`source: "website" | "employee" | "manager"`); the moment any contact is logged against it
(`logContact` in `src/lib/db/queries.ts`), it flips to `hot` and stays there until a human marks it
`won` or `lost`. Don't add a way to set cold/warm/hot directly — that state machine is the point.

**Not yet done — required before this is usable:**
1. Create the Postgres DB: Vercel dashboard → the `firstcall` project → Storage → Create Database →
   Postgres (Neon) → Connect to Project. This auto-injects `POSTGRES_URL` into Vercel's env vars.
2. Set `AUTH_SECRET` (any random 32+ byte string, or `npx auth secret`) in Vercel's env vars too.
3. Locally: copy the same `POSTGRES_URL`/`AUTH_SECRET` into `.env.local`, then run `npm run db:migrate`
   once to create the tables (migration already generated at `drizzle/0000_blushing_the_anarchist.sql`).
4. Redeploy, then visit `/crm/setup` **once** — it only works while zero accounts exist, and creates
   the one manager account. After that it permanently redirects to `/crm/login`.
5. From `/crm/employees` (manager-only), create employee accounts — you set their initial password,
   they should change it after first login (no self-serve password reset exists yet).

Website-sourced leads (audit/contact/proposal submissions, and Stripe `checkout.session.completed`)
already mirror into this CRM automatically via `mirrorToCrm()` in `src/lib/leads.ts` — best-effort, so
it silently no-ops until `POSTGRES_URL` exists rather than breaking the existing lead-capture flow.
A future scraper can bulk-insert cold leads via `POST /api/crm/import` (needs `CRM_IMPORT_SECRET` set;
nothing calls this endpoint yet — it's just the receiving end, ready for when a scraper exists).

### Business & reference docs

`docs/` holds everything non-code made for First Call, consolidated in one place — business/compliance
memory notes, the sourced SEO operating manual PDF, and the pitch deck. See `docs/README.md` for the
full index.

### Env config

See `.env.example` for the full list. Nothing costs money or sends real email/Stripe charges until the
corresponding key is set — everything degrades gracefully to a safe/mock/no-op path when a key is missing
(this is intentional, not a bug to "fix").

### Git worktree (stale, safe to remove)

`worktree-seo-agents-backend` branch is checked out as a locked worktree at
`.claude/worktrees/seo-agents-backend/`. As of 2026-08-25 it is fully merged into `master` and now
2 commits *behind* it — not active work. Safe to `git worktree remove` and delete the branch once
confirmed unneeded; don't assume it's in-flight without checking `git log master..worktree-seo-agents-backend`
first.

### Production deployment gap (critical, unresolved as of 2026-08-25)

`firstcallmarketing.ai` is live but is **not serving this repository's current state** — `/pricing`,
`/start`, and `/admin` all 404 live, while `/why-first-call` and `/local-marketing-campaign-services`
(no corresponding route in `src/app` at all) return 200. Vercel is serving a build that predates
significant local history and has likely never redeployed from GitHub. No customer can check out until
this is fixed. See `docs/first-call-readiness.md`-equivalent artifact for the full punch list (or ask
Claude to regenerate it) — don't re-diagnose this from scratch each session.

Also: no `.env`/`.env.local` exists locally — every integration (Stripe, Resend, Anthropic, admin/unsubscribe
secrets, mailing address) is unset in local dev. Production Vercel env vars are unverified from this
environment; check the Vercel dashboard directly.

Known copy/schema bugs still assuming a US jurisdiction (business is Calgary, AB, Canada): root layout's
JSON-LD `areaServed: "US"`, `/markets` page headline ("...across the US"), and `content.ts`'s default
`site.url`/contact-email fallbacks pointing at the unregistered `firstcallconsulting.ai` instead of the
real live domain `firstcallmarketing.ai`.

## Working Log

Maintained by Claude across sessions — recent context so a new session doesn't start cold. Keep this to the
last handful of entries; prune older ones once they're no longer load-bearing.

- **2026-08-25** — Set up this CLAUDE.md (via `/init`) plus this working-log section, in response to the
  user wanting persistent cross-session context instead of re-deriving it each time. Prior session (2026-08-24
  night) built two local tools unrelated to this app's code: a Claude Code usage-dashboard generator and a PC
  cleanup script, both at `C:\Users\carty\.claude\scripts\`, launched via Desktop `.bat` shortcuts. Also
  confirmed a live pitch-deck Artifact exists for First Call.
