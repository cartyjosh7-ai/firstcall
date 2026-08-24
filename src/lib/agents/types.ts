import type { AuditResult } from "@/lib/audit";

export type EngineInput = {
  business: string;
  website: string;
  trade: string;
  location?: string;
  email?: string;
};

export type KeywordOpportunity = {
  keyword: string;
  intent: "emergency" | "research" | "commercial" | "brand";
  estMonthlySearches: number;
  difficulty: "low" | "medium" | "high";
  rationale: string;
};

export type CompetitorGap = {
  competitor: string;
  gap: string;
  opportunity: string;
};

export type LocalFinding = {
  area: string;
  finding: string;
  severity: "low" | "medium" | "high";
};

export type ContentGap = {
  topic: string;
  format: string;
  targetKeyword: string;
};

export type ResearchBrief = {
  business: string;
  website: string;
  trade: string;
  location?: string;
  siteAudit: AuditResult;
  keywordOpportunities: KeywordOpportunity[];
  competitorGaps: CompetitorGap[];
  localSeoFindings: LocalFinding[];
  contentGaps: ContentGap[];
  summary: string;
};

export type PlanAction = {
  title: string;
  category: "technical" | "content" | "local" | "authority";
  description: string;
  expectedImpact: "low" | "medium" | "high";
  effort: "low" | "medium" | "high";
  owner: "agency" | "client";
};

export type PlanPhase = {
  name: "0-30 days" | "31-60 days" | "61-90 days";
  actions: PlanAction[];
};

export type ImplementationPlan = {
  business: string;
  phases: PlanPhase[];
  quickWins: string[];
  kpisToTrack: string[];
  summary: string;
};

export type Proposal = {
  business: string;
  website: string;
  objectives: string[];
  scope: string[];
  approach: string;
  deliverables: { phase: string; items: string[] }[];
  investment: { label: string; amount: string; cadence: string };
  expectedOutcomes: string[];
  notIncluded: string[];
  terms: string[];
  nextSteps: string[];
};

export type EngineReport = {
  id: string;
  input: EngineInput;
  brief: ResearchBrief;
  plan: ImplementationPlan;
  generatedAt: string;
  /** True when built by the zero-cost rule-based engine instead of the Claude agents. */
  mock: boolean;
};
