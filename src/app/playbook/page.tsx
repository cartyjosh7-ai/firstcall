import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { HeroPanel } from "@/components/motion/hero-panel";

export const metadata: Metadata = { title: "Foundation month-1 playbook" };

const delay = (n: number) => ({ "--d": n }) as CSSProperties;

const days: [string, string][] = [
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

export default function PlaybookPage() {
  return (
    <>
      <HeroPanel className="pb-6 pt-16">
        <div className="mx-auto max-w-3xl px-5">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={delay(0)}>
            <span className="ruleline">Delivery</span>
          </p>
          <h1 className="reveal mt-3 font-serif text-5xl" style={delay(1)}>
            Month 1 Foundation playbook
          </h1>
          <p className="reveal mt-4 text-muted" style={delay(2)}>
            Repeatable checklist for the first paying client. Reporting can be baseline-only. Do not
            fabricate rankings or revenue.
          </p>
        </div>
      </HeroPanel>

      <div className="mx-auto max-w-3xl px-5 pb-4">
        <ol className="mt-4 space-y-4">
          {days.map(([day, body], i) => (
            <li key={day} className="whycard reveal flex gap-5 border-t border-line pt-5" style={delay(i)}>
              <span className="font-mono text-xs text-gold whitespace-nowrap pt-1">{day}</span>
              <p className="text-muted">{body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 pb-8">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={delay(0)}>
            <span className="ruleline">Monthly report skeleton</span>
          </p>
          <ul className="reveal mt-6 space-y-3 text-muted" style={delay(1)}>
            <li>— Visibility: map pack positions we can screenshot, profile actions if available.</li>
            <li>— Calls / form leads / booked jobs (and the source of the number).</li>
            <li>— Work completed vs playbook.</li>
            <li>— What we will do next month, in the owner&apos;s words.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
