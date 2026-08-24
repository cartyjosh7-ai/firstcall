import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { site } from "./content";

export type LeadPayload = {
  kind: "audit" | "contact" | "proposal" | "won";
  name?: string;
  email?: string;
  phone?: string;
  business?: string;
  website?: string;
  trade?: string;
  message?: string;
  score?: number;
  url?: string;
  reportUrl?: string;
};

function inbox() {
  return process.env.LEAD_INBOX || site.email;
}

async function persist(lead: LeadPayload) {
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  const line = JSON.stringify({ ...lead, at: new Date().toISOString() }) + "\n";
  await appendFile(path.join(dir, "leads.jsonl"), line, "utf8");
}

async function emailLead(lead: LeadPayload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { emailed: false as const };

  const { Resend } = await import("resend");
  const resend = new Resend(key);
  const from = process.env.RESEND_FROM || `First Call <${site.email}>`;
  const subject =
    lead.kind === "audit"
      ? `Audit lead${lead.score != null ? ` · ${lead.score}/100` : ""} · ${lead.website || lead.url || "no url"}`
      : lead.kind === "proposal"
        ? `Proposal / Foundation request · ${lead.business || lead.email}`
        : lead.kind === "won"
          ? `Deal closed · ${lead.business || lead.email} · Foundation`
          : `Contact · ${lead.business || lead.name || lead.email}`;

  const text = Object.entries(lead)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  await resend.emails.send({
    from,
    to: [inbox()],
    replyTo: lead.email || undefined,
    subject,
    text: `${text}\n\nReply within one business day with the score, gaps, and next step (call or Foundation proposal).`,
  });

  if (lead.email) {
    await resend.emails.send({
      from,
      to: [lead.email],
      subject:
        lead.kind === "audit"
          ? "Your First Call visibility audit is in"
          : lead.kind === "won"
            ? "Welcome to First Call — your onboarding audit is ready"
            : "First Call received your note",
      text:
        lead.kind === "audit"
          ? `We scanned ${lead.url || lead.website || "your site"}${
              lead.score != null ? ` and scored it ${lead.score}/100` : ""
            }.\n\nA senior strategist reviews every scan by hand and will follow up within one business day with what the scanner cannot see (Business Profile, rivals, who is getting the calls) and a clear next step.\n\nIf you already know you want Foundation ($4,500/month, month-to-month), start here: ${site.url}/start\n\n— First Call\n${site.email}`
          : lead.kind === "won"
            ? `Payment received. Your first research and 90-day implementation plan is ready:\n\n${lead.reportUrl || `${site.url}/start/success`}\n\nReply with GBP, analytics, and CMS access and we'll start month one.\n\n— First Call\n${site.email}`
            : `Thanks. A senior strategist will get back to you within one business day.\n\n— First Call\n${site.email}`,
    });
  }

  return { emailed: true as const };
}

export async function captureLead(lead: LeadPayload) {
  await persist(lead);
  try {
    return await emailLead(lead);
  } catch (err) {
    return {
      emailed: false as const,
      error: err instanceof Error ? err.message : "email failed",
    };
  }
}
