import { foundation } from "@/lib/content";
import type { EngineReport, Proposal } from "./types";

/**
 * Deterministic, zero-cost proposal builder — no extra Claude call. Assembles
 * a client-ready proposal (matching the agency's Proposal Template SOP) from
 * a report that's already been generated, so it works identically whether
 * the report came from the real agents or mock mode.
 */
export function buildProposal(report: EngineReport): Proposal {
  const { brief, plan } = report;
  const location = brief.location ? ` in ${brief.location}` : "";

  return {
    business: brief.business,
    website: brief.website,
    objectives: [
      `Increase qualified leads from organic and AI search for ${brief.business}${location}.`,
      `Close the specific gaps found in the live audit (current score: ${brief.siteAudit.score}/${brief.siteAudit.max}).`,
      "Build durable visibility across Google, Maps, AI Overviews, AI assistants, and voice — not just one channel.",
    ],
    scope: [...foundation.included],
    approach:
      "Audit → strategy → execution → reporting, on a monthly cycle. Every recommendation traces back to a specific finding from the live audit, not generic best practices. Technical and local fixes come first, then content, then authority-building — in that order, because no amount of content or links compensates for a broken technical foundation.",
    deliverables: plan.phases.map((phase) => ({
      phase: phase.name,
      items: phase.actions.map((a) => a.title),
    })),
    investment: {
      label: foundation.name,
      amount: foundation.priceLabel,
      cadence: foundation.cadence,
    },
    expectedOutcomes: [
      ...plan.quickWins,
      "Meaningful movement typically shows in 3-6 months; results compound over 6-12 months as authority builds.",
      "No specific ranking, traffic, or call-volume figure is guaranteed — search results are set by Google and AI platforms, not any provider.",
    ],
    notIncluded: [...foundation.notIncluded],
    terms: [
      foundation.cadence,
      "Billed monthly in advance.",
      "We report honestly and do not fabricate results — see the Monthly Report each cycle.",
      "Governed by the Master Services Agreement and Foundation Statement of Work.",
    ],
    nextSteps: [
      "Sign the Foundation agreement (MSA + SOW).",
      "Grant access: Google Business Profile, Search Console, Analytics, CMS.",
      "Kickoff call within 2 business days of signing.",
      "First research brief and 90-day plan delivered automatically on payment.",
    ],
  };
}
