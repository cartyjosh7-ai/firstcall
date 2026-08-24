import Link from "next/link";
import { Cta } from "@/components/chrome";
import { foundation, industries } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16">
        <p className="text-xs uppercase tracking-widest text-gold">Google visibility that rings the phone</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">
          Be the first call your customers make.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          Your customers decide in seconds — on Google, on the map, on their phone. We get your
          business ranked first on the search results that actually drive the call. Yours.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/audit"
            className="rounded-full bg-gold px-5 py-3 text-ink no-underline hover:opacity-90"
          >
            Get your free visibility audit
          </Link>
          <Link href="/pricing" className="rounded-full border border-line px-5 py-3 no-underline">
            See Foundation · {foundation.priceOneTimeLabel} + {foundation.priceMonthlyLabel}
          </Link>
        </div>
      </section>

      <section className="border-y border-line bg-[#10110e] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs uppercase tracking-widest text-gold">Google decides who gets the call</p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl">
            Three businesses get chosen. Everyone else gets scrolled past.
          </h2>
          <p className="mt-4 max-w-3xl text-muted">
            Local discovery lives in the Google Map Pack and the search results above the fold. First
            Call engineers your Google presence, profile, reviews, citations, and content, as one
            compounding system, and reports calls, booked jobs, and revenue in plain English.
          </p>
          <dl className="mt-12 grid gap-8 md:grid-cols-3">
            <div>
              <dt className="font-serif text-4xl">Top 3</dt>
              <dd className="mt-2 text-sm text-muted">
                the Map Pack shows three businesses above the fold. Everyone else is a scroll away.
              </dd>
            </div>
            <div>
              <dt className="font-serif text-4xl">Seconds</dt>
              <dd className="mt-2 text-sm text-muted">
                is how long it takes a customer to pick a name and dial. They don&apos;t scroll far.
              </dd>
            </div>
            <div>
              <dt className="font-serif text-4xl">Compounding</dt>
              <dd className="mt-2 text-sm text-muted">
                reviews, citations, and content build rank that holds, instead of stopping the moment
                ad spend stops.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-xs uppercase tracking-widest text-gold">Why First Call</p>
        <h2 className="mt-3 font-serif text-4xl">The difference is what we refuse to do.</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {[
            ["Built to be chosen", "We earn the reviews, citations, and structured authority that decide who Google — and customers — trust."],
            ["Evidence over opinion", "Everything ties back to rankings, calls, and revenue. No vanity metrics, no black box."],
            ["We own the outcome", "Senior strategists run your account end to end. No junior hand-offs."],
            ["Compounding, not quick hits", "Owned assets widen your lead every quarter instead of stopping when spend stops."],
          ].map(([t, b]) => (
            <div key={t} className="border-t border-line pt-6">
              <h3 className="font-serif text-2xl">{t}</h3>
              <p className="mt-2 text-muted">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-xs uppercase tracking-widest text-gold">Packaging</p>
        <h2 className="mt-3 font-serif text-4xl">One offer to start. Foundation.</h2>
        <p className="mt-4 max-w-2xl text-muted">
          Growth and Domination stay a conversation. The first sale is Foundation:{" "}
          {foundation.priceOneTimeLabel} to start, then {foundation.priceMonthlyLabel}.{" "}
          {foundation.cadence}
        </p>
        <ul className="mt-6 grid gap-2 text-sm text-muted md:grid-cols-2">
          {foundation.included.map((item) => (
            <li key={item}>— {item}</li>
          ))}
        </ul>
        <Link href="/pricing" className="mt-6 inline-block text-gold">
          Full Foundation offer →
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-xs uppercase tracking-widest text-gold">Built per trade</p>
        <h2 className="mt-3 font-serif text-4xl">Engineered in your customers&apos; language.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {industries.map((ind) => (
            <Link
              key={ind.slug}
              href={`/industries/${ind.slug}`}
              className="rounded-2xl border border-line p-6 no-underline hover:border-gold"
            >
              <p className="text-xs uppercase tracking-widest text-muted">{ind.label}</p>
              <h3 className="mt-2 font-serif text-2xl">{ind.name}</h3>
              <p className="mt-2 text-sm text-muted">{ind.headline}</p>
            </Link>
          ))}
        </div>
      </section>

      <Cta />
    </>
  );
}
