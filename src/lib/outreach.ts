import { mockModeEnabled } from "./agents/orchestrate";
import { runOutreachAgent, buildMockOutreach } from "./agents/outreach-agent";
import { isUnsubscribed, unsubscribeLink } from "./unsubscribe";
import { logContact } from "./db/queries";
import { site } from "./content";
import type { Lead } from "./db/schema";

export type SendOutreachResult = { sent: boolean; reason?: string };

/**
 * Sends one CASL-compliant outreach email to a cold lead and logs the contact.
 * `lead.status !== "cold"` is the dedup guard: logContact() flips status to
 * "hot" on send, so a lead can never receive a second automated send.
 */
export async function sendOutreachEmail(lead: Lead, employeeId: string): Promise<SendOutreachResult> {
  if (!lead.email) return { sent: false, reason: "Lead has no email address." };
  if (lead.status !== "cold") return { sent: false, reason: `Lead status is "${lead.status}", not cold — already contacted.` };

  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "RESEND_API_KEY is not configured." };

  if (await isUnsubscribed(lead.email)) return { sent: false, reason: "Lead has unsubscribed." };

  const draft = mockModeEnabled() ? buildMockOutreach(lead) : await runOutreachAgent(lead);

  const { Resend } = await import("resend");
  const resend = new Resend(key);
  const from = process.env.RESEND_FROM || `First Call <${site.email}>`;

  await resend.emails.send({
    from,
    to: [lead.email],
    subject: draft.subject,
    text: `${draft.body}\n\n— First Call\n${site.email}\n${site.mailingAddress}\n\nUnsubscribe: ${unsubscribeLink(lead.email)}`,
  });

  await logContact({
    leadId: lead.id,
    employeeId,
    type: "email",
    summary: `Automated outreach sent: "${draft.subject}"`,
  });

  return { sent: true };
}

export async function runOutreachBatch(
  leads: Lead[],
  employeeId: string,
): Promise<{ sent: number; skipped: number }> {
  let sent = 0;
  let skipped = 0;

  // Sequential, not Promise.all — avoid bursting Resend and the outreach model.
  for (const lead of leads) {
    const result = await sendOutreachEmail(lead, employeeId);
    if (result.sent) sent++;
    else skipped++;
  }

  return { sent, skipped };
}
