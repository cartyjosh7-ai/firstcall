import { runAudit } from "@/lib/audit";

function seedFrom(...parts: string[]) {
  const str = parts.join("|").toLowerCase();
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h || 1;
}

function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const INTENT_TEMPLATES: { suffix: string; intent: "emergency" | "research" | "commercial" }[] = [
  { suffix: "near me", intent: "emergency" },
  { suffix: "emergency repair", intent: "emergency" },
  { suffix: "cost", intent: "commercial" },
  { suffix: "vs replacement", intent: "research" },
  { suffix: "reviews", intent: "commercial" },
  { suffix: "how much does it cost", intent: "research" },
  { suffix: "same day service", intent: "emergency" },
  { suffix: "best company", intent: "commercial" },
];

export async function siteAuditTool(input: { url: string }) {
  return runAudit(input.url);
}

export function keywordResearchTool(input: {
  trade: string;
  location?: string;
  seedTopics?: string[];
}) {
  const topics = input.seedTopics?.length ? input.seedTopics : [input.trade];
  const rand = mulberry32(seedFrom(input.trade, input.location || "", ...topics));
  const location = input.location || "your service area";
  const results: {
    keyword: string;
    intent: "emergency" | "research" | "commercial";
    estMonthlySearches: number;
    difficulty: "low" | "medium" | "high";
    rationale: string;
  }[] = [];

  for (const topic of topics.slice(0, 4)) {
    const count = 3 + Math.floor(rand() * 3);
    for (const t of INTENT_TEMPLATES.slice(0, count)) {
      const volume = Math.round((80 + rand() * 900) / 10) * 10;
      const difficulty = volume > 500 ? "high" : volume > 200 ? "medium" : "low";
      results.push({
        keyword: `${topic} ${t.suffix} ${location}`.replace(/\s+/g, " ").trim(),
        intent: t.intent,
        estMonthlySearches: volume,
        difficulty,
        rationale: "Estimated placeholder volume — connect a keyword data provider (Ahrefs/Semrush/GSC) for live numbers.",
      });
    }
  }

  return {
    note: "PLACEHOLDER DATA: no keyword API is connected yet. These are illustrative estimates only, not real search volumes.",
    keywords: results.slice(0, 10),
  };
}

export function competitorScanTool(input: { trade: string; location?: string }) {
  const rand = mulberry32(seedFrom(input.trade, input.location || "", "competitors"));
  const patterns = [
    "Thin, templated location pages with no unique proof",
    "No FAQ or schema markup, so AI Overviews cite a national directory instead",
    "Inconsistent NAP across citations, weakening map pack rank",
    "Stale Google Business Profile with few recent reviews",
    "No answer-first content, so voice assistants and AI chat cannot quote them",
    "Slow, image-heavy homepage that fails mobile trust in the first five seconds",
  ];
  const shuffled = [...patterns].sort(() => rand() - 0.5);
  return {
    note: "PLACEHOLDER DATA: no live competitor/rank-tracking API is connected yet. These are common gap patterns for this trade, not a scan of named competitors.",
    commonGaps: shuffled.slice(0, 4),
  };
}
