import type { Metadata } from "next";

export const metadata: Metadata = { title: "Foundation month-1 playbook" };

export default function PlaybookPage() {
  const days = [
    ["Day 1", "Kickoff. Collect GBP, GSC, GA4, call tracking, CMS, and a single owner contact. Confirm NAP."],
    ["Day 2", "Baseline: map pack screenshots, review count/recency, citation sample, site crawl, schema inventory, current monthly calls/jobs (honest zeros allowed)."],
    ["Day 3", "Primary category research. Do not guess."],
    ["Day 4–5", "GBP completeness: hours, services, photos, description, booking/call, Q&A."],
    ["Day 6", "Review acquisition: short SMS/email ask, QR at invoice, response SLA for every review. No gating, no incentives that violate platform rules."],
    ["Day 7–8", "Citation audit (major + trade directories). Fix mismatches."],
    ["Day 9–11", "On-page: title/H1, NAP in footer, LocalBusiness JSON-LD, click-to-call, five-second trust band."],
    ["Day 12–14", "One foundational service+city page that is actually useful. Not a thin door."],
    ["Day 15", "Tracking: calls, forms, source. If no call tracking yet, document the workaround."],
    ["Day 16–20", "Photo and post cadence on GBP. Interior pages linked."],
    ["Day 21–25", "llms.txt, FAQ block, robots/sitemap hygiene."],
    ["Day 26–28", "Draft month-1 report: baselines, work shipped, next 30 days."],
    ["Day 29–30", "Owner review meeting. Confirm what 'more calls' will mean in month 2."],
  ];

  return (
    <article className="prose-fc mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Delivery</p>
      <h1 className="font-serif text-5xl text-paper">Month 1 Foundation playbook</h1>
      <p>
        Repeatable checklist for the first paying client. Reporting can be baseline-only. Do not
        fabricate rankings or revenue.
      </p>
      <ol>
        {days.map(([d, b]) => (
          <li key={d}>
            <strong className="text-paper">{d}.</strong> {b}
          </li>
        ))}
      </ol>
      <h2>Monthly report skeleton</h2>
      <ul>
        <li>Visibility: map pack positions we can screenshot, profile actions if available.</li>
        <li>Calls / form leads / booked jobs (and the source of the number).</li>
        <li>Work completed vs playbook.</li>
        <li>What we will do next month, in the owner&apos;s words.</li>
      </ul>
    </article>
  );
}
