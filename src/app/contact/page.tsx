import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ContactForm } from "@/components/forms";
import { site } from "@/lib/content";
import { Cta } from "@/components/chrome";
import { HeroPanel } from "@/components/motion/hero-panel";

export const metadata: Metadata = { title: "Contact" };

const d = (n: number) => ({ "--d": n }) as CSSProperties;

export default function ContactPage() {
  return (
    <>
      <HeroPanel className="pb-6 pt-16">
        <div className="mx-auto max-w-3xl px-5">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
            <span className="ruleline">Contact</span>
          </p>
          <h1 className="reveal mt-3 font-serif text-5xl" style={d(1)}>
            Let&apos;s make you the first call.
          </h1>
          <p className="reveal mt-4 text-muted" style={d(2)}>
            Tell us about your business and market. A senior strategist will get back to you within one
            business day.
          </p>
          <div className="whycard reveal mt-8 rounded-2xl border border-line p-6 text-sm" style={d(3)}>
            <p className="text-xs uppercase tracking-widest text-muted">Direct line</p>
            <p className="mt-2 font-serif text-2xl">
              <a href={`mailto:${site.email}`} className="linkarrow">
                {site.email}
              </a>
            </p>
            <p className="mt-2 text-muted">
              Forms land in the same inbox. No queue, no junior hand-off.
            </p>
          </div>
        </div>
      </HeroPanel>

      <div className="mx-auto max-w-3xl px-5 pb-4">
        <div className="reveal panel rounded-2xl border border-line p-6" style={d(0)}>
          <ContactForm />
        </div>
      </div>
      <Cta />
    </>
  );
}
