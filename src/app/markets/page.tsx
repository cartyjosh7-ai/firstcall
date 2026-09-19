import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Cta } from "@/components/chrome";
import { HeroPanel } from "@/components/motion/hero-panel";

export const metadata: Metadata = { title: "Markets" };

const d = (n: number) => ({ "--d": n }) as CSSProperties;

export default function MarketsPage() {
  return (
    <>
      <HeroPanel className="pb-16 pt-16">
        <div className="mx-auto max-w-3xl px-5">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
            <span className="ruleline">Coverage</span>
          </p>
          <h1 className="reveal mt-3 font-serif text-5xl" style={d(1)}>
            Local and home-service businesses across Canada.
          </h1>
          <p className="reveal mt-4 text-muted" style={d(2)}>
            Foundation is built for a single location and a defined service area. We do not publish a
            national visibility index with invented scores. If you want a read on your market, run the
            audit.
          </p>
        </div>
      </HeroPanel>
      <Cta />
    </>
  );
}
