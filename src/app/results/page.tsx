import type { Metadata } from "next";
import { Cta } from "@/components/chrome";

export const metadata: Metadata = { title: "Results" };

export default function ResultsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Proof</p>
      <h1 className="mt-3 font-serif text-5xl">
        The only three questions we answer: more visible, more calls, what&apos;s next.
      </h1>
      <p className="mt-4 text-muted">
        These are the targets the engagement model signs up for, not client claims. First Call is a
        new firm and publishes no performance numbers until real engagements produce them.
      </p>
      <div className="mt-10 space-y-8">
        <article className="border-t border-line pt-6">
          <p className="text-xs uppercase tracking-widest text-muted">Regional HVAC</p>
          <h2 className="mt-2 font-serif text-2xl">Map pack target: Top 3 for core service + city terms</h2>
          <p className="mt-2 text-sm text-muted">60–90 days for first local wins. Every call tracked from day one.</p>
        </article>
        <article className="border-t border-line pt-6">
          <p className="text-xs uppercase tracking-widest text-muted">Roofing</p>
          <h2 className="mt-2 font-serif text-2xl">Target: the cited answer for replacement queries</h2>
          <p className="mt-2 text-sm text-muted">Real-review velocity. No gating, no incentives.</p>
        </article>
        <article className="border-t border-line pt-6">
          <p className="text-xs uppercase tracking-widest text-muted">Remediation</p>
          <h2 className="mt-2 font-serif text-2xl">Target: AI-cited across ChatGPT, Perplexity, and Gemini</h2>
          <p className="mt-2 text-sm text-muted">Near-me visibility zone by zone. Trust in under five seconds.</p>
        </article>
      </div>
      <Cta />
    </div>
  );
}
