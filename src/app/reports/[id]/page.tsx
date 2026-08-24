import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadReport } from "@/lib/reports";

export const metadata: Metadata = { title: "Your research & implementation plan" };

function Bar({ score, max }: { score: number; max: number }) {
  return (
    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
      <div className="h-full bg-gold" style={{ width: `${max ? (score / max) * 100 : 0}%` }} />
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">
      {children}
    </span>
  );
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await loadReport(id);
  if (!report) notFound();

  const { brief, plan, generatedAt } = report;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Research & 90-day plan</p>
      <h1 className="mt-3 font-serif text-5xl">{brief.business}</h1>
      <p className="mt-2 text-sm text-muted">
        {brief.trade}
        {brief.location ? ` · ${brief.location}` : ""} · {brief.website} · generated{" "}
        {new Date(generatedAt).toLocaleDateString()}
      </p>

      <section className="mt-12">
        <p className="text-xs uppercase tracking-widest text-gold">Site audit</p>
        <p className="mt-2 font-serif text-5xl">
          {brief.siteAudit.score}
          <span className="text-2xl text-muted">/{brief.siteAudit.max}</span>
        </p>
        {brief.siteAudit.error ? (
          <p className="mt-2 text-sm text-muted">{brief.siteAudit.error}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {brief.siteAudit.categories.map((c) => (
              <li key={c.id}>
                <div className="flex justify-between text-sm">
                  <span>{c.name}</span>
                  <span>
                    {c.score}/{c.max}
                  </span>
                </div>
                <Bar score={c.score} max={c.max} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">Research summary</h2>
        <p className="mt-3 text-muted">{brief.summary}</p>
      </section>

      {brief.keywordOpportunities.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl">Keyword opportunities</h2>
          <p className="mt-2 text-xs text-rust">
            Estimated volumes are placeholders until a live keyword data provider is connected.
          </p>
          <div className="mt-4 space-y-3">
            {brief.keywordOpportunities.map((k, i) => (
              <div key={i} className="rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-paper">{k.keyword}</p>
                  <div className="flex gap-2">
                    <Pill>{k.intent}</Pill>
                    <Pill>{k.difficulty} difficulty</Pill>
                    <Pill>~{k.estMonthlySearches}/mo</Pill>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted">{k.rationale}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {brief.competitorGaps.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl">Competitive gaps</h2>
          <div className="mt-4 space-y-3">
            {brief.competitorGaps.map((g, i) => (
              <div key={i} className="rounded-xl border border-line p-4">
                <p className="text-paper">{g.competitor}</p>
                <p className="mt-1 text-sm text-muted">Gap: {g.gap}</p>
                <p className="mt-1 text-sm text-muted">Opportunity: {g.opportunity}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {brief.localSeoFindings.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl">Local SEO findings</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {brief.localSeoFindings.map((f, i) => (
              <li key={i} className="text-muted">
                <span className="text-paper">{f.area}</span> ({f.severity}) — {f.finding}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {plan.quickWins.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl">Quick wins</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {plan.quickWins.map((w, i) => (
              <li key={i} className="text-muted">
                — {w}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="font-serif text-2xl">90-day implementation plan</h2>
        <p className="mt-3 text-muted">{plan.summary}</p>
        <div className="mt-6 space-y-8">
          {plan.phases.map((phase) => (
            <div key={phase.name}>
              <h3 className="font-serif text-xl text-gold">{phase.name}</h3>
              <div className="mt-3 space-y-3">
                {phase.actions.map((a, i) => (
                  <div key={i} className="rounded-xl border border-line p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-paper">{a.title}</p>
                      <div className="flex gap-2">
                        <Pill>{a.category}</Pill>
                        <Pill>{a.expectedImpact} impact</Pill>
                        <Pill>{a.effort} effort</Pill>
                        <Pill>{a.owner}</Pill>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted">{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {plan.kpisToTrack.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl">KPIs we'll track</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {plan.kpisToTrack.map((k, i) => (
              <li key={i}>— {k}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
