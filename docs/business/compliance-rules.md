---
name: firstcall-compliance-rules
description: CASL and PIPEDA rules that must govern any email/lead-capture code in the firstcall repo
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3c9e8418-9912-4187-ae76-f91f185d848c
  modified: 2026-08-24T02:00:09.301Z
---

Any code in the `firstcall` repo that sends email, captures leads, or handles personal data must comply with Canadian law, not US-style assumptions:

- **CASL** (Canada's Anti-Spam Legislation) applies to every commercial electronic message: requires (1) consent — express or clearly-implied via an existing business relationship, never purchased/scraped lists, (2) sender identification including a **valid mailing address**, (3) a working unsubscribe actioned promptly (we implemented one-click, immediate). Penalties run up to CAD $10M per violation for a business.
- **PIPEDA** governs personal data generally: collect only what's needed, state the purpose, protect it, and let people access/correct/delete their data on request.

**Why:** Confirmed 2026-08-23 the business is Calgary/Alberta-based (see [[firstcall_business_context]]), which makes CASL/PIPEDA the applicable regime instead of CAN-SPAM/US state privacy law. The site's privacy page previously said "if you are in a US state..." — this was wrong and has been corrected.

**How to apply:** Already implemented as of the 2026-08-23 session — `src/lib/unsubscribe.ts` (signed one-click unsubscribe + suppression list) and `src/lib/leads.ts` (checks suppression, appends mailing address + unsubscribe link to every client-facing email). `site.mailingAddress` in `src/lib/content.ts` reads from `NEXT_PUBLIC_MAILING_ADDRESS` and is a placeholder until the user sets a real one — **do not let a real marketing send go out with the placeholder address still in place**. Any new feature that emails a lead/customer (not just internal notifications to the business's own inbox) must reuse this suppression check and footer, not roll its own.
