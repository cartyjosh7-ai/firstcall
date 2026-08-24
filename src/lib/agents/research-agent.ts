import Anthropic from "@anthropic-ai/sdk";
import { runToolLoop } from "./loop";
import { siteAuditTool, keywordResearchTool, competitorScanTool } from "./tools";
import type { EngineInput, ResearchBrief } from "./types";

type Tool = Anthropic.Messages.Tool;

const TOOLS: Tool[] = [
  {
    name: "run_site_audit",
    description:
      "Runs a real, live technical/on-page audit of the client's website across Maps, AI Overviews, AI Assistants, Voice, and Website/Reviews signals. Always call this first.",
    input_schema: {
      type: "object",
      properties: { url: { type: "string" } },
      required: ["url"],
    },
  },
  {
    name: "keyword_research",
    description:
      "Returns keyword opportunity estimates for the given trade/location/topics. Data is placeholder/illustrative until a real keyword API is connected — say so in your findings.",
    input_schema: {
      type: "object",
      properties: {
        trade: { type: "string" },
        location: { type: "string" },
        seedTopics: { type: "array", items: { type: "string" } },
      },
      required: ["trade"],
    },
  },
  {
    name: "competitor_scan",
    description:
      "Returns common competitive gap patterns for the trade/location. Data is placeholder/illustrative until a real competitor/rank-tracking API is connected — say so in your findings.",
    input_schema: {
      type: "object",
      properties: {
        trade: { type: "string" },
        location: { type: "string" },
      },
      required: ["trade"],
    },
  },
  {
    name: "submit_research_brief",
    description:
      "Submit the final structured research brief. Call this exactly once, last, after using the other tools.",
    input_schema: {
      type: "object",
      properties: {
        summary: { type: "string" },
        keywordOpportunities: {
          type: "array",
          items: {
            type: "object",
            properties: {
              keyword: { type: "string" },
              intent: { type: "string", enum: ["emergency", "research", "commercial", "brand"] },
              estMonthlySearches: { type: "number" },
              difficulty: { type: "string", enum: ["low", "medium", "high"] },
              rationale: { type: "string" },
            },
            required: ["keyword", "intent", "estMonthlySearches", "difficulty", "rationale"],
          },
        },
        competitorGaps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              competitor: { type: "string" },
              gap: { type: "string" },
              opportunity: { type: "string" },
            },
            required: ["competitor", "gap", "opportunity"],
          },
        },
        localSeoFindings: {
          type: "array",
          items: {
            type: "object",
            properties: {
              area: { type: "string" },
              finding: { type: "string" },
              severity: { type: "string", enum: ["low", "medium", "high"] },
            },
            required: ["area", "finding", "severity"],
          },
        },
        contentGaps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              topic: { type: "string" },
              format: { type: "string" },
              targetKeyword: { type: "string" },
            },
            required: ["topic", "format", "targetKeyword"],
          },
        },
      },
      required: [
        "summary",
        "keywordOpportunities",
        "competitorGaps",
        "localSeoFindings",
        "contentGaps",
      ],
    },
  },
];

const SYSTEM = `You are the Research agent for First Call, a local SEO / AI-visibility agency for home-service trades (HVAC, roofing, remediation, cleaning, auto, trucking).

Your job: research a specific client's SEO/AI-visibility position and produce a structured research brief. The Implementation agent will turn your brief into a 90-day plan, so be concrete enough to act on.

Process:
1. Call run_site_audit on the client's website first. This is real data — treat it as ground truth and reference specific findings from it.
2. Call keyword_research and competitor_scan to round out the picture. This data is placeholder/illustrative (no live keyword or rank-tracking API is connected yet) — say so plainly in any finding that leans on it, and never present the estimated numbers as verified.
3. Call submit_research_brief exactly once with your synthesized findings. Be specific to this client's trade and location, not generic boilerplate. Every finding should be something a strategist could act on.`;

type SubmittedBrief = Pick<
  ResearchBrief,
  "summary" | "keywordOpportunities" | "competitorGaps" | "localSeoFindings" | "contentGaps"
>;

export async function runResearchAgent(input: EngineInput): Promise<ResearchBrief> {
  let capturedAudit: ResearchBrief["siteAudit"] | null = null;

  const submitted = await runToolLoop<SubmittedBrief>({
    system: SYSTEM,
    userMessage: `Client: ${input.business}\nWebsite: ${input.website}\nTrade: ${input.trade}\nLocation: ${
      input.location || "not specified"
    }\n\nRun the research and submit the brief.`,
    tools: TOOLS,
    handlers: {
      run_site_audit: async (raw) => {
        const audit = await siteAuditTool(raw as { url: string });
        capturedAudit = audit;
        return audit;
      },
      keyword_research: (raw) => keywordResearchTool(raw as Parameters<typeof keywordResearchTool>[0]),
      competitor_scan: (raw) => competitorScanTool(raw as Parameters<typeof competitorScanTool>[0]),
    },
    terminalTool: "submit_research_brief",
  });

  const siteAudit = capturedAudit ?? (await siteAuditTool({ url: input.website }));

  return {
    business: input.business,
    website: input.website,
    trade: input.trade,
    location: input.location,
    siteAudit,
    ...submitted,
  };
}
