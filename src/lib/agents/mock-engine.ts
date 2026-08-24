import type { AuditCheck, AuditCategoryId } from "@/lib/audit";
import { siteAuditTool, keywordResearchTool, competitorScanTool } from "./tools";
import type {
  EngineInput,
  ImplementationPlan,
  PlanAction,
  PlanPhase,
  ResearchBrief,
} from "./types";

/**
 * Zero-cost stand-in for the two Claude agents. Builds the same shaped
 * ResearchBrief / ImplementationPlan from the real audit plus the existing
 * mock keyword/competitor tools, using a fixed rule table instead of an LLM
 * call. Lets the whole pipeline (webhook -> report -> email) be built and
 * demoed for $0. Swap on real synthesis by setting ANTHROPIC_API_KEY and
 * AGENTS_MOCK_MODE=false.
 */

const CATEGORY_TO_PLAN: Record<AuditCategoryId, PlanAction["category"]> = {
  maps: "local",
  overviews: "content",
  assistants: "authority",
  voice: "technical",
  website: "technical",
};

const REMEDIATION: Record<string, { hint: string; effort: "low" | "medium" | "high"; owner: "agency" | "client" }> = {
  nap: { hint: "Add a visible name/address/phone block matching your Google Business Profile exactly — Google Business Profile signals carry roughly a third of local ranking weight, and NAP mismatches undercut all of it.", effort: "low", owner: "agency" },
  "local-schema": { hint: "Add LocalBusiness JSON-LD schema with legal name, address, phone, and service area.", effort: "medium", owner: "agency" },
  "city-service": { hint: "Add explicit city/neighborhood and service-area language to the homepage and service pages.", effort: "low", owner: "agency" },
  "maps-embed": { hint: "Link to your Google Business Profile so engines can connect the site to the profile.", effort: "low", owner: "agency" },
  hours: { hint: "Publish hours of operation, matching your Business Profile exactly — 'business is open at time of search' is a top-tier local ranking factor; wrong hours cost rankings during real operating hours.", effort: "low", owner: "client" },
  faq: { hint: "Add an FAQ section answering the questions customers actually ask before calling.", effort: "medium", owner: "agency" },
  "faq-schema": { hint: "Mark up the FAQ with FAQPage schema so AI Overviews can extract it directly.", effort: "medium", owner: "agency" },
  "answer-first": { hint: "Rewrite interior pages to lead with a direct answer in the first two sentences.", effort: "medium", owner: "agency" },
  "how-to": { hint: "Add 'how much does X cost' / 'how to know if you need X' content matching real queries.", effort: "medium", owner: "agency" },
  "about-entity": { hint: "Build out an About page with your story, licensing, and years in business.", effort: "medium", owner: "client" },
  sameas: { hint: "Link out to verified Facebook/LinkedIn/Instagram profiles (sameAs schema).", effort: "low", owner: "agency" },
  llms: { hint: "Publish an llms.txt file summarizing who you are for AI assistants.", effort: "low", owner: "agency" },
  facts: { hint: "State license number, insurance, and years in business explicitly.", effort: "low", owner: "client" },
  "click-to-call": { hint: "Add a tel: click-to-call button visible on mobile above the fold.", effort: "low", owner: "agency" },
  "mobile-meta": { hint: "Add a responsive viewport meta tag.", effort: "low", owner: "agency" },
  cta: { hint: "Add a clear 'Call now' or 'Get a quote' primary call to action.", effort: "low", owner: "agency" },
  speakable: { hint: "Add a short, factual paragraph near the top of the homepage a voice assistant could read.", effort: "low", owner: "agency" },
  https: { hint: "Move the site to HTTPS.", effort: "low", owner: "agency" },
  title: { hint: "Write a unique, descriptive title tag for every page.", effort: "low", owner: "agency" },
  "meta-desc": { hint: "Add a meta description with a call to action on every page.", effort: "low", owner: "agency" },
  h1: { hint: "Ensure each page has exactly one clear H1 stating the page's topic.", effort: "low", owner: "agency" },
  reviews: { hint: "Display recent Google reviews on the homepage and start a review-acquisition system — target 4.5+ average with 20+ recent reviews, responded to within 24-72 hours; recency matters more than historical volume.", effort: "high", owner: "agency" },
  speed: { hint: "Improve homepage load time toward Core Web Vitals thresholds (LCP under 2.5s, INP under 200ms, CLS under 0.1) — never lazy-load the hero image, cut time-to-first-byte, and defer non-critical scripts.", effort: "medium", owner: "agency" },
  robots: { hint: "Publish a robots.txt file documenting crawler access.", effort: "low", owner: "agency" },
  indexable: { hint: "Remove the noindex tag currently blocking search engines.", effort: "low", owner: "agency" },
  "images-alt": { hint: "Add descriptive alt text to images.", effort: "low", owner: "agency" },
  contact: { hint: "Add a clear, easy-to-find contact path.", effort: "low", owner: "agency" },
};

function phaseForCategory(category: AuditCategoryId): PlanPhase["name"] {
  if (category === "voice" || category === "website" || category === "maps") return "0-30 days";
  if (category === "overviews") return "31-60 days";
  return "61-90 days";
}

function impactForMax(max: number): PlanAction["expectedImpact"] {
  if (max >= 5) return "high";
  if (max >= 3) return "medium";
  return "low";
}

function actionFromCheck(check: AuditCheck): PlanAction {
  const remediation = REMEDIATION[check.id];
  return {
    title: `Fix: ${check.label}`,
    category: CATEGORY_TO_PLAN[check.category],
    description: `${check.detail} ${remediation?.hint || ""}`.trim(),
    expectedImpact: impactForMax(check.max),
    effort: remediation?.effort || "medium",
    owner: remediation?.owner || "agency",
  };
}

export async function buildMockBrief(input: EngineInput): Promise<ResearchBrief> {
  const siteAudit = await siteAuditTool({ url: input.website });
  const kw = keywordResearchTool({ trade: input.trade, location: input.location, seedTopics: [input.trade] });
  const comp = competitorScanTool({ trade: input.trade, location: input.location });

  const failed = siteAudit.checks.filter((c) => !c.passed);
  const topGaps = failed.slice(0, 3).map((c) => c.label.toLowerCase()).join(", ") || "no major gaps found";

  const summary = siteAudit.fetched
    ? `${input.business} scored ${siteAudit.score}/${siteAudit.max} on the live technical audit. The most visible gaps are: ${topGaps}. This brief is a rule-based preview (no AI synthesis yet) — the technical findings are real, the keyword/competitor figures below are illustrative placeholders.`
    : `We could not read ${input.website} automatically (${siteAudit.error || "unknown error"}). A strategist should review the site by hand before finalizing this brief.`;

  const localSeoFindings = failed
    .filter((c) => c.category === "maps")
    .map((c) => ({ area: c.label, finding: c.detail, severity: (c.max >= 4 ? "high" : "medium") as "high" | "medium" }));

  const contentGaps = kw.keywords.slice(0, 4).map((k) => ({
    topic: k.keyword,
    format: k.intent === "research" ? "answer-first guide" : "service/location page",
    targetKeyword: k.keyword,
  }));

  return {
    business: input.business,
    website: input.website,
    trade: input.trade,
    location: input.location,
    siteAudit,
    keywordOpportunities: kw.keywords,
    competitorGaps: comp.commonGaps.map((gap) => ({
      competitor: "Typical local competitor",
      gap,
      opportunity: "Close this gap to differentiate in the map pack and AI answers.",
    })),
    localSeoFindings,
    contentGaps,
    summary,
  };
}

export function buildMockPlan(brief: ResearchBrief): ImplementationPlan {
  const failed = brief.siteAudit.checks.filter((c) => !c.passed);
  const actions = failed.map(actionFromCheck);

  const phases: PlanPhase[] = (["0-30 days", "31-60 days", "61-90 days"] as const).map((name) => ({
    name,
    actions: actions.filter(
      (_, i) => phaseForCategory(failed[i].category) === name,
    ),
  }));

  const contentActions: PlanAction[] = brief.contentGaps.map((g) => ({
    title: `Publish: ${g.topic}`,
    category: "content",
    description: `${g.format} targeting "${g.targetKeyword}". Illustrative topic based on placeholder keyword data — validate against real search data before committing writer time.`,
    expectedImpact: "medium",
    effort: "medium",
    owner: "agency",
  }));
  phases[1].actions.push(...contentActions);

  const authorityActions: PlanAction[] = brief.competitorGaps.slice(0, 2).map((g) => ({
    title: `Close competitive gap: ${g.gap}`,
    category: "authority",
    description: g.opportunity,
    expectedImpact: "medium",
    effort: "medium",
    owner: "agency",
  }));
  phases[2].actions.push(...authorityActions);

  const allActions = phases.flatMap((p) => p.actions);
  const quickWins = allActions
    .filter((a) => a.effort === "low" && (a.expectedImpact === "high" || a.expectedImpact === "medium"))
    .slice(0, 4)
    .map((a) => a.title);

  return {
    business: brief.business,
    phases,
    quickWins: quickWins.length ? quickWins : ["Run a strategist review — no low-effort, high-impact gaps were auto-detected."],
    kpisToTrack: [
      `Map pack position for ${brief.trade} near ${brief.location || "your service area"}`,
      "Google Business Profile reviews (count and recency)",
      "Click-to-call and form conversions",
      "Pages cited in AI Overviews / assistant answers",
    ],
    summary: `Rule-based 90-day preview for ${brief.business}, built from the real audit plus placeholder keyword/competitor data. Sequenced foundational technical and local fixes first, content next, authority-building last. No specific ranking, traffic, or timeline outcome is guaranteed — meaningful SEO results typically take 3-6 months to show and 6-12 months to compound.`,
  };
}
