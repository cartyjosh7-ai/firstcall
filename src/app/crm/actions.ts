"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/lib/auth";
import {
  assignLead,
  createLead,
  createUser,
  findUserByEmail,
  findUserById,
  getLead,
  listLeads,
  logContact,
  setLeadStatus,
  setUserPassword,
  updateLeadNotes,
  userCount,
} from "@/lib/db/queries";
import { createResetToken, peekResetTokenUserId, verifyResetToken } from "@/lib/reset-token";
import { site } from "@/lib/content";
import { runOutreachBatch, sendOutreachEmail } from "@/lib/outreach";

async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/crm/login");
  return session;
}

async function requireManager() {
  const session = await requireSession();
  if (session.user.role !== "manager") redirect("/crm");
  return session;
}

// ---------- Auth ----------

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  try {
    await signIn("credentials", { email, password, redirectTo: "/crm" });
  } catch (err) {
    if (err && typeof err === "object" && "type" in err && (err as { type: string }).type === "CredentialsSignin") {
      redirect("/crm/login?error=1");
    }
    throw err;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/crm/login" });
}

/** Only works while zero accounts exist — bootstraps the one manager account. */
export async function setupManagerAction(formData: FormData) {
  const existing = await userCount();
  if (existing > 0) redirect("/crm/login");

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!name || !email || password.length < 8) {
    redirect("/crm/setup?error=1");
  }

  await createUser({ name, email, password, role: "manager" });
  await signIn("credentials", { email, password, redirectTo: "/crm" });
}

// ---------- Employees (manager only) ----------

export async function createEmployeeAction(formData: FormData) {
  await requireManager();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!name || !email || password.length < 8) {
    redirect("/crm/employees?error=1");
  }
  await createUser({ name, email, password, role: "employee" });
  revalidatePath("/crm/employees");
  redirect("/crm/employees");
}

// ---------- Leads ----------

export async function createLeadAction(formData: FormData) {
  const session = await requireSession();
  const businessName = String(formData.get("businessName") || "").trim();
  if (!businessName) redirect("/crm/leads/new?error=1");

  const lead = await createLead({
    businessName,
    contactName: String(formData.get("contactName") || "") || undefined,
    email: String(formData.get("email") || "") || undefined,
    phone: String(formData.get("phone") || "") || undefined,
    website: String(formData.get("website") || "") || undefined,
    trade: String(formData.get("trade") || "") || undefined,
    notes: String(formData.get("notes") || "") || undefined,
    source: session.user.role === "manager" ? "manager" : "employee",
    createdBy: session.user.id,
    assignedTo: session.user.role === "employee" ? session.user.id : undefined,
  });

  revalidatePath("/crm/leads");
  redirect(`/crm/leads/${lead.id}`);
}

export async function logContactAction(formData: FormData) {
  const session = await requireSession();
  const leadId = String(formData.get("leadId") || "");
  const type = String(formData.get("type") || "note") as "call" | "email" | "text" | "meeting" | "note";
  const summary = String(formData.get("summary") || "").trim();
  if (!leadId || !summary) redirect(`/crm/leads/${leadId}?error=1`);

  await logContact({ leadId, employeeId: session.user.id, type, summary });
  revalidatePath(`/crm/leads/${leadId}`);
  redirect(`/crm/leads/${leadId}`);
}

export async function assignLeadAction(formData: FormData) {
  await requireManager();
  const leadId = String(formData.get("leadId") || "");
  const employeeId = String(formData.get("employeeId") || "") || null;
  await assignLead(leadId, employeeId);
  revalidatePath(`/crm/leads/${leadId}`);
  revalidatePath("/crm/leads");
}

export async function setLeadStatusAction(formData: FormData) {
  await requireSession();
  const leadId = String(formData.get("leadId") || "");
  const status = String(formData.get("status") || "") as "won" | "lost";
  if (status !== "won" && status !== "lost") return;
  await setLeadStatus(leadId, status);
  revalidatePath(`/crm/leads/${leadId}`);
  revalidatePath("/crm/leads");
}

export async function updateNotesAction(formData: FormData) {
  await requireSession();
  const leadId = String(formData.get("leadId") || "");
  const notes = String(formData.get("notes") || "");
  await updateLeadNotes(leadId, notes);
  revalidatePath(`/crm/leads/${leadId}`);
}

// ---------- Outreach (manager only — sends real email) ----------

export async function runOutreachBatchAction(formData: FormData) {
  const session = await requireManager();
  const requested = Number(formData.get("count") || 10);
  const count = Math.max(1, Math.min(25, Number.isFinite(requested) ? requested : 10));

  const cold = await listLeads({ status: "cold" });
  const batch = cold.slice(0, count);
  const { sent, skipped } = await runOutreachBatch(batch, session.user.id);

  revalidatePath("/crm/leads");
  redirect(`/crm/leads?outreachSent=${sent}&outreachSkipped=${skipped}`);
}

export async function sendOutreachAction(formData: FormData) {
  const session = await requireManager();
  const leadId = String(formData.get("leadId") || "");
  const lead = await getLead(leadId);
  if (!lead) redirect("/crm/leads");

  const result = await sendOutreachEmail(lead, session.user.id);
  revalidatePath(`/crm/leads/${leadId}`);
  redirect(`/crm/leads/${leadId}${result.sent ? "" : "?outreachError=1"}`);
}

// ---------- Password reset ----------

async function sendResetEmail(to: string, name: string, link: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return; // No-op until Resend is configured, same pattern as src/lib/leads.ts.
  const { Resend } = await import("resend");
  const resend = new Resend(key);
  const from = process.env.RESEND_FROM || `First Call <${site.email}>`;
  await resend.emails.send({
    from,
    to: [to],
    subject: "Reset your First Call CRM password",
    text: `Hi ${name},\n\nReset your CRM password here (expires in 1 hour):\n${link}\n\nIf you didn't request this, ignore this email — your password won't change.\n\n— First Call`,
  });
}

/** Always redirects to the same "check your email" page, whether or not the address exists — avoids leaking which emails have accounts. */
export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const user = email ? await findUserByEmail(email) : null;
  if (user) {
    const token = createResetToken(user.id, user.passwordHash);
    const link = `${site.url}/crm/reset-password?token=${token}`;
    await sendResetEmail(user.email, user.name, link).catch(() => {});
  }
  redirect("/crm/forgot-password?sent=1");
}

export async function resetPasswordAction(formData: FormData) {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");

  const userId = peekResetTokenUserId(token);
  const user = userId ? await findUserById(userId) : null;
  const verifiedId = user ? verifyResetToken(token, user.passwordHash) : null;

  if (!user || !verifiedId || verifiedId !== user.id || password.length < 8) {
    redirect(`/crm/reset-password?token=${token}&error=1`);
  }

  await setUserPassword(user.id, password);
  redirect("/crm/login?reset=1");
}
