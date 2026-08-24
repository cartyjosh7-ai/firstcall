import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { loadReport } from "@/lib/reports";
import { buildProposal } from "@/lib/agents/proposal";
import { PrintButton } from "@/components/print-button";
import { site } from "@/lib/content";

export const metadata: Metadata = { title: "Proposal" };

export default async function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await loadReport(id);
  if (!report) notFound();

  const proposal = buildProposal(report);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="print:hidden mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-[#12130f] p-4">
        <p className="text-sm text-muted">
          Generated from the research + plan — read it over before you send it.{" "}
          <Link href={`/reports/${id}`}>View the full research brief →</Link>
        </p>
        <PrintButton />
      </div>

      <div className="print-doc">
        <p className="text-xs uppercase tracking-widest text-gold">SEO & Website Services Proposal</p>
        <h1 className="mt-3 font-serif text-5xl">{proposal.business}</h1>
        <p className="mt-2 text-sm text-muted">
          {proposal.website} · Prepared by {site.legalName} · {new Date(report.generatedAt).toLocaleDateString()} ·
          Valid for 30 days
        </p>

        <section className="mt-12">
          <h2 className="font-serif text-2xl">Objectives</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {proposal.objectives.map((o, i) => (
              <li key={i}>— {o}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl">Scope of services</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {proposal.scope.map((s, i) => (
              <li key={i}>— {s}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl">Approach</h2>
          <p className="mt-3 text-sm text-muted">{proposal.approach}</p>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl">Deliverables & timeline</h2>
          <div className="mt-4 space-y-6">
            {proposal.deliverables.map((d) => (
              <div key={d.phase}>
                <h3 className="font-serif text-xl text-gold">{d.phase}</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {d.items.map((item, i) => (
                    <li key={i}>— {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl">Investment</h2>
          <p className="mt-3 text-lg">
            {proposal.investment.label} — <span className="text-gold">{proposal.investment.amount}</span>
          </p>
          <p className="mt-1 text-sm text-muted">{proposal.investment.cadence}</p>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl">Expected outcomes</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {proposal.expectedOutcomes.map((o, i) => (
              <li key={i}>— {o}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl">What's not included</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {proposal.notIncluded.map((n, i) => (
              <li key={i}>— {n}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl">Terms</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {proposal.terms.map((t, i) => (
              <li key={i}>— {t}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl">Next steps</h2>
          <ol className="mt-4 space-y-2 text-sm text-muted list-decimal pl-5">
            {proposal.nextSteps.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ol>
        </section>

        <p className="mt-16 text-sm text-muted">
          Questions before signing? <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </div>
    </div>
  );
}
