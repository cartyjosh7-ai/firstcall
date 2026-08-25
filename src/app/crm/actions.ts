"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/lib/auth";
import {
  assignLead,
  createLead,
  createUser,
  logContact,
  setLeadStatus,
  updateLeadNotes,
  userCount,
} from "@/lib/db/queries";

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
