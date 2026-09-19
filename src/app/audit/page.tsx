import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AuditForm } from "@/components/forms";
import { Cta } from "@/components/chrome";
import { HeroPanel } from "@/components/motion/hero-panel";

export const metadata: Metadata = {
  title: "Free 100-Point Visibility Audit, Scored Live",
};

const d = (n: number) => ({ "--d": n }) as CSSProperties;

const points = [
  ["Google & Maps · 20", "Profile signals, NAP, schema, hours, map path."],
  ["AI Overviews · 20", "FAQ, schema, answer-first interior pages."],
  ["Assistants · 15", "Entity, facts, llms.txt, corroboration."],
  ["Voice · 15", "tel: links, viewport, CTA, readable prose."],
];

export default function AuditPage() {
  return (
    <>
      <HeroPanel className="pb-6 pt-16">
        <div className="mx-auto max-w-3xl px-5">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
            <span className="signalbars">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span className="ruleline">Free · 100 points · Live scan</span>
          </p>
          <h1 className="reveal mt-3 font-serif text-5xl" style={d(1)}>
            See where customers can&apos;t find you.
          </h1>
          <p className="reveal mt-4 text-muted" style={d(2)}>
            This scans your site live, scores it out of 100 across five surfaces, and names every gap in
            plain English. It runs in seconds. A senior strategist reviews the result by hand afterwards.
          </p>
          <ul className="reveal mt-6 space-y-2 text-sm text-muted" style={d(3)}>
            <li>— Your score on screen in about ten seconds</li>
            <li>— Then a senior strategist reviews it by hand and adds what a scanner cannot see</li>
            <li>— Yours to keep, whether we work together or not</li>
          </ul>
        </div>
      </HeroPanel>

      <div className="mx-auto max-w-3xl px-5 pb-4">
        <div className="reveal" style={d(0)}>
          <AuditForm />
        </div>
        <section className="mt-16 pb-8">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
            <span className="ruleline">What&apos;s inside the 100 points</span>
          </p>
          <div className="mt-8 grid gap-6 text-sm text-muted md:grid-cols-3">
            {points.map(([t, b], i) => (
              <div key={t} className="whycard reveal border-t border-line pt-4" style={d(i + 1)}>
                <h3 className="font-serif text-xl text-paper">{t}</h3>
                <p className="mt-2">{b}</p>
              </div>
            ))}
            <div className="whycard reveal border-t border-line pt-4 md:col-span-3" style={d(points.length + 1)}>
              <h3 className="font-serif text-xl text-paper">Website & reviews · 30</h3>
              <p className="mt-2">
                HTTPS, titles, speed of the live fetch, robots, reviews, contact. The scanner reports
                what it can see on your site. It does not estimate traffic or rankings.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Cta title="Ready to see your real score?" />
    </>
  );
}
