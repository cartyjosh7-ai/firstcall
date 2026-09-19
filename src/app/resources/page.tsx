import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { guides } from "@/lib/content";
import { HeroPanel } from "@/components/motion/hero-panel";

export const metadata: Metadata = { title: "Resources" };

const d = (n: number) => ({ "--d": n }) as CSSProperties;

export default function ResourcesPage() {
  return (
    <>
      <HeroPanel className="pb-6 pt-16">
        <div className="mx-auto max-w-3xl px-5">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
            <span className="ruleline">Guides</span>
          </p>
          <h1 className="reveal mt-3 font-serif text-5xl" style={d(1)}>
            Plain English on local SEO, AEO, GEO, and voice.
          </h1>
        </div>
      </HeroPanel>

      <div className="mx-auto max-w-3xl px-5 pb-12">
        <ul className="mt-4 space-y-4">
          {guides.map((g, i) => (
            <li key={g.slug} className="whycard reveal border-t border-line pt-6" style={d(i)}>
              <Link href={`/resources/${g.slug}`} className="linkarrow font-serif text-2xl">
                {g.title}
                <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <p className="mt-2 text-muted">{g.dek}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
