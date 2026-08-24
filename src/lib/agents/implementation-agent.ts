import Anthropic from "@anthropic-ai/sdk";
import { runToolLoop } from "./loop";
import type { ImplementationPlan, ResearchBrief } from "./types";

type Tool = Anthropic.Messages.Tool;

const ACTION_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    category: { type: "string", enum: ["technical", "content", "local", "authority"] },
    description: { type: "string" },
    expectedImpact: { type: "string", enum: ["low", "medium", "high"] },
    effort: { type: "string", enum: ["low", "medium", "high"] },
    owner: { type: "string", enum: ["agency", "client"] },
  },
  required: ["title", "category", "description", "expectedImpact", "effort", "owner"],
} as const;

const TOOLS: Tool[] = [
  {
    name: "submit_implementation_plan",
    description:
      "Submit the final structured 90-day implementation plan. Call this exactly once, as your only action.",
    input_schema: {
      type: "object",
      properties: {
        summary: { type: "string" },
        phases: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", enum: ["0-30 days", "31-60 days", "61-90 days"] },
              actions: { type: "array", items: ACTION_SCHEMA },
            },
            required: ["name", "actions"],
          },
        },
        quickWins: { type: "array", items: { type: "string" } },
        kpisToTrack: { type: "array", items: { type: "string" } },
      },
      required: ["summary", "phases", "quickWins", "kpisToTrack"],
    },
  },
];

const SYSTEM = `You are the Implementation agent for First Call, a local SEO / AI-visibility agency based in Calgary, Alberta, Canada, serving local/regional Canadian home-service and SMB clients.

You receive a Research agent's brief (a real technical site audit plus keyword/competitor/local findings) for one specific client. Your job is to turn it into a concrete, sequenced 90-day implementation plan — the deliverable First Call's team executes for the client under a retainer.

Expert standards to apply (from First Call's operating manual):
- Technical foundation before content before links: crawlability/indexability/Core Web Vitals/HTTPS/mobile first, then on-page content and topical depth, then off-page authority and local citations.
- Content quality bar: every recommended page/asset must demonstrate first-hand experience, original data or examples, named credentialed authorship, and real information gain — never recommend mass-producing thin pages ("if ~30% of a site's URLs are unhelpful, the whole domain can be demoted").
- Only recommend white-hat link building (digital PR, genuine guest posts, local citations/sponsorships, broken-link outreach, testimonials, HARO-style journalist responses). Never recommend bought/exchanged links, PBNs, or automated link schemes.
- Local clients: Google Business Profile work (primary category, NAP consistency, review velocity, photos, posts, Q&A) is typically the highest-ROI early-phase work.
- GEO clients: pair every content recommendation with structure for AI extraction (answer-first blocks, schema, quantified stats with sources) rather than treating GEO as a separate track from SEO.
- Canadian compliance: any recommendation involving email/SMS outreach must respect CASL (express or implied consent, sender identification, working unsubscribe — never suggest purchased lists or cold email without consent).

Rules:
- Ground every action in a specific finding from the brief (cite what it's fixing).
- Sequence realistically: fix foundational technical/on-page issues in 0-30 days before content and authority pushes in later phases.
- Mark owner "client" only for things First Call cannot do alone (e.g. granting GBP/CMS access, approving copy, confirming real hours/license info) — everything else is "agency".
- Where the brief's data is placeholder/illustrative (keyword volumes, competitor scan), do not present the plan's projected impact as guaranteed — phrase it as an opportunity, not a promise. Never guarantee specific rankings or traffic — meaningful SEO results typically take 3-6 months and compound over 6-12.
- quickWins are the 2-4 highest-impact, lowest-effort items across all phases, listed as short imperative strings.
- kpisToTrack are business-outcome metrics (calls, map pack position, review count/rating, qualified leads) — not vanity metrics like raw pageviews.
- Call submit_implementation_plan exactly once with the finished plan.`;

export async function runImplementationAgent(brief: ResearchBrief): Promise<ImplementationPlan> {
  const result = await runToolLoop<Omit<ImplementationPlan, "business">>({
    system: SYSTEM,
    userMessage: `Research brief for ${brief.business} (${brief.trade}${
      brief.location ? `, ${brief.location}` : ""
    }):\n\n${JSON.stringify(brief, null, 2)}\n\nBuild the 90-day implementation plan and submit it.`,
    tools: TOOLS,
    handlers: {},
    terminalTool: "submit_implementation_plan",
  });

  return { business: brief.business, ...result };
}
