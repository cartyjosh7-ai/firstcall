# Calgary → First $1,000 with AI Coding Tools
### Verified research brief, opportunity matrix, and execution plan
**Prepared:** 2026-09-11 · **Operator:** Josh, Calgary, AB · **Currency:** CAD unless marked USD

---

## 0. Executive summary — and the single biggest correction to the original brief

The pre-researched brief treated this as a greenfield question: "pick one of ten opportunities and start." **That framing is wrong, because you are not starting from zero.**

While verifying the brief I found an existing, substantially-built business on this machine:

**First Call** (`C:\Users\carty\firstcall`, repo `firstcall`, deployed at `firstcall-teal.vercel.app`) — a Next.js 15 SEO + website-creation agency targeting exactly the market the brief told me to research: Calgary/Canadian home-service trades (HVAC, roofing, remediation, cleaning, auto, trucking) plus clinics, legal and professional services.

It already has:

| Asset | Status |
|---|---|
| Four productized offers with fixed prices | **Live in code** (`salesPackages` in `src/lib/content.ts`) |
| Stripe Checkout flow (`/start?package=` → `/api/checkout`) | **Built**, needs Stripe account + 7 price IDs |
| Legal: MSA + per-package SOW, Alberta governing law | **Done** |
| CASL-compliant email (signed one-click unsubscribe, suppression list, mailing-address footer) | **Built** (`src/lib/unsubscribe.ts`, `src/lib/leads.ts`) |
| Cold-outreach agent, send-once-per-lead enforced structurally | **Built & shipped** (`src/lib/outreach.ts`, commit `a5436fb`) |
| Login-gated CRM, Postgres/Neon, derived cold→warm→hot lead states | **Live** |
| Bulk cold-lead import endpoint `POST /api/crm/import` | **Built, nothing calls it yet** |
| Free live site-audit tool (real scanner, ~25 checks, 5 categories) as lead magnet | **Built, real data** |

Existing prices (from `docs/business/pricing-model.md`, confirmed against code):

- **Technical SEO Audit** — $497 one-time
- **Foundation** — $2,799 setup + $139.99/mo
- **Growth** — $3,800 setup + $249/mo
- **Domination** — $5,500 setup + $449/mo

**Therefore: the fastest credible path to $1,000 is not a new venture. It is two Audit sales ($994) or one Foundation sale ($2,939 on day one).** Build time required: approximately zero. The remaining blockers are administrative (a free Stripe account, a free-tier Resend account) and a ~$20 domain — not engineering.

Everything below re-ranks the brief's ten opportunities against this reality, and against live evidence.

### The four findings that most change the plan

1. **You are drastically underpriced, not overpriced.** The brief guessed website rebuilds at $300–$800. Actual Calgary market: freelancers get **$1,500–$5,000 for a 5-page site**, agencies $3,000–$15,000, and "a typical small business website in Calgary" runs **$2,000–$8,000, averaging $5,000–$6,500** ([OxOne, Calgary, 2026](https://oxone.ca/blog/website-cost-calgary-2026); [CodeWeb Calgary packages: Basic $1,000–2,000 → Enterprise $4,000–20,000](https://codeweb.ca/calgary-web-design-prices/)). Your $139.99/mo Foundation retainer sits **below the Canadian credibility floor** — multiple Canadian pricing sources state that packages under $500/mo "are usually automated tools or offshore work" ([Wide Ripples](https://wideripples.com/small-business-seo-pricing-canada/)), with the real Canadian SMB range being **$500–$2,500/mo** and most paying **$800–$1,500/mo** ([Plan Webbies](https://planwebbies.ca/blog/local-seo-cost-canada/), [SEO Team Toronto](https://www.seoteamtoronto.ca/blog/how-much-does-seo-cost-canada)). Your $497 audit is likewise below the Canadian one-off audit range of **CA$2,500–$8,000**. Underpricing here costs you money *and* credibility.

2. **Cold email in Canada is the legally hardest channel; cold calling is the easiest.** The brief's outreach assumptions are US-shaped. Under CASL, penalties reach **$1M for an individual / $10M for a business per violation**, and **the sender bears the onus of proving consent** ([CRTC implied-consent guidance](https://crtc.gc.ca/eng/com500/guide.htm)). By contrast, **business-to-business telephone calls are exempt from the National Do Not Call List rules** ([CRTC business telemarketing alerts](https://crtc.gc.ca/eng/phone/telemarketing/biz.htm); [DNCL exemptions](https://www.lnnte-dncl.gc.ca/en/Organization/Exemptions)). **Phone should be your primary channel, email secondary.** This inverts the brief.

3. **A fully legal, free, 21,000-row Calgary lead list exists and you are not using it.** The City of Calgary publishes active business licences as open data with a public API — and commercial use is permitted. I queried it live: **2,671 licences matching "CONTRACTOR"**, 601 Motor Vehicle Repair, 448 commercial Massage Centres, 1,256 Personal Service. This solves the lead-sourcing problem *without* scraping Google Maps (which your own notes correctly refuse to do, as it breaks Google's ToS).

4. **A blog claim I checked turned out to be false, and in your favour.** Several SEO blogs assert a "2026 CASL amendment eliminated implied consent." Not true. What actually happened: CASL's **private right of action was never brought into force and was repealed 31 Dec 2025** ([Winston & Strawn](https://www.winston.com/en/blogs-and-podcasts/privacy-law-corner/indefinite-delay-of-private-right-of-action-under-canada-s-anti), [Lexology](https://www.lexology.com/library/detail.aspx?g=d49eb365-aae0-4eae-ac5b-0db778fd284f)). That *removes* class-action exposure. Implied consent via conspicuous publication (s.10(9)(b)) remains fully in force. Enforcement stays with the CRTC.

### Research limitation — stated up front

**I could not access Reddit.** `reddit.com` blocks Anthropic's crawler at both the fetch and search layer (confirmed: `WebFetch` returns "unable to fetch"; `WebSearch` with `allowed_domains: reddit.com` returns HTTP 400 "not accessible to our user agent"). The brief's instruction to validate via Reddit threads could not be fulfilled directly. I substituted: official Upwork investor-relations research, live government open-data APIs, regulator primary sources (CRTC/ISED), and competitor pricing pages. **Where the only available support for a claim was a listicle or a vendor blog with an incentive to inflate, I say so explicitly below rather than laundering it as validated.** Anything marked ⚠️ is thin evidence — verify it yourself before betting on it.

---

## 1. Ranked Top 5 Opportunities

Scored 1–10 across nine criteria, then weighted. Full matrix in §1b.

| # | Opportunity | One-line description | Speed to $1,000 | Upfront cost | Claude Code leverage | Overall | Rationale |
|---|---|---|---|---|---|---|---|
| **1** | **Activate First Call — audit-led offer to Calgary trades** | Turn on the already-built checkout and sell the $497 audit / $2,799 Foundation to licensed Calgary contractors and clinics, sourced from City open data, pitched by phone | **3–14 days** | **$0–$20** | **10** | **9.4** | The product, pricing, legal docs, CRM, CASL-compliant email engine and audit lead-magnet are already built and deployed. Two audit sales clear the goal; one Foundation sale triples it. No other option on this list has a near-zero build cost *and* a verified local market paying 4–10× your current price. The binding constraint is sales activity, not code. |
| **2** | **Website rebuild + AI-visibility ride-along (repriced to market)** | Build a finished preview site for a Calgary trade with a bad/no site, pitch the preview, close at $1,800–$3,500 | **5–21 days** | **$0–$20** | **10** | **8.6** | Strongest standalone path if #1 stalls, and it shares 100% of #1's lead list and outreach system. Evidence is solid and local: Calgary freelancers genuinely clear $1,500–$5,000 per 5-page build. Claude Code compresses the build to hours, so a free spec-built preview is cheap to produce and is the single most effective cold-pitch asset. One sale = goal. |
| **3** | **Missed-call / AI-receptionist automation for Calgary clinics & trades** | Deploy missed-call text-back + AI call answering; $900–$1,500 setup + $450–$700/mo | **10–30 days** | **$30–$100/mo platform** | 7 | **7.8** | Demand and pricing verified well *above* the brief's guess: agency-deployed voice agents carry **$500–$3,000 one-time setup** and resell at **$297–$997/mo** against $99–$299/mo platform cost. But it introduces a recurring cost before revenue, a harder technical hand-off, and you'd compete with incumbents bundling it free (Weave includes missed-call text at $199/mo USD). Best as an **upsell to a client won via #1 or #2**, not a cold opener. |
| **4** | **Freelance automation / MVP builds on Upwork & Contra** | Sell n8n automations, landing pages and MVPs to a global marketplace | **7–30 days** | **$0** (+ platform fees) | 9 | **7.0** | Demand is real and primary-sourced: Upwork's own 2026 report shows top AI skills demand **+109% YoY**, AI integration **+178%**, and AI-using freelancers earning **34% more per hour**. Rates support the goal ($40–$100/hr for n8n work). Downside: you start at zero reviews against established sellers, platform fees apply, and it builds no local moat or recurring revenue. **Best use: a parallel, zero-cost hedge — not the main bet.** |
| **5** | **AI data-contribution work (Outlier / Mercor / Scale) as bridge cash** | Paid task work to cover tool costs while #1 ships | **1–7 days** | **$0** | 2 | **5.8** | Honestly ranked: this is the fastest *cash*, not a business. Verified rates are lower than the hype — $10–$50/hr headline, but community-reported effective rates of **$12–$35/hr** after unpaid time, and rates are **down year-over-year**. Zero compounding value, zero Claude Code leverage, and it consumes the hours that would otherwise produce a client. Use only to fund the $20 domain, then stop. |

### 1b. Full scoring matrix (1–10, higher is better)

| Opportunity | Speed to $1 | $1k in 60d | Low cost | Low build | Low sales difficulty | Repeatable | CC leverage | Proof of demand | Low risk/sat. | **Weighted** |
|---|---|---|---|---|---|---|---|---|---|---|
| 1. Activate First Call (audit-led) | 10 | 10 | 10 | 10 | 6 | 9 | 10 | 9 | 7 | **9.4** |
| 2. Website rebuild, repriced | 9 | 9 | 10 | 9 | 6 | 9 | 10 | 9 | 6 | **8.6** |
| 3. Missed-call / AI receptionist | 7 | 8 | 7 | 6 | 6 | 9 | 7 | 9 | 7 | **7.8** |
| 4. Upwork / Contra freelancing | 8 | 7 | 9 | 8 | 5 | 6 | 9 | 9 | 4 | **7.0** |
| 5. AI data contribution (bridge) | 10 | 5 | 10 | 10 | 10 | 3 | 2 | 8 | 6 | **5.8** |
| 6. AI content systems B2B (Opp. E) | 5 | 6 | 9 | 7 | 4 | 7 | 8 | 5 | 3 | **5.6** |
| 7. Chrome extensions (Opp. G) | 3 | 3 | 10 | 7 | 3 | 5 | 9 | 3 | 4 | **4.6** |
| 8. AI prompt systems for SMBs (Opp. F) | 4 | 3 | 10 | 8 | 2 | 5 | 9 | 2 | 5 | **4.4** |
| 9. Vertical micro-SaaS / API arbitrage (Opp. D) | 2 | 3 | 7 | 3 | 4 | 9 | 9 | 4 | 4 | **4.2** |
| 10. Short-form video editing (Opp. I) | 5 | 5 | 8 | 6 | 4 | 6 | 3 | 6 | 3 | **4.2** |
| 11. Digital products / templates (Opp. J) | 2 | 2 | 9 | 6 | 2 | 8 | 7 | 3 | 2 | **3.6** |

*Weighting: speed-to-$1 and $1k-in-60-days carry double weight; proof-of-demand 1.5×; others 1×. This reflects the stated goal (first $1,000 fast), not long-term business value — on a 3-year horizon #9 would rank higher.*

### 1c. Verdict on each original opportunity

| Brief's opportunity | Verdict | Evidence |
|---|---|---|
| **A — AI automation agency** | **Confirmed, and underpriced.** Brief said $500–$2,000 setup + $300–$800/mo. Market reality: $500–$3,000 setup, $297–$997/mo resale on $99–$299/mo platform cost, 50–70% margins. Raise your numbers. | [Trillet pricing guide](https://trillet.ai/blogs/voice-agent-pricing-strategy-guide), [Ringlyn margins](https://www.ringlyn.com/blog/white-label-ai-voice-agent-pricing-margins-2026/) |
| **B — Freelance MVP/automation dev** | **Confirmed.** $40–$100/hr for n8n, $125–$250+ for senior; demand +109% YoY from Upwork's own data. MVP $500–$2,000 is plausible but I could not verify specific closed-deal prices. | [Upwork In-Demand Skills 2026](https://investors.upwork.com/news-releases/news-release-details/upworks-demand-skills-2026-demand-top-ai-skills-more-doubles-ai), [Ciela AI rates](https://ciela.ai/blogs/freelance-ai-automation-rates-2026) |
| **C — Website rebuilds** | **Confirmed, and badly underpriced — brief was off by ~5×.** $300–$800 is a Fiverr price, not a Calgary price. Local range $1,500–$5,000 freelance. | [OxOne](https://oxone.ca/blog/website-cost-calgary-2026), [CodeWeb](https://codeweb.ca/calgary-web-design-prices/), [Chameleon](https://chameleon-ideas.com/calgary-web-design-cost/) |
| **D — API arbitrage / micro-SaaS** | **Deprioritised.** Sound in theory, but directly violates the goal's time constraint. Also note: your own operating manual and the brief both forbid building before pre-selling. 10–20 subscribers at $49–99/mo is a 3–6 month arc, not 4 weeks. | Judgment call; no contrary evidence found |
| **E — AI content systems** | **Weak for you specifically — a compliance conflict the brief missed.** Your own Section 17 rules forbid "mass-produced unreviewed AI content," and Google's spam policies target scaled content abuse. Human review caps throughput, which kills the margin story. $150–$500/article is plausible but I found no strong primary evidence of SMBs paying $1,000–$3,000/mo retainers to a solo newcomer. ⚠️ | Google spam policies; `firstcall` compliance notes |
| **F — AI prompt systems** | **Not substantiated.** I found no evidence of a real market of SMBs paying $300–$1,000 for "prompt systems" as a standalone product. The buyers who would pay for outcomes buy automations (A) or visibility (1). Treat the brief's claim here as unsupported. ⚠️ | No supporting evidence found |
| **G — Chrome extensions** | **Partly confirmed, strategically poor.** The $5 one-time developer fee is real and correct. But a $9–$49 one-time extension needs ~25–110 sales for $1,000, with no distribution — that's an audience problem wearing a product costume. | [Chrome developer registration](https://developer.chrome.com/docs/webstore/register) |
| **H — AI training data** | **Confirmed but deflated.** Real, fast, legal. Rates lower than the brief implies and falling. Bridge cash only. | [Breaking Even rate analysis](https://breakingeven.online/blog/outlier-ai-pay-per-hour-2026), [Glassdoor](https://www.glassdoor.com/Hourly-Pay/Outlier-AI-Coder-Hourly-Pay-E2858115_D_KO11,16.htm) |
| **I — Short-form video editing** | **Off-thesis.** Demand is genuinely the fastest-growing Upwork category (+329% for AI video). But it leverages none of your stack and competes on volume. | [Upwork In-Demand Skills 2026](https://investors.upwork.com/news-releases/news-release-details/upworks-demand-skills-2026-demand-top-ai-skills-more-doubles-ai) |
| **J — Digital products** | **Correctly self-rejected in the brief.** Agreed — needs an audience. | — |

---

## 2. Recommended #1 Path

> **Activate First Call and sell a paid Local Visibility Audit to licensed Calgary home-service contractors, sourced from the City of Calgary's open business-licence data, pitched primarily by telephone, with the free automated audit as the door-opener.**

**Why this and not the others:**

1. **The build is done.** Every other opportunity on the list requires you to create a product, a price, a contract, a payment path and a delivery process. You have all five, deployed, with Alberta-law legal docs and a working CRM. Recommending you start an AI automation agency from scratch when you have a finished agency sitting in `C:\Users\carty\firstcall` would be malpractice.
2. **The unit economics already clear the goal in one or two transactions.** $497 × 2 = $994. Foundation = $2,939 on day one. You do not need a funnel; you need roughly 8–15 real conversations.
3. **The lead list is free, legal, local, and enormous.** 2,671 contractor licences in one API call, under a licence permitting commercial use — and crucially, sourcing leads this way keeps you clear of both Google's ToS and CASL's purchased-list prohibition.
4. **Phone-first converts the legal constraint into an advantage.** Most competitors default to cold email, which in Canada is a minefield where *you* carry the burden of proving consent. B2B calling is DNCL-exempt. Your competitors' compliance anxiety is your open lane.
5. **The free audit tool is a genuinely strong opener** because it produces a real, specific, verifiable finding about *their* website in the first 30 seconds of a call — not a generic pitch. Your audit scanner hits a live site and scores 5 categories including AI Overviews and AI Assistants, which is a 2026-relevant angle the incumbent Calgary agencies largely aren't selling yet. The GEO services market is projected to grow from **USD 1.48B in 2026 at ~45% CAGR** ([Intel Market Research](https://www.intelmarketresearch.com/generative-engine-optimization-services-market-36546)) — real tailwind, and you already built the measurement tool for it.

**The one thing to change before selling:** reprice. See §6.

**Honest risk:** Calgary's SEO/web-design market is visibly competitive — Semrush, DesignRush and multiple listicles show dozens of established local agencies (Konstruct Digital, In Front Marketing, Visibility Drip, BlueHat, Azuro). You are not entering an empty market. You win on (a) the AI-visibility angle most haven't productized, (b) speed of delivery via Claude Code, (c) a concrete free audit rather than a generic consultation, and (d) willingness to do unglamorous phone work. You do **not** win on price — and trying to would actively hurt you, per §6.

---

## 3. First 48-Hour Validation Plan

**Goal of these 48 hours: zero code written on new features, 40 qualified leads in the CRM, 20 live conversations attempted, and a payment path that can accept money.** Nothing here requires spending more than ~$20.

### Hour 0–2 — Verify what's actually live (do not assume)

Your own working log flags several unknowns. Resolve them first:

- [ ] Does a Stripe account exist yet? Are the 7 price IDs created (`STRIPE_PRICE_{FOUNDATION,GROWTH,DOMINATION}_{SETUP,MONTHLY}` + `STRIPE_PRICE_AUDIT`)? Check Stripe dashboard + Vercel env vars.
- [ ] Does a Resend account exist? Is `RESEND_API_KEY` set in Vercel?
- [ ] Has `firstcallconsulting.ai` been purchased? (As of 2026-09-04 it had not.)
- [ ] Is `NEXT_PUBLIC_MAILING_ADDRESS` a real address? **Your compliance note explicitly forbids a real marketing send with the placeholder still in place.** This is a hard blocker on email.
- [ ] Hit `/api/crm/import` with `CRM_IMPORT_SECRET` to confirm it accepts a test row.

### Hour 2–4 — Resolve the payment path (cheapest viable)

You do **not** need Stripe live to take your first $1,000 in Canada.

- **Fastest:** Stripe account creation is free — create it and add the Audit price only ($497). One price, not seven.
- **Backup that works today:** Interac e-Transfer, universal among Canadian SMBs, plus a PDF invoice. Your MSA/SOW already exist.
- **Domain decision:** do **not** spend $160 on the 2-year `.ai` registration to make your first sale. A `.ca` domain is ~$15–25/yr, reads as more local and trustworthy to a Calgary contractor than `.ai` does, and keeps you under the $100 cap. Buy the `.ai` later out of revenue. Never pitch from a `*.vercel.app` URL — that single detail will cost you more deals than the domain costs.

### Hour 4–10 — Build the lead list (this is the highest-leverage block)

Use the Calgary open-data API. Target the licence types I verified have real volume:

```
https://data.calgary.ca/resource/vdjc-pybd.json
  ?$where=licencetypes like '%CONTRACTOR%' AND jobstatusdesc='Licensed'
  &$limit=3000
```

Verified live counts: **"CONTRACTOR" (any) = 2,671** · Contractor (No Provincial Licence Required) = 1,154 · Contractor = 659 · Motor Vehicle Repair & Service = 601 · Massage Centre (Commercial) = 448 · Auto Body Shop = 104.

Fields returned: `tradename`, `address`, `comdistnm` (community district), `licencetypes`, `first_iss_dt`, `exp_dt`, `jobstatusdesc`, `point` (lat/long).

**Critical limitation, be clear-eyed about it:** the dataset has **no email, no phone, no website**. That is not a defect — it's what keeps you compliant. You must enrich each lead by visiting the business's own published website, which is precisely what establishes the CASL s.10(9)(b) conspicuous-publication basis for any later email. Budget ~3 minutes per lead, manual.

Pick **40 leads** on these criteria:
- Licensed status, first issued **≥ 3 years ago** (survived; has cash flow)
- Home-service trade or clinic
- **No website at all**, or a site that is: not mobile-responsive, no HTTPS, Flash-era/table layout, last-updated copyright ≤ 2021, or no Google Business Profile link
- A findable owner name (check the licence trade name against the site's About page / LinkedIn)

Log all 40 into the CRM as `source: "scraper"` → they land as `cold`, which is what gates your send-once outreach logic.

### Hour 10–14 — Run the free audit on your top 20

Run your own `/api/audit` scanner against each of the 20 worst sites. Capture, for each, **one specific, non-generic, verifiable finding** — e.g. "your site doesn't load over HTTPS so Chrome shows visitors a 'Not Secure' warning," or "your robots.txt blocks the crawler ChatGPT uses, so you can't be cited in AI answers." That sentence is your entire cold-call opener.

### Hour 14–30 — Make 20 phone calls

**This is the validation step. Everything before it is setup.**

- B2B calls are **exempt from the National DNCL** ([CRTC](https://crtc.gc.ca/eng/phone/telemarketing/biz.htm)) — but you must still comply with the Telemarketing Rules: identify yourself and your business, provide a contact, and **maintain your own internal do-not-call list** and honour it. Keep calling-hours compliant (weekdays 9:00–21:30, weekends 10:00–18:00, recipient's local time).
- Call trades **7:00–8:30am or 4:00–6:00pm** — owners are on tools midday and the office line often goes to a spouse or dispatcher between.
- Script in §7, Variant 1.
- **Ask for nothing but a 10-minute callback or permission to email the audit.** Getting express consent to email on a recorded call is the cleanest CASL footing available and turns your email engine on legitimately.

### Hour 30–40 — Email only where implied consent is genuinely established

Send to **at most 20** addresses, each satisfying all three s.10(9)(b) tests: the address is conspicuously published by the business; it carries no notice refusing commercial messages; and your message is relevant to their business role. Every send must carry sender ID, real mailing address, and the working one-click unsubscribe you already built. **Remember you carry the onus of proving consent** — so log, per lead, the URL where you found the address and the date. Your CRM notes field is the right place; this is your evidence file.

### Hour 40–48 — Score the signal and decide

| Signal from 20 calls + 20 emails | Read | Action |
|---|---|---|
| ≥1 booked call | Working | Go to §4 Day 3 |
| 0 booked but ≥3 "send me that audit" | Warm | Continue, 40 more calls |
| 0 booked, ≥10 reached, 0 interest | Offer or targeting wrong | Switch vertical (trades → clinics) and retest 40 |
| Couldn't reach 10 humans in 20 calls | List/timing problem, not offer | Fix calling windows before concluding anything |

**Do not write a line of new product code during these 48 hours.** The temptation to polish the audit tool instead of dialling is the single most likely way this plan fails.

---

## 4. First 7-Day Execution Plan

| Day | Focus | Specific tasks | Tools | Deliverable |
|---|---|---|---|---|
| **1** | Infrastructure + list | Verify Stripe/Resend/domain/mailing-address status; create Stripe acct + the single $497 Audit price; buy `.ca` domain (~$20); set Vercel env vars | Stripe, Vercel, registrar | Payment path live; domain resolving |
| **2** | Lead engine | Write `scripts/import-calgary-leads.ts` (Claude Code — see §9) hitting the Calgary open-data API → filter → `POST /api/crm/import`; manually enrich 40 leads with site/phone/owner | Claude Code, Calgary Open Data API, CRM | 40 `cold` leads in CRM, enrichment logged |
| **3** | Audits + first calls | Run audit scanner on 20 worst sites; extract one concrete finding each; **make 20 calls** | `/api/audit`, phone | 20 call outcomes logged; ≥2 callbacks or email-consents |
| **4** | Close attempt #1 + proof asset | Hold any booked calls; build **one** free spec preview homepage for the single best non-converting prospect (2–3 hrs with Claude Code, deploy to Vercel preview URL) | Claude Code, Next.js, Vercel | 1 live preview site as a pitch asset |
| **5** | Volume | 40 more calls using the preview as the hook ("I already rebuilt your homepage, want the link?"); record 2-min Loom (§11) | Phone, Loom | 60 cumulative calls; Loom published |
| **6** | Follow-up + compliant email | Follow-up #1 to everyone contacted Day 3; email only the implied-consent-qualified set; send proposal/SOW links to any warm lead | CRM, Resend, `/legal/sow?package=` | ≥1 proposal out |
| **7** | Review and decide | Score funnel: dials → reached → interested → booked → proposed → closed. Apply §10 pivot criteria honestly | CRM | Written go/pivot decision |

**Day-7 target: ≥60 dials, ≥20 humans reached, ≥3 booked calls, ≥1 proposal out.** Revenue by Day 7 is possible ($497) but not the commitment; the commitment is **pipeline**.

---

## 5. First 30-Day Plan

| Week | Milestone | Revenue target | Key activity |
|---|---|---|---|
| **1** | Machine running | **$0–$497** | Infra live, 40 leads, 60 dials, 1 preview site, 1 proposal. Success = activity, not revenue. |
| **2** | First dollar | **$497–$994** *(goal line crossed)* | Reprice (§6). 100 more dials across 2 verticals. 3 spec previews. Close first Audit. Deliver it in ≤72 hrs — speed is your differentiator and your referral engine. |
| **3** | Upsell + second client | **$1,500–$3,500 cumulative** | Convert the Audit client → Foundation (the audit *is* the Foundation sales call; that's the whole design). Ask every delivered client for one referral. Add Opportunity 3 (missed-call automation) as a $900 setup upsell, not a cold offer. |
| **4** | Repeatable, then recurring | **$3,000–$6,000 cumulative, $400–$900 MRR** | 2nd–3rd client closed. Document the delivery SOP so Claude Code can run it. First monthly retainers bill. Decide whether to buy the `.ai` domain out of revenue. |

**Conservative floor:** 1 Audit sale by Day 14 = $497; 2 by Day 21 = $994. **Realistic base case:** one Foundation close in Weeks 2–3 = $2,939, which overshoots the goal by ~3×. **The goal is therefore best understood as nearly-guaranteed-if-you-dial and impossible-if-you-don't.** The risk in this plan is not market risk. It is the risk that you spend Week 1 refactoring the audit tool.

---

## 6. Pricing & Packages — **all figures CAD**

### The repricing recommendation

Your `pricing-model.md` contains a standing instruction not to change prices without asking, and notes that fixing Growth/Domination/Audit at the *low end* of their ranges was a deliberate tradeoff. I'm respecting that — this is a recommendation with evidence, not a change.

The evidence says your monthly retainers are below the point where Canadian buyers take them seriously:

| Your price | Canadian market evidence | Gap |
|---|---|---|
| Audit $497 one-time | Canadian one-off audits **CA$2,500–$8,000**; ["anything under $500 is almost certainly an automated tool export"](https://rankai.ai/articles/technical-seo-audit-cost-pricing-guide) | You are priced *at* the tool-export threshold while delivering real analysis |
| Foundation $139.99/mo | Canadian SMB local SEO **$500–$2,500/mo**, most pay **$800–$1,500**; ["packages under $500/month are usually automated tools or offshore work"](https://wideripples.com/small-business-seo-pricing-canada/) | ~3.5× below the credibility floor |
| Foundation $2,799 setup | Calgary small-business site $2,000–$8,000, avg $5,000–$6,500 | Reasonable, arguably low |

A $139.99/mo retainer does not just leave money on the table — in this market it is **affirmative evidence to the buyer that you are offshore or automated**. Raising it makes the sale *easier*, not harder.

### Recommended three tiers

**Tier 1 — Local Visibility Audit — $497 one-time** *(keep as-is)*
Your existing price. Deliberately below market as a **paid trial / foot-in-the-door**, not as a profit centre. Its job is to convert a stranger into a paying client in one transaction, then become the sales call for Tier 2.
- Automated 5-category audit (Maps, AI Overviews, AI Assistants, Voice, Website/Reviews)
- Human-reviewed findings + prioritized 90-day action plan
- 30-minute walkthrough call
- **Rationale:** 2 sales = $994 ≈ the goal. At $497 the decision is small enough for a contractor to make alone, without a spouse/partner conversation — which is the real threshold you're pricing against, not a competitor's rate card. Credit the full $497 against Tier 2 if they upgrade within 30 days; this makes it a no-risk yes and is why the low price is strategically fine *here* but not on the retainer.

**Tier 2 — Foundation — $2,799 setup + $399/mo** *(recommend raising monthly from $139.99)*
- Website build/rebuild, Google Business Profile optimization, core local SEO, AI-crawler allowlisting, monthly reporting
- **Rationale:** $399 sits just below the $500 "is this real?" line while nearly tripling MRR per client. At $139.99 you need 8 clients for $1,120 MRR; at $399 you need 3. Same delivery work. If you'd rather not touch the live price, **add the dormant GEO/AI-visibility add-on at $149/mo** — it reaches a defensible $289/mo without editing the Foundation price at all, and that add-on is already scoped in `dormantAddOns`.

**Tier 3 — Growth — $3,800 setup + $599/mo** *(recommend raising monthly from $249)*
- Everything in Foundation + multi-location/service-area pages, content program (human-reviewed), competitor tracking, AI-citation monitoring
- **Rationale:** $599/mo lands inside the verified $500–$2,500 Canadian band and at the low end of the $800–$1,500 norm — defensible, still undercutting local agencies, no longer suspicious.

**Add-on — Missed-Call Rescue — $900 setup + $449/mo**
Missed-call text-back + AI call answering. Verified market: $500–$3,000 setup, $297–$997/mo resale, $99–$299/mo platform cost. Sell **only** to existing clients; it carries your only recurring cost and its value is obvious once you already have their trust and their phone data.

**Always state "CAD" explicitly** on every quote, invoice and price page. Your site's copy was originally drafted USD-flavoured, and a Canadian contractor seeing an unlabelled "$2,799" from a `.ai` domain may assume USD and silently disqualify you.

---

## 7. Outreach Scripts

> **Compliance, non-negotiable.** Email: only to conspicuously published business addresses, with sender ID + real mailing address + working unsubscribe, logging where/when you found each address ([CRTC guidance](https://crtc.gc.ca/eng/com500/guide.htm)) — your `unsubscribe.ts`/`leads.ts` footer handles two of the three automatically, but the **placeholder mailing address must be replaced first**. Phone: B2B is DNCL-exempt ([CRTC](https://crtc.gc.ca/eng/phone/telemarketing/biz.htm)) but you must identify yourself and keep an internal do-not-call list. Never imply you're a local institution you aren't, and never send AI-drafted copy you haven't read.

### Variant 1 — Phone (primary channel)

**Opener (≤20 seconds, lead with the specific finding):**

> "Hi, is this [Owner]? — Josh here, I run First Call, a small shop here in Calgary. I'm not selling you anything on this call. I was going through City of Calgary business licences for [trade] and I ran a free check on [theirdomain.ca]. One thing jumped out: **[specific finding — 'your site doesn't load on HTTPS so Chrome is showing your customers a Not Secure warning' / 'your robots file is blocking the crawler ChatGPT uses, so when someone asks it for a [trade] in [community], you can't come up at all'].** Did you know that was happening?"

Then stop talking. The pause does the work.

**If "no, tell me more":**
> "It's a 15-minute fix on my end. I do a full version of that check — five areas, including whether you show up in Google Maps and in AI assistants like ChatGPT, which is where a real chunk of 'who should I call' searches are going now. It's $497 Canadian, flat, and I turn it around in three days. If you decide you want me to actually do the work after, I credit the whole $497 against it. Want me to email you the free version of what I already found, so you can see the quality first?"

**If "we already have a guy":**
> "Good — honestly, most people don't. Then this is easy: let me send you the free check, and if your guy's already handled all five, you've got a clean second opinion for free and I'll leave you alone. If two or three are open, that's a useful conversation for you to have with him. Fair?"

**If "not interested":**
> "No problem at all — I'll take you off my list and you won't hear from me again. Have a good one."
*(Then actually add them to your internal DNC list. This is a legal obligation, not a courtesy.)*

**Close (always):** "What's the best email for you?" → **that is express consent; log it with the date and the fact it was given verbally on a call.**

### Variant 2 — Email, implied consent, no preview built

**Subject lines (A/B these):**
- `[Business name] — Chrome is flagging your site "Not Secure"`
- `Quick thing I noticed on [theirdomain].ca`
- `[Trade] in [community] — you're invisible to ChatGPT`
- `Free 5-point check for [Business name] (Calgary)`

**Body:**

> Hi [Name],
>
> Josh here — I run First Call, a small SEO and website shop in Calgary. I found your email on your website's contact page and I'm writing about your business's online visibility, so if this isn't your area just let me know and I'll stop.
>
> I ran a free automated check on [theirdomain].ca this morning. One finding stood out:
>
> **[Specific finding, one sentence.]**
>
> [One sentence on the business consequence — e.g. "That warning appears before anyone sees your phone number, and on mobile most people just close the tab."]
>
> I check five areas: Google Maps presence, Google AI Overviews, AI assistants like ChatGPT, voice search, and the website itself. Happy to send the full free report on [Business name] — no charge, no call required. Just reply "send it."
>
> If you'd rather I didn't email again, the unsubscribe link below works instantly.
>
> Josh [Last name]
> First Call — [domain].ca
> [Real street address, Calgary, AB] · [phone]

**Follow-up sequence** (stop immediately on any reply, and note your outreach engine enforces one send per cold lead — these follow-ups must be sent deliberately, not by re-running the batch):
- **+3 days:** `Re: [original subject]` — "Didn't want this to get buried. Still happy to send the [Business name] report — one word reply and it's yours."
- **+7 days:** New angle. `Two other [trade]s in [community] had the same issue` — one sentence of social proof, one sentence of offer.
- **+14 days:** Close the loop. "Last note from me on this — I'll assume the timing isn't right and leave you be. If it changes, the free check is always there: [audit URL]. All the best, Josh." *(A clean exit earns more inbound replies than a fourth pitch, and it keeps you on the right side of CASL's spirit as well as its letter.)*

### Variant 3 — The preview-site pitch (highest converting; use on your best 5–10 leads)

Build the homepage **first**, then reach out. This is where Claude Code's speed becomes a sales weapon rather than an efficiency gain — 2–3 hours of your time produces an asset no competitor will match on a cold approach.

**Phone version:**
> "Hi [Owner], Josh from First Call here in Calgary. Slightly odd call: I rebuilt your homepage over the weekend. No charge, no catch — I do one of these a week for a Calgary trade to show what I can do instead of just describing it. It's live at a private link. Want me to text it to you? If you hate it, tell me and I'll take it down today."

**Email version:**
> Subject: `I rebuilt your homepage — here's the link (no charge)`
>
> Hi [Name],
>
> Josh from First Call, a website and SEO shop here in Calgary. I found your address on your site's contact page.
>
> Rather than describe what I do: I rebuilt your homepage. It's live here → **[preview URL]**
>
> No charge and no obligation. I build one of these a week for a Calgary [trade] because showing beats telling. It loads in under a second, works properly on a phone, and puts your phone number and service area where people actually look.
>
> If you want it, I'll finish the full site and hand it over — $1,800 CAD, about a week. If you don't, say the word and I'll delete it.
>
> Either way it's yours to keep as a reference.
>
> Josh [Last name] · First Call · [domain].ca
> [Real street address, Calgary, AB] · [phone]

**Why this works and the caution:** you've inverted the dynamic — they're now evaluating finished work instead of assessing risk. The caution: **never copy their logo or photography in a way that implies endorsement, never publish the preview on a public indexed URL, and take it down when asked, immediately.** Use an unlisted Vercel preview URL with `noindex`.

---

## 8. Lead List Strategy

### Primary source — City of Calgary Open Data (free, legal, 21,000+ records)

**Portal:** https://data.calgary.ca · **Dataset:** [Calgary Business Licences](https://data.calgary.ca/Business-and-Economic-Activity/Calgary-Business-Licences/vdjc-pybd) · **API:** `https://data.calgary.ca/resource/vdjc-pybd.json` (Socrata/SoQL)

Commercial use is permitted under the City's open data terms ([Open Calgary Terms of Use](https://data.calgary.ca/stories/s/u45n-7awa)) — the City grants a non-exclusive worldwide licence to use, modify and distribute the data for any lawful use.

**Verified live counts (queried 2026-09-11):**

| Licence type | Count | Fit |
|---|---|---|
| Any containing "CONTRACTOR" | **2,671** | ★★★ Core ICP |
| Contractor (No Provincial Licence Required) | 1,154 | ★★★ Small/solo trades — least likely to have a decent site |
| Contractor | 659 | ★★★ |
| Motor Vehicle Repair and Service (1) | 601 | ★★★ High-intent local search |
| Massage Centre (Commercial) | 448 | ★★ Clinic-adjacent, books online |
| Motor Vehicle Dealer — Premises | 251 | ★★ |
| Personal Service (Fitness Conditioning) | 97 | ★★ |
| Auto Body Shop | 104 | ★★★ |
| Retail Dealer — Premises | 2,052 | ★ Lower fit (walk-in, less search-dependent) |
| Food Service — Premises (Seating) | 1,176 | ✗ Avoid — thin margins, aggregator-dominated |

**Useful fields:** `tradename`, `address`, `comdistnm`, `licencetypes`, `first_iss_dt`, `exp_dt`, `jobstatusdesc`, `point`.
**Missing (must enrich manually):** email, phone, website. ~3 min/lead.

### Qualification criteria (all must hold)

1. `jobstatusdesc = 'Licensed'`
2. `first_iss_dt` ≥ 3 years ago — survived the startup window, has revenue
3. Home-service trade, auto, or clinic
4. **Website fails at least two of:** HTTPS present · mobile-responsive · copyright ≥ 2024 · page loads < 3s · visible phone number above the fold · Google Business Profile linked
5. A findable decision-maker name
6. Not already in CRM (your send-once logic depends on clean dedupe)

### Secondary sources

| Source | URL | Use |
|---|---|---|
| Alberta Regional Dashboard | https://regionaldashboard.alberta.ca/region/calgary/number-of-businesses/ | Market sizing — **57,897 businesses in Calgary (2025), +3.01% YoY** |
| Calgary Chamber of Commerce | https://calgarychamber.com/ | Member directory; events are warm-intro territory |
| Calgary Downtown Association | calgarydowntown.com | **2,500+ businesses** in the 120-block core |
| Fourth Street BIA | https://www.4streetcalgary.com/business-directory | Small, curated, retail/clinic heavy |
| Victoria Park BIA | http://www.victoriapark.org/business-directory | Same |
| Calgary Construction Network | https://calgaryconstructionnetwork.com/directory/category/hvac | Trade-specific, self-published contact info (good CASL footing) |
| BBB Calgary | https://www.bbb.org/ca/ab/calgary/category/heating-and-air-conditioning | Accredited trades — pre-qualified as willing to pay for credibility |
| HomeStars Calgary | https://www.homestars.com/heating/hvac-contractor-pros/calgary-alberta | Reviewed trades; review count is a proxy for marketing spend |
| BNI Calgary chapters | https://bnicanada.ca/en-CA/index | **Visiting a chapter is free.** Referral-based, built for exactly this. Highest-quality warm leads available to you. |
| U of C small-business libguide | https://libguides.ucalgary.ca/c.php?g=255232&p=1702968 | Free access to paid directories via library card |

### Channel priority (inverted from the original brief)

1. **Phone** — DNCL-exempt for B2B, no consent burden, fastest signal
2. **In-person / BNI & Chamber** — zero compliance friction, highest trust, slowest
3. **Email** — only on verified implied or express consent; strongest when it follows a call
4. **LinkedIn** — note CASL covers commercial *electronic messages* generally; treat DMs with the same care as email
5. **Do NOT:** scrape Google Maps (ToS), buy lists (explicitly void under CASL), or mass-email unverified addresses

### Explicitly rejected

Your prior standing decision not to scrape Google Maps is correct and should hold. The open-data licence dataset makes it unnecessary: it is larger, legal, structured, and free.

---

## 9. Build Checklist for Claude Code / Cursor

**Ordering principle: nothing here is a new product. Every item either removes a blocker to taking money, or reduces minutes-per-lead.** If an item doesn't do one of those two things, it's not on the list.

### Phase 0 — Verify before building (30 min)

```
Prompt: "Read C:\Users\carty\firstcall\CLAUDE.md and src/lib/content.ts.
Report the current live price of every salesPackage, which Stripe env vars
are referenced in src/lib/stripe.ts, and which are currently unset.
Do not change anything yet."
```

- [ ] Confirm the 7 Stripe price env vars and which are missing
- [ ] Confirm `NEXT_PUBLIC_MAILING_ADDRESS` — real or placeholder? **Hard blocker on email**
- [ ] `vercel ls` / dashboard: confirm production deploy is current
- [ ] Confirm `/crm/setup` redirects to sign-in (manager account exists)

### Phase 1 — Unblock payment (Day 1)

- [ ] Create Stripe account (free). Create **only** `STRIPE_PRICE_AUDIT` ($497 CAD one-time) — resist creating all seven; you need one sellable thing, not a catalogue
- [ ] Set `STRIPE_PRICE_AUDIT` + `STRIPE_SECRET_KEY` in Vercel (Production + Preview)
- [ ] Buy a `.ca` domain (~$20); set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `LEAD_INBOX`, `RESEND_FROM`
- [ ] Set a **real** `NEXT_PUBLIC_MAILING_ADDRESS`
- [ ] **Test the full path with a real $1 price, then a real $497 purchase of your own product, then refund it.** Never discover a broken checkout on a live prospect.
- [ ] Fix the two known jurisdiction bugs: root layout JSON-LD `areaServed: "US"` → `"CA"`; `/markets` headline "across the US" → Calgary/Alberta

### Phase 2 — The lead importer (Day 2, highest-leverage build)

```
Prompt: "Create scripts/import-calgary-leads.ts in the firstcall repo.

It must:
1. Fetch https://data.calgary.ca/resource/vdjc-pybd.json with a SoQL $where
   filtering jobstatusdesc='Licensed' and licencetypes matching a configurable
   list of target types (default: any containing 'CONTRACTOR', plus
   'Motor Vehicle Repair and Service (1)', 'Auto Body Shop').
   Paginate with $limit/$offset; handle the 1000-row default cap.
2. Filter out records whose first_iss_dt is less than 3 years ago.
3. Normalize to the shape POST /api/crm/import expects (read
   src/app/api/crm/import/route.ts for the exact schema — do not guess it).
4. Write a CSV to data/calgary-leads-<date>.csv with empty columns for
   website, email, phone, owner_name, audit_finding, source_url,
   consent_basis, consent_date — these are filled in manually.
5. Only POST rows that have a website filled in; dry-run by default,
   --commit to actually send. Use CRM_IMPORT_SECRET from env.
6. Dedupe against existing CRM leads by tradename+address before sending.

Write it as a standalone tsx script. Add an npm script. No new dependencies
beyond what's already in package.json."
```

- [ ] Test with `--limit 10` dry run first
- [ ] Verify imported leads land as `cold` (so send-once outreach gating applies)
- [ ] Confirm dedupe works by running it twice

### Phase 3 — Sales assets (Day 3–4)

- [ ] **Audit-finding extractor:** `"Add a --summary flag to the audit that outputs the single highest-severity finding as one plain-English sentence a non-technical contractor would understand, with no jargon and no acronyms."` — this sentence *is* your cold-call opener, so it's worth iterating on
- [ ] **Spec preview template:** `"Create a reusable single-page Next.js template at templates/trade-preview/ for a Calgary home-service business: hero with business name + city + phone as a tap-to-call link, services grid, service-area list, reviews placeholder, sticky mobile call button. Lighthouse 95+, accessible, noindex meta tag, CSS-variable theming so I can rebrand it in one file per prospect."`
- [ ] Deploy each preview to an **unlisted Vercel preview URL with `noindex`** — never a public indexed page
- [ ] **Audit PDF output:** `"Add a print stylesheet to the audit report route so it exports cleanly to a branded PDF — this is the $497 deliverable."`

### Phase 4 — Follow-up and CRM hygiene (Day 5–6)

- [ ] `"Add an internal do-not-call / do-not-contact flag to the CRM lead model and a migration. Exclude flagged leads from every outreach path including runOutreachBatch. This is a legal requirement under the CRTC Telemarketing Rules, so make it a hard exclusion, not a UI filter."`
- [ ] `"Add consent_basis (express|implied_conspicuous|none), consent_source_url and consent_date fields to the lead model. Block sendOutreachEmail when consent_basis is 'none'. Surface them in the lead detail view."` — this is your CASL evidence file, and the onus of proof is on you
- [ ] Verify Resend free tier is live and the unsubscribe link actually works end-to-end (click it, confirm suppression)

### Phase 5 — Only after first revenue

- [ ] Activate remaining 6 Stripe prices
- [ ] Build the GEO add-on CRM attach-flow (the one genuine unbuilt-feature gap)
- [ ] Refresh `docs/command-center.html` (still shows Foundation-only pricing)
- [ ] Resolve the stale `worktree-seo-agents-backend` worktree — **needs your explicit sign-off, don't let an agent force-remove it**
- [ ] Consider the `.ai` domain out of revenue

### Testing gates

| Before | Must pass |
|---|---|
| Any outreach send | Unsubscribe link clicked and confirmed suppressing; real mailing address present in footer |
| Any paid checkout offer | One real end-to-end $497 purchase + refund, by you |
| Any lead import `--commit` | Dry run reviewed; dedupe verified across two runs |
| Any preview site sent | Lighthouse mobile ≥ 90; `noindex` confirmed in response headers; tap-to-call works on a real phone |

---

## 10. Pivot Criteria

Tie each to a **count of attempts**, never to elapsed time alone — "it's been two weeks" with 12 dials made is not evidence about the market, it's evidence about the dialling.

| Checkpoint | Failure signal | Diagnosis | Action |
|---|---|---|---|
| **Day 2** | Can't get 40 qualified leads from the open-data API | Technical or filter problem | Fall back to BBB + HomeStars + Calgary Construction Network directories manually. Do not let this block Day 3 |
| **Day 3** | 20 dials, fewer than 8 humans reached | Calling windows wrong, not market | Shift to 7:00–8:30am / 4:00–6:00pm. **Do not conclude anything about the offer yet** |
| **Day 7** | 60 dials, 20+ reached, **0** asked for the free audit | The *opener* is failing, not the offer | Rewrite the opener around a harder, more visceral finding (money lost, not technical defect). Test 40 more dials |
| **Day 10** | 100 dials, 0 booked calls | Vertical mismatch | Switch vertical: trades → dental/physio/massage clinics (448 commercial massage licences; clinics have front-desk staff, higher margins, and book online). Retest 60 dials |
| **Day 14** | 150 dials across 2 verticals, 0 proposals out | The **offer** is wrong, not the market | Pivot offer, keep the list: lead with the **free spec-built preview site** (§7 Variant 3) instead of the audit. Reframe from "diagnosis" to "finished thing you can have" |
| **Day 21** | 3+ proposals out, 0 closed | Pricing, trust, or closing problem | Interview two lost prospects — actually ask. If price: offer $497 in 2 payments, or a $197 mini-audit. If trust: get one free case study done for a friend's business and lead with it |
| **Day 21** | Interest is real but only for website work, not SEO | Market is telling you something useful | **Listen.** Move to Opportunity #2 as the primary offer at $1,800–$3,500, with the retainer as the upsell. This is a win, not a pivot |
| **Day 28** | **$0 revenue** after ~200 dials, both verticals, both offers | Local outbound isn't converting for you right now | Run Opportunity #4 in parallel: Upwork/Contra, 10 tailored proposals/day on AI-integration and n8n jobs. Keep First Call alive on 20 dials/day — don't abandon a built asset, de-prioritize it |
| **Day 42** | Still $0 across both | Re-examine the constraint honestly | The issue is most likely sales volume or delivery proof, not opportunity selection. Take one $300–$500 job below your rate purely to manufacture a case study and a testimonial |
| **Any time** | Cash needed for tools/domain | — | Opportunity #5 (Outlier et al.) for a single weekend. **Cap it at 10 hours.** It is an expense-coverage tool, never a plan |

### Anti-pivot rules (the more important half)

Most failures here won't be picking the wrong opportunity — they'll be abandoning the right one too early, or substituting building for selling.

- **Do not pivot before 100 logged dials.** Below that you have no data, only discomfort.
- **Do not pivot because you'd rather be coding.** Build-avoidance-of-sales is the predicted failure mode for this specific operator, given a finished product sitting unsold and an unpurchased domain deferred twice.
- **Do not add a second offer before the first has 100 dials.** Two half-tested offers produce no signal from either.
- **Do not drop the price to close.** You're already 3.5× below the Canadian credibility floor; a discount reads as confirmation that you're the automated/offshore option.
- **Do not start a new repo.** If a plan's first step is `git init`, you have pivoted away from your actual advantage.

---

## 11. Supporting Assets

### A. Landing page copy — the $497 Audit

**Headline:**
> Find out why Calgary customers aren't finding you — in 3 days, for $497.

**Subheadline:**
> A real technical and local-visibility audit of your business across Google Maps, Google AI Overviews, ChatGPT and voice search. Human-reviewed, not a tool export. Built in Calgary, for Calgary trades and clinics.

**Above-fold trust line:**
> Flat $497 CAD. Three business days. Credited in full if you hire us for the work.

**Features (5, each an outcome and a proof):**

1. **We check whether ChatGPT can even see you.** When a Calgary homeowner asks an AI assistant for a plumber in Altadore, something gets recommended. We check whether it can be you — and most sites we audit are actively blocking the crawlers that decide.
2. **Google Maps is where the calls come from.** We audit your Google Business Profile against the factors that drive Local Pack placement — categories, service areas, review velocity, photo recency, NAP consistency across directories.
3. **Your website, measured, not guessed at.** Core Web Vitals, mobile usability, HTTPS, crawlability, structured data, 25+ checks. You get the numbers and what each one costs you.
4. **A 90-day plan in plain English, in priority order.** Not a 60-page PDF you'll never open. The three things that matter most, what each is worth, and whether you can do it yourself.
5. **A real person walks you through it.** 30 minutes, on the phone, and you can ask "so what do I actually do Monday?" — which is the only question that matters.

**Pricing block:**

| | **Audit** | **Foundation** | **Growth** |
|---|---|---|---|
| | **$497** one-time | **$2,799** + $399/mo | **$3,800** + $599/mo |
| | Diagnose the problem | Fix it and maintain it | Outrank the competition |
| Full 5-category audit | ✓ | ✓ | ✓ |
| 90-day action plan | ✓ | ✓ | ✓ |
| Walkthrough call | ✓ | ✓ | ✓ |
| Website build/rebuild | — | ✓ | ✓ |
| Google Business Profile optimization | — | ✓ | ✓ |
| AI-crawler allowlisting | — | ✓ | ✓ |
| Monthly reporting | — | ✓ | ✓ |
| Multi-location / service-area pages | — | — | ✓ |
| Content program (human-reviewed) | — | — | ✓ |
| AI-citation monitoring | — | — | ✓ |

*All prices CAD. Audit fee credited in full against Foundation or Growth within 30 days.*

**Primary CTA:** `Get my audit — $497 CAD` → `/start?package=audit`
**Secondary CTA:** `Run the free 60-second check first` → audit tool
**Risk reducer:** *If the audit turns up nothing worth fixing, I'll tell you that and refund you. It's happened, and it's better than selling you a retainer you don't need.*

**Objection-handling FAQ:**
- *Why so cheap when other audits are $2,500+?* Because it's how I meet clients, and because the automated layer is genuinely automated — I charge for the review and the plan, not for running a crawler. Canadian one-off audits typically run $2,500–$8,000.
- *Do I have to buy anything else?* No. Many people take the plan and do it themselves. That's a fine outcome.
- *Are you actually in Calgary?* Yes — [address]. You can phone me: [number].

### B. CRM / lead-tracker column structure

Your CRM already exists; these are the fields that matter for *this* campaign. Note the consent columns — they're your CASL evidence file, and under CRTC guidance **the onus of proving consent is on you**, so treat them as non-optional.

| Column | Type | Notes |
|---|---|---|
| `lead_id` | string | From `getbusid` (Calgary open data) — stable dedupe key |
| `trade_name` | string | From dataset |
| `licence_types` | string | From dataset |
| `address` | string | From dataset |
| `community` | string | `comdistnm` — drives "a [trade] in [community]" personalization |
| `first_issued` | date | Proxy for business age; filter ≥3 yrs |
| `website` | url | **Manual.** Blank = don't import |
| `site_verdict` | enum | `none` / `broken` / `dated` / `decent` — prioritization |
| `email` | string | **Manual**, from their published contact page |
| `phone` | string | **Manual** |
| `owner_name` | string | **Manual** |
| `audit_score` | int | From your scanner |
| `audit_finding` | text | The ONE sentence used as the opener |
| **`consent_basis`** | enum | `express` / `implied_conspicuous` / `none` — gates all email |
| **`consent_source_url`** | url | Exact page where the address was published |
| **`consent_date`** | date | When you observed it |
| **`do_not_contact`** | bool | Internal DNC — **hard exclusion from every send path** |
| `status` | enum | `cold`→`warm`→`hot`→`won`/`lost` (derived — don't set manually) |
| `channel_first_touch` | enum | `phone` / `email` / `in_person` / `referral` |
| `dial_count` | int | Attempts, not connections |
| `reached_human` | bool | The key funnel metric |
| `preview_built` | bool | Whether a spec site exists |
| `preview_url` | url | Unlisted Vercel URL |
| `proposal_sent_at` | datetime | |
| `package_quoted` | enum | audit / foundation / growth |
| `amount_quoted_cad` | decimal | Always CAD |
| `outcome` | enum | `won` / `lost` / `no_response` / `dnc` |
| `lost_reason` | enum | `price` / `timing` / `has_provider` / `no_need` / `no_decision` — **the most valuable column you have** |
| `next_action` / `next_action_date` | text / date | If blank, the lead is dead by neglect |

**Funnel metrics to compute weekly:** dials → reached (target ≥35%) → interested (≥25% of reached) → booked (≥40% of interested) → proposed → closed (≥25% of proposed). When a number is far off target, it localizes the problem to one stage instead of indicting "the market."

### C. Two-minute Loom demo script

**Purpose:** sent after a call or in reply to "send me more info." Record once, reuse. Screen-share with your face in the corner — for a trades audience, a visible local human matters more than polish.

**[0:00–0:15] — Open with their name, not yours**
> "Hey [Name], Josh here from First Call in Calgary. Quick two minutes — I want to show you what I actually found on [theirdomain].ca, rather than just tell you about it. I'll put this in writing too, so don't worry about taking notes."

**[0:15–0:45] — Show the problem on their real site**
*(Screen-share their live site, mobile viewport.)*
> "So this is your site on a phone, which is how about 70% of people are going to see it. Couple of things: [point at it] here's the Not-Secure warning Chrome shows — that's before anyone's seen your phone number. And I had to scroll twice to find a way to call you. For someone with a furnace out in February, that's usually the end of the visit."

**[0:45–1:15] — Show the invisible problem**
*(Screen-share ChatGPT or the audit output.)*
> "Here's the part most people don't know about. I asked ChatGPT for a [trade] in [community]. It named four businesses. You're not one of them — and it's not because you're not good, it's because your robots file is blocking the crawler it uses. That's a config change, not a rebuild. But right now every one of those searches goes to a competitor."

**[1:15–1:45] — Name the deliverable precisely**
> "What I do is check five areas — Maps, Google's AI answers, assistants like ChatGPT, voice, and the site itself. You get the findings, what each one's costing you, and a 90-day plan in priority order, plus half an hour with me on the phone to go through it. Flat $497 Canadian, three business days. And if you decide you want me to do the work, the whole $497 comes off that."

**[1:45–2:00] — One single ask**
> "If that's useful, the link's below this video and you can pay on the page — or just reply to this email and I'll invoice you, whatever's easier. And if it's not a fit, no hard feelings at all, genuinely. Either way, the two things I showed you are real and worth fixing. Thanks [Name]."

**Rules:** under 2:00 (completion rate falls off a cliff after); say their name three times; show their actual site, never a generic slide; exactly one ask; no music, no intro animation, no script-reading voice. Re-record it per prospect if you can — a Loom that references *their* site converts several times better than a generic one, and it takes six minutes.

---

## Appendix — Source list

### Primary / authoritative

- **Upwork In-Demand Skills 2026** (investor relations, primary) — AI skills demand +109% YoY, AI integration +178%, AI video +329%, AI freelancers earn 34% more/hr — https://investors.upwork.com/news-releases/news-release-details/upworks-demand-skills-2026-demand-top-ai-skills-more-doubles-ai
- **CRTC — CASL Guidance on Implied Consent** (s.10(9)(b) conspicuous publication; onus of proof on sender) — https://crtc.gc.ca/eng/com500/guide.htm
- **CRTC — Business alerts: telemarketing** (B2B calls exempt from National DNCL; Telemarketing Rules still apply) — https://crtc.gc.ca/eng/phone/telemarketing/biz.htm
- **National DNCL — Exemptions** — https://www.lnnte-dncl.gc.ca/en/Organization/Exemptions
- **ISED — Canada's Anti-Spam Legislation** — https://ised-isde.canada.ca/site/canada-anti-spam-legislation/en
- **CASL statute** — https://laws-lois.justice.gc.ca/eng/acts/e-1.6/page-2.html
- **City of Calgary Open Data — Business Licences** (21,000+ active licences; live API verified) — https://data.calgary.ca/Business-and-Economic-Activity/Calgary-Business-Licences/vdjc-pybd
- **Open Calgary Terms of Use** (commercial use permitted) — https://data.calgary.ca/stories/s/u45n-7awa
- **Alberta Regional Dashboard — Calgary business counts** (57,897 businesses, 2025, +3.01%) — https://regionaldashboard.alberta.ca/region/calgary/number-of-businesses/
- **Statistics Canada — Canadian Business Counts, Dec 2025** — https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3310109501
- **Chrome Web Store developer registration** ($5 USD one-time, confirmed) — https://developer.chrome.com/docs/webstore/register
- **Calgary Economic Development — 2026 Economic Outlook** (2.4% growth; ~7% unemployment) — https://www.calgaryeconomicdevelopment.com/newsroom/2026-economic-outlook-diversification-and-innovation-chart-calgarys-path-through-global-turbulence/

### Legal analysis (CASL private right of action repealed 31 Dec 2025)

- Winston & Strawn — https://www.winston.com/en/blogs-and-podcasts/privacy-law-corner/indefinite-delay-of-private-right-of-action-under-canada-s-anti
- Lexology — https://www.lexology.com/library/detail.aspx?g=d49eb365-aae0-4eae-ac5b-0db778fd284f
- Canadian Charity Law — https://www.canadiancharitylaw.ca/blog/casl_no_private_right_of_action_but_changes_to_implied_consent_rules/

### Calgary pricing (competitor pages — self-interested but directly probative of local market rates)

- OxOne — Calgary website cost 2026 ($2,000–8,000; avg $5,000–6,500; freelance $1,500–5,000) — https://oxone.ca/blog/website-cost-calgary-2026
- CodeWeb Calgary — packages $1,000–$20,000; maintenance $75–125/hr — https://codeweb.ca/calgary-web-design-prices/
- Chameleon Ideas — Calgary web design cost — https://chameleon-ideas.com/calgary-web-design-cost/
- In Front Marketing — Calgary web design 2026 — https://infrontmarketing.ca/blog/website-design-development/web-design-in-calgary-what-to-look-for-what-it-costs-what-actually-converts-2026/
- Marvel Marketing (CA) — website design cost guide — https://marvelmarketing.ca/blog/website-design-cost-guide/

### Canadian SEO retainer / audit pricing

- Wide Ripples — small-business SEO pricing Canada ("under $500/mo usually automated or offshore") — https://wideripples.com/small-business-seo-pricing-canada/
- Plan Webbies — local SEO cost Canada ($500–2,500/mo) — https://planwebbies.ca/blog/local-seo-cost-canada/
- SEO Team Toronto — SEO cost Canada ($800–1,500/mo typical) — https://www.seoteamtoronto.ca/blog/how-much-does-seo-cost-canada
- Ren Hao SEO — SEO pricing Canada CAD (one-off audits CA$2,500–8,000) — https://renhaoseo.com/ca/compare/seo-pricing/
- RankAI — technical SEO audit cost ("under $500 is almost certainly an automated tool export") — https://rankai.ai/articles/technical-seo-audit-cost-pricing-guide
- Wise Media — digital agency pricing Canada 2026 — https://wisemedia.io/2026/07/31/digital-agency-pricing-canada-2026/

### Automation / voice AI / freelance rates

- Trillet — voice agent pricing strategy for agencies ($500–3,000 setup; $297–997/mo) — https://trillet.ai/blogs/voice-agent-pricing-strategy-guide
- Ringlyn — white-label voice AI margins 2026 (50–70%) — https://www.ringlyn.com/blog/white-label-ai-voice-agent-pricing-margins-2026/
- VoiceAI Connect — white-label pricing — https://www.myvoiceaiconnect.com/blog/white-label-ai-receptionist-pricing-breakdown
- Sonant — missed-call text-back software comparison (Weave from $199/mo USD) — https://www.sonant.ai/blog/missed-call-text-back
- Sales Captain — missed-call text-back cost/mo — https://blog.salescaptain.com/missed-call-text-back-cost-per-month-2026-guide/
- Ciela AI — freelance AI automation rates 2026 ($40–100/hr n8n; $125–250 senior) — https://ciela.ai/blogs/freelance-ai-automation-rates-2026
- Ciphernutz — n8n expert cost 2026 — https://ciphernutz.com/blog/hire-n8n-expert-cost-pricing-guide
- Upwork — hire n8n experts — https://www.upwork.com/hire/n8n-experts/
- Upwork hourly rates by skill — https://www.upwork.com/resources/upwork-hourly-rates

### AI data-contribution rates (Opportunity 5)

- Breaking Even — Outlier AI pay per hour 2026 ($12–45/hr real rates; declining YoY) — https://breakingeven.online/blog/outlier-ai-pay-per-hour-2026
- Breaking Even — AI gig economy analysis — https://breakingeven.online/blog/ai-gig-economy-trap-outlier-alignerr
- Glassdoor — Outlier AI coder hourly pay — https://www.glassdoor.com/Hourly-Pay/Outlier-AI-Coder-Hourly-Pay-E2858115_D_KO11,16.htm

### GEO / AI-visibility market

- Intel Market Research — GEO services market (USD 1.48B 2026 → 17.02B 2034, 45.5% CAGR) — https://www.intelmarketresearch.com/generative-engine-optimization-services-market-36546
- MarketScale — AI answer-engine visibility as measurable discipline 2026 — https://www.marketscale.com/industries/marketing-tech/ai-answer-engine-visibility-becomes-a-measurable-discipline-as-geo-platforms-multiply-in-2026
- Omnibound — GEO statistics 2026 — https://www.omnibound.ai/blog/generative-engine-optimization-statistics

### Calgary lead sources & communities

- Calgary Chamber of Commerce — https://calgarychamber.com/
- City of Calgary, for business — https://www.calgary.ca/for-business.html
- Fourth Street BIA directory — https://www.4streetcalgary.com/business-directory
- Victoria Park BIA directory — http://www.victoriapark.org/business-directory
- Calgary Construction Network (HVAC) — https://calgaryconstructionnetwork.com/directory/category/hvac
- BBB Calgary — HVAC category — https://www.bbb.org/ca/ab/calgary/category/heating-and-air-conditioning
- HomeStars Calgary HVAC — https://www.homestars.com/heating/hvac-contractor-pros/calgary-alberta
- BNI Canada — https://bnicanada.ca/en-CA/index
- U of C small business libguide — https://libguides.ucalgary.ca/c.php?g=255232&p=1702968
- Semrush — Calgary local SEO agencies (competitive landscape) — https://agencies.semrush.com/list/local-seo/calgary/small-business/
- DesignRush — top Calgary SEO companies — https://www.designrush.com/agency/search-engine-optimization/ca/calgary

### Internal (this machine — strongest evidence in the entire document)

- `C:\Users\carty\firstcall\CLAUDE.md` — architecture, deployment status, open blockers, working log
- `C:\Users\carty\firstcall\docs\business\pricing-model.md` — live prices and pricing rationale
- `C:\Users\carty\firstcall\docs\business\compliance-rules.md` — CASL/PIPEDA implementation, outreach-agent design
- `C:\Users\carty\firstcall\docs\business\business-context.md` — confirmed Calgary/Canadian ICP
- `C:\Users\carty\.claude\agents\growth-strategist.md` — Section 17 operating rules

### Claims I could NOT substantiate (treat as unverified)

1. **Reddit validation generally** — reddit.com is inaccessible to this crawler at both fetch and search layers. No Reddit-based claim in the original brief could be verified or refuted.
2. **"AI prompt systems, $300–$1,000/system" (Opp. F)** — no evidence of a real buyer market found.
3. **"AI content systems, $1,000–$3,000/mo retainers" (Opp. E)** — plausible for established operators; no primary evidence for a solo newcomer, and it conflicts with your own no-unreviewed-AI-content rule.
4. **"Chrome extension $9–49 one-time → $1,000" (Opp. G)** — the $5 fee is confirmed; the revenue path is not.
5. **Specific closed-deal prices for MVP work ($500–$2,000)** — hourly rates are well-sourced; fixed-price outcomes are not. Upwork and Fiverr both block this crawler (HTTP 403), so live job-posting budgets could not be read directly; rate figures come from aggregators citing those platforms.
6. **"2026 CASL amendment eliminated implied consent"** — asserted by several SEO blogs, **contradicted** by CRTC primary sources. False.
7. **Precise Calgary sector business counts** — the 57,897 total is solid; the per-sector split requires downloading the Alberta dashboard CSV, which I could not parse in-session. The licence-type counts in §8 are from my own live API queries and *are* verified.
