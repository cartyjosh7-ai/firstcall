import type { CSSProperties } from "react";
import Link from "next/link";
import { Cta } from "@/components/chrome";
import { foundation, industries } from "@/lib/content";
import { RevealInit } from "@/components/motion/reveal-init";
import { HeroPanel } from "@/components/motion/hero-panel";
import { TiltCard } from "@/components/motion/tilt-card";

const wd = (n: number) => ({ "--wd": n }) as CSSProperties;
const d = (n: number) => ({ "--d": n }) as CSSProperties;

export default function HomePage() {
  return (
    <>
      <RevealInit />

      <HeroPanel className="pb-16 pt-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-10 md:grid-cols-2 md:gap-14 md:items-center">
            <div>
              <div className="maskline" style={wd(0)}>
                <span className="wipe" />
                <p className="content flex items-center text-xs uppercase tracking-widest text-gold">
                  <span className="signalbars">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                  Google visibility that rings the phone
                </p>
              </div>

              <div className="maskline mt-4" style={wd(1)}>
                <span className="wipe" />
                <h1 className="content max-w-4xl font-serif text-5xl leading-tight tracking-tight md:text-7xl">
                  Be the first call your customers make.
                </h1>
              </div>

              <div className="maskline mt-6" style={wd(2)}>
                <span className="wipe" />
                <p className="content max-w-2xl text-lg text-muted">
                  Your customers decide in seconds — on Google, on the map, on their phone. We get your
                  business ranked first on the search results that actually drive the call. Yours.
                </p>
              </div>

              <div className="maskline mt-8" style={wd(3)}>
                <span className="wipe" />
                <div className="content flex flex-wrap items-stretch gap-3">
                  <Link href="/audit" className="btn-primary">
                    Get your free visibility audit
                    <svg
                      className="arrow"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                  <Link href="/pricing" className="btn-secondary">
                    <span className="bl-title">See Foundation pricing</span>
                    <span className="bl-price">{foundation.priceLabel}</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="maskline" style={wd(2)}>
              <span className="wipe" style={{ zIndex: 3 }} />
              <div className="content">
                <TiltCard className="font-sans">
                  <span className="bracket tl"></span>
                  <span className="bracket tr"></span>
                  <span className="bracket bl"></span>
                  <span className="bracket br"></span>

                  <div className="georow">
                    <span className="livedot"></span>
                    <span className="live">LIVE</span>
                    <span className="sep">·</span>
                    <span>51.0447°N, 114.0719°W</span>
                    <span className="sep">·</span>
                    <span>YYC</span>
                  </div>

                  <div className="searchrow">
                    <span className="prompt">&gt;</span>
                    <span>hvac repair calgary</span>
                    <span className="caret"></span>
                  </div>

                  <div className="maptile">
                    <svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="400" height="150" fill="#171810" />
                      <ellipse cx="320" cy="35" rx="70" ry="32" fill="#1e2117" opacity={0.8} />
                      <rect x="34" y="86" width="86" height="46" rx="8" fill="#1e1f16" opacity={0.85} />
                      <rect x="150" y="14" width="58" height="34" rx="7" fill="#1e1f16" opacity={0.7} />
                      <path
                        d="M-10,118 C90,150 150,70 250,96 S 360,60 410,84"
                        fill="none"
                        stroke="#3a3b2e"
                        strokeWidth={3}
                        strokeLinecap="round"
                        opacity={0.55}
                      />
                      <path
                        d="M40,-10 C60,40 20,90 70,150"
                        fill="none"
                        stroke="#3a3b2e"
                        strokeWidth={2}
                        strokeLinecap="round"
                        opacity={0.4}
                      />
                      <path
                        d="M260,-10 C240,40 300,70 280,150"
                        fill="none"
                        stroke="#3a3b2e"
                        strokeWidth={2}
                        strokeLinecap="round"
                        opacity={0.4}
                      />
                    </svg>
                    <div className="scansweep"></div>
                    <div className="pin lose" style={{ left: "26%", top: "78%" }}>
                      <div className="head">
                        <span>2</span>
                      </div>
                    </div>
                    <div className="pin lose" style={{ left: "72%", top: "82%" }}>
                      <div className="head">
                        <span>3</span>
                      </div>
                    </div>
                    <div className="pin win" style={{ left: "50%", top: "46%" }}>
                      <span className="pulse" style={{ left: 0, top: -26 }}></span>
                      <div className="head">
                        <span>1</span>
                      </div>
                      <span className="ringicon">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0c0d0b" strokeWidth={2.6} strokeLinecap="round">
                          <path d="M4 12a8 8 0 0 1 16 0" />
                          <circle cx="12" cy="12" r="2" fill="#0c0d0b" stroke="none" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="resultrow win">
                    <span className="num">1</span>
                    <div>
                      <div className="resultname">
                        Your Business
                        <span className="chip">First Call client</span>
                        <span className="chip">Visibility 94</span>
                      </div>
                      <div className="resultmeta">
                        ★★★★★ <span className="countup" data-to="4.9" data-dec="1">0.0</span> ·{" "}
                        <span className="countup" data-to="212" data-dec="0">0</span> reviews · Open now
                      </div>
                    </div>
                  </div>
                  <div className="resultrow lose">
                    <span className="num">2</span>
                    <div>
                      <div className="resultname">Competitor A</div>
                      <div className="resultmeta">★★★★ 4.1 · 38 reviews</div>
                    </div>
                  </div>
                  <div className="resultrow lose">
                    <span className="num">3</span>
                    <div>
                      <div className="resultname">Competitor B</div>
                      <div className="resultmeta">★★★☆ 3.8 · 21 reviews</div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </div>
          </div>

          <div className="tickerstrip">
            <div className="tickertrack">
              <span className="tlabel">
                MAPS<b>92</b>
              </span>
              <span className="tdot"></span>
              <span className="tlabel">
                AI OVERVIEWS<b>88</b>
              </span>
              <span className="tdot"></span>
              <span className="tlabel">
                AI ASSISTANTS<b>81</b>
              </span>
              <span className="tdot"></span>
              <span className="tlabel">
                VOICE<b>76</b>
              </span>
              <span className="tdot"></span>
              <span className="tlabel">
                WEBSITE &amp; REVIEWS<b>95</b>
              </span>
              <span className="tdot"></span>
              <span className="tlabel">
                MAPS<b>92</b>
              </span>
              <span className="tdot"></span>
              <span className="tlabel">
                AI OVERVIEWS<b>88</b>
              </span>
              <span className="tdot"></span>
              <span className="tlabel">
                AI ASSISTANTS<b>81</b>
              </span>
              <span className="tdot"></span>
              <span className="tlabel">
                VOICE<b>76</b>
              </span>
              <span className="tdot"></span>
              <span className="tlabel">
                WEBSITE &amp; REVIEWS<b>95</b>
              </span>
              <span className="tdot"></span>
            </div>
          </div>
        </div>
      </HeroPanel>

      <section className="border-y border-line bg-[#10110e] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
            <span className="ruleline">Google decides who gets the call</span>
          </p>
          <h2 className="reveal mt-3 max-w-3xl font-serif tracking-tight text-4xl" style={d(1)}>
            Three businesses get chosen. Everyone else gets scrolled past.
          </h2>
          <p className="reveal mt-4 max-w-3xl text-muted" style={d(1)}>
            Local discovery lives in the Google Map Pack and the search results above the fold. First
            Call engineers your Google presence, profile, reviews, citations, and content, as one
            compounding system, and reports calls, booked jobs, and revenue in plain English.
          </p>
          <dl className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="reveal" style={d(2)}>
              <dt className="font-serif text-4xl">Top 3</dt>
              <dd className="mt-2 text-sm text-muted">
                the Map Pack shows three businesses above the fold. Everyone else is a scroll away.
              </dd>
            </div>
            <div className="reveal" style={d(3)}>
              <dt className="font-serif text-4xl">Seconds</dt>
              <dd className="mt-2 text-sm text-muted">
                is how long it takes a customer to pick a name and dial. They don&apos;t scroll far.
              </dd>
            </div>
            <div className="reveal" style={d(4)}>
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
        <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
          <span className="ruleline">Why First Call</span>
        </p>
        <h2 className="reveal mt-3 font-serif tracking-tight text-4xl" style={d(1)}>
          The difference is what we refuse to do.
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {[
            ["Built to be chosen", "We earn the reviews, citations, and structured authority that decide who Google — and customers — trust."],
            ["Evidence over opinion", "Everything ties back to rankings, calls, and revenue. No vanity metrics, no black box."],
            ["We own the outcome", "Senior strategists run your account end to end. No junior hand-offs."],
            ["Compounding, not quick hits", "Owned assets widen your lead every quarter instead of stopping when spend stops."],
          ].map(([t, b], i) => (
            <div key={t} className="whycard reveal border-t border-line pt-6" style={d(i + 2)}>
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
        <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
          <span className="ruleline">Built per trade</span>
        </p>
        <h2 className="reveal mt-3 font-serif tracking-tight text-4xl" style={d(1)}>
          Engineered in your customers&apos; language.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {industries.map((ind, i) => (
            <Link
              key={ind.slug}
              href={`/industries/${ind.slug}`}
              className="indcard reveal rounded-2xl border border-line p-6 no-underline"
              style={d(i + 2)}
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
