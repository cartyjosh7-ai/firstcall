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

const SYSTEM = `You are the Implementation agent for First Call, a local SEO / AI-visibility agency for home-service trades.

You receive a Research agent's brief (a real technical site audit plus keyword/competitor/local findings) for one specific client. Your job is to turn it into a concrete, sequenced 90-day implementation plan — the deliverable First Call's team executes for the client under the Foundation plan.

Rules:
- Ground every action in a specific finding from the brief (cite what it's fixing).
- Sequence realistically: fix foundational technical/on-page issues in 0-30 days before content and authority pushes in later phases.
- Mark owner "client" only for things First Call cannot do alone (e.g. granting GBP/CMS access, approving copy) — everything else is "agency".
- Where the brief's data is placeholder/illustrative (keyword volumes, competitor scan), do not present the plan's projected impact as guaranteed — phrase it as an opportunity, not a promise.
- quickWins are the 2-4 highest-impact, lowest-effort items across all phases, listed as short imperative strings.
- kpisToTrack are the metrics First Call's monthly report will show progress against (calls, map pack position, review count, etc.) — not vanity metrics.
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
