import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ContactForm } from "@/components/forms";
import { foundation, growth, domination, audit, dormantAddOns, site } from "@/lib/content";
import { HeroPanel } from "@/components/motion/hero-panel";

export const metadata: Metadata = { title: "Pricing" };

const upsellPackages = [growth, domination] as const;
const d = (n: number) => ({ "--d": n }) as CSSProperties;

function Arrow() {
  return (
    <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <>
      <HeroPanel className="pb-6 pt-16">
        <div className="mx-auto max-w-3xl px-5">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
            <span className="ruleline">First-sale offer</span>
          </p>
          <h1 className="reveal mt-3 font-serif text-5xl" style={d(1)}>
            {foundation.name}
          </h1>
          <p className="reveal mt-4 font-serif text-4xl text-gold" style={d(2)}>
            {foundation.priceOneTimeLabel}
          </p>
          <p className="reveal mt-1 text-lg text-gold" style={d(2)}>
            then {foundation.priceMonthlyLabel}
          </p>
          <p className="reveal mt-3 text-muted" style={d(3)}>
            {foundation.forWho} {foundation.cadence} Legal agreement:{" "}
            <Link href="/legal/msa">MSA</Link> + <Link href="/legal/sow?package=foundation">Foundation SOW</Link>.
          </p>
          <div className="reveal mt-10 flex flex-wrap gap-3" style={d(4)}>
            <Link href="/start" className="btn-primary">
              Pay and start
              <Arrow />
            </Link>
            <Link href="/audit" className="btn-secondary">
              <span className="bl-title">Run the free audit first</span>
            </Link>
          </div>
        </div>
      </HeroPanel>

      <div className="mx-auto max-w-3xl px-5 pb-4">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="reveal" style={d(0)}>
            <h2 className="font-serif text-2xl">Included</h2>
            <ul className="mt-4 space-y-2 text-muted">
              {foundation.included.map((i) => (
                <li key={i}>— {i}</li>
              ))}
            </ul>
          </div>
          <div className="reveal" style={d(1)}>
            <h2 className="font-serif text-2xl">Not included</h2>
            <ul className="mt-4 space-y-2 text-muted">
              {foundation.notIncluded.map((i) => (
                <li key={i}>— {i}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="reveal mt-8 text-sm text-muted" style={d(2)}>
          Most home-service businesses either pay agency rates of $2,500–$5,000+/month or nothing at all
          and stay invisible on Google. Foundation gets you ranked for a fraction of that.
        </p>

        <div className="mt-20">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
            <span className="ruleline">Beyond Foundation</span>
          </p>
          <h2 className="reveal mt-3 font-serif text-2xl" style={d(1)}>
            Ready to scale past the basics, or want a standalone audit first?
          </h2>
          <p className="reveal mt-2 text-sm text-muted" style={d(1)}>
            These are live too.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {upsellPackages.map((p, i) => (
              <div key={p.id} className="whycard reveal rounded-2xl border border-line p-6" style={d(i + 2)}>
                <h3 className="font-serif text-2xl">{p.name}</h3>
                <p className="mt-1 text-gold">{p.priceLabel}</p>
                <p className="mt-2 text-sm text-muted">{p.forWho}</p>
                <ul className="mt-4 space-y-1 text-sm text-muted">
                  {p.included.map((i) => (
                    <li key={i}>— {i}</li>
                  ))}
                </ul>
                <Link href={`/start?package=${p.id}`} className="linkarrow mt-5 text-sm font-medium">
                  Pay and start
                  <Arrow />
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="whycard reveal rounded-2xl border border-line p-6" style={d(0)}>
              <h3 className="font-serif text-xl">{audit.name}</h3>
              <p className="mt-1 text-gold">{audit.priceLabel}</p>
              <p className="mt-2 text-sm text-muted">
                {audit.forWho} The free live scan at /audit is the entry-level version of this.
              </p>
              <Link href={`/start?package=${audit.id}`} className="linkarrow mt-5 text-sm font-medium">
                Pay and start
                <Arrow />
              </Link>
            </div>
            {dormantAddOns.map((a, i) => (
              <div key={a.id} className="whycard reveal rounded-2xl border border-line p-6" style={d(i + 1)}>
                <p className="text-xs uppercase tracking-widest text-gold">Existing clients only</p>
                <h3 className="mt-2 font-serif text-xl">{a.name}</h3>
                <p className="mt-1 text-gold">{a.priceLabel}</p>
                <p className="mt-2 text-sm text-muted">{a.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 pb-8">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
            <span className="ruleline">Prefer an invoice?</span>
          </p>
          <p className="reveal mt-3 text-sm text-muted" style={d(1)}>
            Request any package and we will send a Stripe invoice or Checkout link to {site.email}{" "}
            correspondence. Same MSA, matching SOW.
          </p>
          <div className="reveal panel mt-6 rounded-2xl border border-line p-6" style={d(2)}>
            <ContactForm kind="proposal" />
          </div>
        </div>
      </div>
    </>
  );
}
