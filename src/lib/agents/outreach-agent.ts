import Anthropic from "@anthropic-ai/sdk";
import { siteAuditTool } from "./tools";
import { foundation, site } from "../content";
import type { Lead } from "../db/schema";

let client: Anthropic | null = null;

function getClient() {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set.");
    client = new Anthropic({ apiKey });
  }
  return client;
}

export const OUTREACH_MODEL = process.env.ANTHROPIC_AGENT_MODEL || "claude-sonnet-5";

export type OutreachDraft = { subject: string; body: string };

const SYSTEM = `You are the Outreach agent for First Call, a local SEO / AI-visibility agency based in Calgary, Alberta, Canada, serving local/regional Canadian home-service and SMB clients (HVAC, roofing, remediation, cleaning, auto, trucking, clinics, legal, professional services).

Your job: draft a single short cold-outreach email to a lead who has not been contacted yet. This message must be able to stand on its own in a real inbox, sent under Canada's Anti-Spam Legislation (CASL) — so it must be honest, low-pressure, and specific.

Rules:
- Under ~150 words in the body.
- Reference ONE concrete, specific hook: the real audit finding you're given if present, otherwise a general trade-relevant observation about how local/AI search works for that trade. Never invent facts about the specific business (no fabricated scores, review counts, or claims about their site you weren't given).
- Exactly one clear call to action: either reply to this email, or visit ${site.url}/start.
- No false urgency or scarcity ("today only", "limited spots"). No claims of guaranteed rankings or traffic.
- You may mention the ${foundation.name} package at ${foundation.priceLabel} if relevant, but the pitch is not price-led.
- Plain, direct, first-person tone — a strategist writing one real email, not a template blast.
- Output ONLY valid JSON matching {"subject": string, "body": string}. No markdown, no code fences, no commentary.`;

function buildUserMessage(lead: Lead, auditSummary: string | null): string {
  const lines = [
    `Business: ${lead.businessName}`,
    lead.trade ? `Trade: ${lead.trade}` : null,
    lead.website ? `Website: ${lead.website}` : null,
    lead.contactName ? `Contact name: ${lead.contactName}` : null,
    lead.notes ? `Notes on file: ${lead.notes}` : null,
    auditSummary ? `Real audit finding to reference: ${auditSummary}` : "No website/audit data available — use a general trade-relevant observation instead.",
  ].filter(Boolean);
  return `${lines.join("\n")}\n\nDraft the outreach email now.`;
}

async function auditHook(website: string | null): Promise<string | null> {
  if (!website) return null;
  try {
    const audit = await siteAuditTool({ url: website });
    if (!audit.fetched) return null;
    const worst = audit.checks.filter((c) => !c.passed).sort((a, b) => b.max - a.max)[0];
    if (!worst) return `Scored ${audit.score}/${audit.max} on our technical/AI-visibility scan with no major gaps found.`;
    return `Scored ${audit.score}/${audit.max} on our technical/AI-visibility scan. Biggest gap: ${worst.label} — ${worst.detail}`;
  } catch {
    return null;
  }
}

function parseDraft(text: string): OutreachDraft {
  const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(cleaned) as Partial<OutreachDraft>;
  if (!parsed.subject || !parsed.body) throw new Error("Outreach agent returned incomplete JSON.");
  return { subject: parsed.subject, body: parsed.body };
}

export async function runOutreachAgent(lead: Lead): Promise<OutreachDraft> {
  const auditSummary = await auditHook(lead.website);

  const response = await getClient().messages.create({
    model: OUTREACH_MODEL,
    max_tokens: 1024,
    system: SYSTEM,
    messages: [{ role: "user", content: buildUserMessage(lead, auditSummary) }],
  });

  const textBlock = response.content.find((block): block is Anthropic.Messages.TextBlock => block.type === "text");
  if (!textBlock) throw new Error("Outreach agent returned no text.");
  return parseDraft(textBlock.text);
}

export function buildMockOutreach(lead: Lead): OutreachDraft {
  const trade = lead.trade || "local service";
  const hook = lead.website
    ? `I took a quick look at ${lead.website} — a lot of ${trade} sites in your area are missing the local-search and AI-visibility signals that decide who gets the call.`
    : `A lot of ${trade} businesses in Alberta are losing calls to competitors who simply show up first on Google and in AI answers.`;

  return {
    subject: `Quick note for ${lead.businessName}`,
    body: `Hi${lead.contactName ? ` ${lead.contactName}` : ""},

${hook}

I'm with First Call, a Calgary-based team that helps owner-led home-service businesses get found first — on the Map Pack, in Google AI Overviews, and in tools like ChatGPT. Our ${foundation.name} package (${foundation.priceLabel}) is built for exactly this.

No pressure — if it's useful, reply here or take a look at ${site.url}/start.

— First Call`,
  };
}
