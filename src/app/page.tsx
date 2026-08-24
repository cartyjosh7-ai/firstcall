import Link from "next/link";
import { Cta } from "@/components/chrome";
import { foundation, industries } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16">
        <p className="text-xs uppercase tracking-widest text-gold">AI-era local visibility</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">
          Be the first call your customers make.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          Customers decide in seconds, on the map, in an AI answer, out loud to an assistant. We put
          one business first on every surface. Yours.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/audit"
            className="rounded-full bg-gold px-5 py-3 text-ink no-underline hover:opacity-90"
          >
            Get your free visibility audit
          </Link>
          <Link href="/pricing" className="rounded-full border border-line px-5 py-3 no-underline">
            See Foundation · {foundation.priceLabel}
          </Link>
        </div>
      </section>

      <section className="border-y border-line bg-[#10110e] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs uppercase tracking-widest text-gold">The ground moved</p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl">
            Customers decide in seconds, before they ever reach your website.
          </h2>
          <p className="mt-4 max-w-3xl text-muted">
            Discovery left the ten blue links. It lives in the map pack, the AI overview, and the
            spoken answer, where a machine names exactly one business. First Call engineers your
            presence on every surface as one compounding system and reports calls, booked jobs, and
            revenue.
          </p>
          <dl className="mt-12 grid gap-8 md:grid-cols-3">
            <div>
              <dt className="font-serif text-4xl">45%</dt>
              <dd className="mt-2 text-sm text-muted">
                of consumers now use AI to find a local business (BrightLocal, Local Consumer Review
                Survey 2026).
              </dd>
            </div>
            <div>
              <dt className="font-serif text-4xl">1.2%</dt>
              <dd className="mt-2 text-sm text-muted">
                of local businesses are recommended by ChatGPT — the single cited answer (SOCi Local
                Visibility Index, 2026).
              </dd>
            </div>
            <div>
              <dt className="font-serif text-4xl">~25%</dt>
              <dd className="mt-2 text-sm text-muted">
                projected drop in traditional search volume as discovery moves into AI (Gartner, 2024).
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
            ["Built to be chosen", "We earn the reviews, citations, and structured authority that decide who AI and customers trust."],
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
          Growth and Domination stay a conversation. The first sale is Foundation: {foundation.priceLabel},{" "}
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
