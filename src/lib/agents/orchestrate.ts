import { randomUUID } from "node:crypto";
import { runResearchAgent } from "./research-agent";
import { runImplementationAgent } from "./implementation-agent";
import { saveReport } from "../reports";
import type { EngineInput, EngineReport } from "./types";

/**
 * Runs the Research agent, hands its brief to the Implementation agent, and
 * persists the combined result. This is the engine that turns a signed
 * client into their first deliverable.
 */
export async function runEngine(input: EngineInput): Promise<EngineReport> {
  const brief = await runResearchAgent(input);
  const plan = await runImplementationAgent(brief);

  const report: EngineReport = {
    id: randomUUID(),
    input,
    brief,
    plan,
    generatedAt: new Date().toISOString(),
  };

  await saveReport(report);
  return report;
}
