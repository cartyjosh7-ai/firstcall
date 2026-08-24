import { randomUUID } from "node:crypto";
import { runResearchAgent } from "./research-agent";
import { runImplementationAgent } from "./implementation-agent";
import { buildMockBrief, buildMockPlan } from "./mock-engine";
import { saveReport } from "../reports";
import type { EngineInput, EngineReport } from "./types";

/**
 * Mock mode is the default whenever no Anthropic key is configured, so the
 * whole pipeline (webhook -> report -> email) can be built and demoed at
 * zero API cost. Force it explicitly with AGENTS_MOCK_MODE=true/false.
 */
export function mockModeEnabled(): boolean {
  const flag = process.env.AGENTS_MOCK_MODE;
  if (flag === "true") return true;
  if (flag === "false") return false;
  return !process.env.ANTHROPIC_API_KEY;
}

/**
 * Runs the Research agent, hands its brief to the Implementation agent, and
 * persists the combined result. This is the engine that turns a signed
 * client into their first deliverable.
 */
export async function runEngine(input: EngineInput): Promise<EngineReport> {
  const mock = mockModeEnabled();

  const brief = mock ? await buildMockBrief(input) : await runResearchAgent(input);
  const plan = mock ? buildMockPlan(brief) : await runImplementationAgent(brief);

  const report: EngineReport = {
    id: randomUUID(),
    input,
    brief,
    plan,
    generatedAt: new Date().toISOString(),
    mock,
  };

  await saveReport(report);
  return report;
}
