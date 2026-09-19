import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Cta } from "@/components/chrome";
import { HeroPanel } from "@/components/motion/hero-panel";

export const metadata: Metadata = { title: "Results" };

const d = (n: number) => ({ "--d": n }) as CSSProperties;

const cases = [
  ["Regional HVAC", "Map pack target: Top 3 for core service + city terms", "60–90 days for first local wins. Every call tracked from day one."],
  ["Roofing", "Map pack target: Top 3 for storm and replacement terms", "Real-review velocity. No gating, no incentives."],
  ["Remediation", "Map pack target: Top 3, zone by zone across every service area", "Near-me visibility zone by zone. Trust in under five seconds."],
];

export default function ResultsPage() {
  return (
    <>
      <HeroPanel className="pb-6 pt-16">
        <div className="mx-auto max-w-3xl px-5">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
            <span className="ruleline">Proof</span>
          </p>
          <h1 className="reveal mt-3 font-serif text-5xl" style={d(1)}>
            The only three questions we answer: more visible, more calls, what&apos;s next.
          </h1>
          <p className="reveal mt-4 text-muted" style={d(2)}>
            These are the targets the engagement model signs up for, not client claims. First Call is a
            new firm and publishes no performance numbers until real engagements produce them.
          </p>
        </div>
      </HeroPanel>

      <div className="mx-auto max-w-3xl px-5 pb-4">
        <div className="mt-4 space-y-6">
          {cases.map(([label, h, body], i) => (
            <article key={label} className="whycard reveal border-t border-line pt-6" style={d(i)}>
              <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
              <h2 className="mt-2 font-serif text-2xl">{h}</h2>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </article>
          ))}
        </div>
      </div>
      <Cta />
    </>
  );
}
