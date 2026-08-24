import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms";
import { foundation, site } from "@/lib/content";

export const metadata: Metadata = { title: "Foundation pricing" };

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">First-sale offer</p>
      <h1 className="mt-3 font-serif text-5xl">{foundation.name}</h1>
      <p className="mt-4 font-serif text-4xl text-gold">{foundation.priceLabel}</p>
      <p className="mt-3 text-muted">
        {foundation.forWho} {foundation.cadence} Legal agreement:{" "}
        <Link href="/legal/msa">MSA</Link> + <Link href="/legal/sow">Foundation SOW</Link>.
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
        Growth and Domination are scoped after Foundation is running. We do not publish those prices
        here. Most home-service businesses already spend $5,000–$10,000 a month on digital marketing;
        Foundation is the first productized altitude.
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
        <h2 className="font-serif text-2xl">Prefer an invoice?</h2>
        <p className="mt-2 text-sm text-muted">
          Request Foundation and we will send a Stripe invoice or Checkout link to {site.email}{" "}
          correspondence. Same MSA/SOW.
        </p>
        <div className="mt-6">
          <ContactForm kind="proposal" />
        </div>
      </div>
    </div>
  );
}
