import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms";
import { foundation, growth, domination, audit, dormantAddOns, site } from "@/lib/content";

export const metadata: Metadata = { title: "Pricing" };

const upsellPackages = [growth, domination] as const;

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">First-sale offer</p>
      <h1 className="mt-3 font-serif text-5xl">{foundation.name}</h1>
      <p className="mt-4 font-serif text-4xl text-gold">{foundation.priceOneTimeLabel}</p>
      <p className="mt-1 text-lg text-gold">then {foundation.priceMonthlyLabel}</p>
      <p className="mt-3 text-muted">
        {foundation.forWho} {foundation.cadence} Legal agreement:{" "}
        <Link href="/legal/msa">MSA</Link> + <Link href="/legal/sow?package=foundation">Foundation SOW</Link>.
      </p>
      <h2 className="mt-12 font-serif text-2xl">Included</h2>
      <ul className="mt-4 space-y-2 text-muted">
        {foundation.included.map((i) => (
          <li key={i}>— {i}</li>
        ))}
      </ul>
      <h2 className="mt-10 font-serif text-2xl">Not included</h2>
      <ul className="mt-4 space-y-2 text-muted">
        {foundation.notIncluded.map((i) => (
          <li key={i}>— {i}</li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-muted">
        Most home-service businesses either pay agency rates of $2,500–$5,000+/month or nothing at all
        and stay invisible on Google. Foundation gets you ranked for a fraction of that.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/start"
          className="rounded-full bg-gold px-5 py-3 text-ink no-underline hover:opacity-90"
        >
          Pay and start
        </Link>
        <Link href="/audit" className="rounded-full border border-line px-5 py-3 no-underline">
          Run the free audit first
        </Link>
      </div>
      <div className="mt-16">
        <h2 className="font-serif text-2xl">Beyond Foundation</h2>
        <p className="mt-2 text-sm text-muted">
          Ready to scale past the basics, or want a standalone audit first? These are live too.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {upsellPackages.map((p) => (
            <div key={p.id} className="rounded-2xl border border-line p-6">
              <h3 className="font-serif text-2xl">{p.name}</h3>
              <p className="mt-1 text-gold">{p.priceLabel}</p>
              <p className="mt-2 text-sm text-muted">{p.forWho}</p>
              <ul className="mt-4 space-y-1 text-sm text-muted">
                {p.included.map((i) => (
                  <li key={i}>— {i}</li>
                ))}
              </ul>
              <Link
                href={`/start?package=${p.id}`}
                className="mt-5 inline-block rounded-full bg-gold px-5 py-2.5 text-sm text-ink no-underline hover:opacity-90"
              >
                Pay and start
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-line p-6">
            <h3 className="font-serif text-xl">{audit.name}</h3>
            <p className="mt-1 text-gold">{audit.priceLabel}</p>
            <p className="mt-2 text-sm text-muted">{audit.forWho} The free live scan at /audit is the entry-level version of this.</p>
            <Link
              href={`/start?package=${audit.id}`}
              className="mt-5 inline-block rounded-full bg-gold px-5 py-2.5 text-sm text-ink no-underline hover:opacity-90"
            >
              Pay and start
            </Link>
          </div>
          {dormantAddOns.map((a) => (
            <div key={a.id} className="rounded-2xl border border-line p-6">
              <p className="text-xs uppercase tracking-widest text-gold">Existing clients only</p>
              <h3 className="mt-2 font-serif text-xl">{a.name}</h3>
              <p className="mt-1 text-gold">{a.priceLabel}</p>
              <p className="mt-2 text-sm text-muted">{a.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-serif text-2xl">Prefer an invoice?</h2>
        <p className="mt-2 text-sm text-muted">
          Request any package and we will send a Stripe invoice or Checkout link to {site.email}{" "}
          correspondence. Same MSA, matching SOW.
        </p>
        <div className="mt-6">
          <ContactForm kind="proposal" />
        </div>
      </div>
    </div>
  );
}
