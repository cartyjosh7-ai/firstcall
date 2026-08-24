import type { Metadata } from "next";
import { AuditForm } from "@/components/forms";
import { Cta } from "@/components/chrome";

export const metadata: Metadata = {
  title: "Free 100-Point Visibility Audit, Scored Live",
};

export default function AuditPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Free · 100 points · Live scan</p>
      <h1 className="mt-3 font-serif text-5xl">See where customers can&apos;t find you.</h1>
      <p className="mt-4 text-muted">
        This scans your site live, scores it out of 100 across five surfaces, and names every gap in
        plain English. It runs in seconds. A senior strategist reviews the result by hand afterwards.
      </p>
      <ul className="mt-6 space-y-2 text-sm text-muted">
        <li>— Your score on screen in about ten seconds</li>
        <li>— Then a senior strategist reviews it by hand and adds what a scanner cannot see</li>
        <li>— Yours to keep, whether we work together or not</li>
      </ul>
      <div className="mt-10">
        <AuditForm />
      </div>
      <section className="mt-16">
        <h2 className="font-serif text-3xl">What&apos;s inside the 100 points</h2>
        <div className="mt-6 grid gap-6 text-sm text-muted md:grid-cols-3">
          <div>
            <h3 className="font-serif text-xl text-paper">Google & Maps · 20</h3>
            <p className="mt-2">Profile signals, NAP, schema, hours, map path.</p>
          </div>
          <div>
            <h3 className="font-serif text-xl text-paper">AI Overviews · 20</h3>
            <p className="mt-2">FAQ, schema, answer-first interior pages.</p>
          </div>
          <div>
            <h3 className="font-serif text-xl text-paper">Assistants · 15</h3>
            <p className="mt-2">Entity, facts, llms.txt, corroboration.</p>
          </div>
          <div>
            <h3 className="font-serif text-xl text-paper">Voice · 15</h3>
            <p className="mt-2">tel: links, viewport, CTA, readable prose.</p>
          </div>
          <div className="md:col-span-3">
            <h3 className="font-serif text-xl text-paper">Website & reviews · 30</h3>
            <p className="mt-2">
              HTTPS, titles, speed of the live fetch, robots, reviews, contact. The scanner reports
              what it can see on your site. It does not estimate traffic or rankings.
            </p>
          </div>
        </div>
      </section>
      <Cta title="Ready to see your real score?" />
    </div>
  );
}
