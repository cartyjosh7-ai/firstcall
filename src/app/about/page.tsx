import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Cta } from "@/components/chrome";
import { HeroPanel } from "@/components/motion/hero-panel";

export const metadata: Metadata = { title: "About" };

const d = (n: number) => ({ "--d": n }) as CSSProperties;

const values = [
  ["Evidence over opinion", "if we cannot measure it, we do not claim it."],
  ["Own the outcome", "senior strategists, end to end."],
  ["Built to be chosen", "reviews, citations, structured authority."],
  ["Clarity beats cleverness", "the plan in your words."],
  ["Compound, do not chase", "owned assets, not rented traffic."],
  ["Tell the truth", "honest timelines, no fabricated numbers."],
];

export default function AboutPage() {
  return (
    <>
      <HeroPanel className="pb-6 pt-16">
        <div className="mx-auto max-w-3xl px-5">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
            <span className="ruleline">Who we are</span>
          </p>
          <h1 className="reveal mt-3 font-serif text-5xl" style={d(1)}>
            The seasoned navigator for how customers search now.
          </h1>
          <p className="reveal mt-4 text-muted" style={d(2)}>
            First Call is a standalone firm built for one job: making owner-led local and home-service
            businesses the most visible, most trusted, most chosen name in their market.
          </p>
          <p className="reveal mt-6 text-muted" style={d(3)}>
            You built a great business the hard way. Then the ground moved. Customers started asking an
            assistant, glancing at a map, speaking into a phone, and deciding in seconds. First Call
            exists for this moment.
          </p>
        </div>
      </HeroPanel>

      <div className="mx-auto max-w-3xl px-5 pb-4">
        <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
          <span className="ruleline">Six values, no exceptions</span>
        </p>
        <ol className="mt-8 space-y-6">
          {values.map(([t, b], i) => (
            <li
              key={t}
              className="whycard reveal flex gap-5 border-t border-line pt-5"
              style={d(i + 1)}
            >
              <span className="font-mono text-sm text-gold">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-serif text-xl">{t}</p>
                <p className="mt-1 text-sm text-muted">{b}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Cta title="Work with senior people who own the result." />
    </>
  );
}
