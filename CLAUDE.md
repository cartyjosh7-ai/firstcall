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

**Status as of 2026-08-25: fully wired up and live.** Postgres (`neon-lime-fence`, free tier, connected
to Production + Preview), `AUTH_SECRET`/`CRM_IMPORT_SECRET` set in Vercel, migration applied, production
redeployed — `firstcall-teal.vercel.app/crm/setup` returns 200. The connection string is saved in the
gitignored `.env.local`; don't regenerate it, it's real.

**The one remaining step is not mine to do:** visit `/crm/setup` yourself, once — it only works while
zero accounts exist and creates the one manager account. Don't create it on the user's behalf even if
asked to "finish" the CRM; that's their login. After that, `/crm/employees` (manager-only) creates
employee accounts — self-serve password reset exists (needs Resend to actually send).

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

### The domain problem (root-caused 2026-08-25 — don't re-diagnose this)

**`firstcallmarketing.ai` cannot be recovered and should be abandoned as this project's domain.** Full
diagnosis, confirmed twice (once 2026-08-24, re-confirmed 2026-08-25 via the actual Vercel dashboard):

- The `fc-consulting` Vercel team (account `cartyjosh7-6549`, the one connected to this GitHub repo) has
  **a clean, current, "Ready" Production deployment** of `master` at all times — the Next.js
  app/GitHub/Vercel pipeline itself has never been broken. Its only domain is the auto-generated
  `firstcall-teal.vercel.app`.
- `firstcallmarketing.ai` was registered via **GoDaddy on 2026-06-28** — before this repo existed — with
  its nameservers (`ns1/ns2.vercel-dns.com`) delegated to a **different Vercel account**, and the user
  confirmed 2026-08-25 they have never used GoDaddy. Attempting to add the domain to `fc-consulting`
  returns "linked to another Vercel account" / verification-required, and neither the registrar nor the
  DNS-hosting Vercel account is reachable. This is why the live site looks finished but is frozen in
  time — it's serving a snapshot from that other, inaccessible setup, not this codebase.
- **The fix is a new domain, not recovery.** `firstcallconsulting.ai` (the name already defaulted-to in
  `content.ts` and `.env.example` from an earlier abandoned pivot attempt) is confirmed available —
  $160 for a 2-year registration via Vercel's own domain purchase, which auto-configures DNS. As of
  2026-08-25 the user has decided to buy it, just not yet — nothing is purchased. Once it is: set
  `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `LEAD_INBOX`, `RESEND_FROM` in Vercel to match, and
  everything downstream (checkout success/cancel URLs, email footers, OG tags) just works — those already
  read from `site.url`/`site.email` in `content.ts`, nothing else needs code changes for a domain swap.

Also: no `.env`/`.env.local` exists locally — every integration (Stripe, Resend, Anthropic, admin/unsubscribe
secrets, mailing address) is unset in local dev. Production Vercel env vars are unverified from this
environment; check the Vercel dashboard directly.

Known copy/schema bugs still assuming a US jurisdiction (business is Calgary, AB, Canada): root layout's
JSON-LD `areaServed: "US"` and the `/markets` page headline ("...across the US").

## Working Log

Maintained by Claude across sessions — recent context so a new session doesn't start cold. Keep this to the
last handful of entries; prune older ones once they're no longer load-bearing.

- **2026-08-25** — Set up this CLAUDE.md (via `/init`) plus this working-log section, in response to the
  user wanting persistent cross-session context instead of re-deriving it each time. Prior session (2026-08-24
  night) built two local tools unrelated to this app's code: a Claude Code usage-dashboard generator and a PC
  cleanup script, both at `C:\Users\carty\.claude\scripts\`, launched via Desktop `.bat` shortcuts. Also
  confirmed a live pitch-deck Artifact exists for First Call.
- **2026-08-25 (later same day)** — Built the CRM (`src/app/crm`, see above). Then used browser automation
  against the live Vercel dashboard to finally root-cause the domain issue — see "The domain problem" above.
  Conclusion: buy `firstcallconsulting.ai` ($160/2yr, available, checked live in Vercel) rather than keep
  chasing `firstcallmarketing.ai`. User deferred the actual purchase to later — **next session, check
  whether it's been bought yet before assuming it hasn't.**
- **2026-08-25 (zero-cost pass)** — User asked for everything gettable-done without payment or their
  involvement. Shipped: CRM self-serve password reset (`/crm/forgot-password`, `src/lib/reset-token.ts`,
  signed self-expiring links, no token table); fixed the MSA's governing-law clause (was generic
  "state of your principal place of business" US boilerplate, now Alberta/Calgary). Worktree cleanup is
  still blocked (classifier blocked the force-remove, needs explicit user sign-off, see "Git worktree"
  above — don't retry without asking). Generated the four secret env vars
  (`AUTH_SECRET`/`UNSUBSCRIBE_SECRET`/`ADMIN_API_SECRET`/`CRM_IMPORT_SECRET`) into a new **gitignored**
  `.env.local` — same values just need copying into Vercel when ready, don't regenerate them. Added a
  free/organic lead-sourcing section to the Field Manual (directories, manual Maps research, referrals —
  explicitly not scraping Google Maps, that breaks their ToS).
