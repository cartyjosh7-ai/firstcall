import { and, desc, eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getDb } from "./client";
import { users, leads, contactLogs, type Lead } from "./schema";

// ---------- Users ----------

export async function userCount() {
  const rows = await getDb().select({ n: sql<number>`count(*)::int` }).from(users);
  return rows[0]?.n ?? 0;
}

export async function findUserByEmail(email: string) {
  const rows = await getDb().select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
  return rows[0] ?? null;
}

export async function findUserById(id: string) {
  const rows = await getDb().select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createUser(input: { email: string; password: string; name: string; role: "manager" | "employee" }) {
  const passwordHash = await bcrypt.hash(input.password, 12);
  const rows = await getDb()
    .insert(users)
    .values({ email: input.email.toLowerCase().trim(), passwordHash, name: input.name, role: input.role })
    .returning();
  return rows[0];
}

export async function verifyPassword(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function setUserPassword(userId: string, newPassword: string) {
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await getDb().update(users).set({ passwordHash }).where(eq(users.id, userId));
}

export async function listEmployees() {
  return getDb().select().from(users).where(eq(users.role, "employee")).orderBy(users.name);
}

// ---------- Leads ----------

/** cold: scraper + never contacted. warm: any other source + never contacted. hot: contacted, any source. */
function initialStatus(source: Lead["source"]): Lead["status"] {
  return source === "scraper" ? "cold" : "warm";
}

export async function createLead(input: {
  businessName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  trade?: string;
  notes?: string;
  source: Lead["source"];
  status?: Lead["status"];
  createdBy?: string;
  assignedTo?: string;
}) {
  const rows = await getDb()
    .insert(leads)
    .values({
      businessName: input.businessName,
      contactName: input.contactName,
      email: input.email,
      phone: input.phone,
      website: input.website,
      trade: input.trade,
      notes: input.notes,
      source: input.source,
      status: input.status ?? initialStatus(input.source),
      createdBy: input.createdBy,
      assignedTo: input.assignedTo,
    })
    .returning();
  return rows[0];
}

/** Bulk insert for the scraper pipeline — always lands as cold/scraper. */
export async function bulkCreateScraperLeads(
  rows: { businessName: string; website?: string; phone?: string; email?: string; trade?: string; notes?: string }[],
) {
  if (rows.length === 0) return [];
  return getDb()
    .insert(leads)
    .values(rows.map((r) => ({ ...r, source: "scraper" as const, status: "cold" as const })))
    .returning();
}

/**
 * Deletes every scraper-sourced lead that hasn't been touched yet (still
 * "cold" — no contact logged, not assigned, not won/lost). Never touches a
 * lead a human has already worked, even if it originally came from a
 * scraper import. Cascades to contact logs via the FK's onDelete: "cascade".
 */
export async function deleteUntouchedScraperLeads() {
  return getDb()
    .delete(leads)
    .where(and(eq(leads.source, "scraper"), eq(leads.status, "cold")))
    .returning({ id: leads.id });
}

/** Finds the most recent open (non-won/lost) website lead for this business, or creates one as `won`. */
export async function markWebsiteLeadWon(input: {
  businessName: string;
  website?: string;
  email?: string;
  trade?: string;
  packageName?: string;
}) {
  const db = getDb();
  const candidates = await db
    .select()
    .from(leads)
    .where(and(eq(leads.source, "website"), eq(leads.businessName, input.businessName)))
    .orderBy(desc(leads.createdAt))
    .limit(1);

  const purchaseNote = input.packageName ? `Purchased: ${input.packageName}` : undefined;

  if (candidates[0]) {
    const notes = [candidates[0].notes, purchaseNote].filter(Boolean).join("\n") || undefined;
    await db
      .update(leads)
      .set({ status: "won", notes, updatedAt: new Date() })
      .where(eq(leads.id, candidates[0].id));
    return candidates[0].id;
  }

  const created = await createLead({
    businessName: input.businessName,
    website: input.website,
    email: input.email,
    trade: input.trade,
    notes: purchaseNote,
    source: "website",
    status: "won",
  });
  return created.id;
}

export async function listLeads(filter?: { status?: Lead["status"]; source?: Lead["source"]; assignedTo?: string }) {
  const conditions = [];
  if (filter?.status) conditions.push(eq(leads.status, filter.status));
  if (filter?.source) conditions.push(eq(leads.source, filter.source));
  if (filter?.assignedTo) conditions.push(eq(leads.assignedTo, filter.assignedTo));

  const query = getDb().select().from(leads).orderBy(desc(leads.createdAt));
  return conditions.length ? query.where(and(...conditions)) : query;
}

export async function getLead(id: string) {
  const rows = await getDb().select().from(leads).where(eq(leads.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function assignLead(leadId: string, employeeId: string | null) {
  await getDb().update(leads).set({ assignedTo: employeeId, updatedAt: new Date() }).where(eq(leads.id, leadId));
}

export async function setLeadStatus(leadId: string, status: Lead["status"]) {
  await getDb().update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, leadId));
}

export async function updateLeadNotes(leadId: string, notes: string) {
  await getDb().update(leads).set({ notes, updatedAt: new Date() }).where(eq(leads.id, leadId));
}

// ---------- Contact logs ----------

export async function logContact(input: { leadId: string; employeeId: string; type: (typeof contactLogs.$inferInsert)["type"]; summary: string }) {
  const db = getDb();
  const [log] = await db
    .insert(contactLogs)
    .values({ leadId: input.leadId, employeeId: input.employeeId, type: input.type, summary: input.summary })
    .returning();

  const lead = await getLead(input.leadId);
  if (lead && lead.status !== "hot" && lead.status !== "won" && lead.status !== "lost") {
    await db
      .update(leads)
      .set({ status: "hot", firstContactedAt: lead.firstContactedAt ?? new Date(), updatedAt: new Date() })
      .where(eq(leads.id, input.leadId));
  }

  return log;
}

export async function listContactLogs(leadId: string) {
  return getDb().select().from(contactLogs).where(eq(contactLogs.leadId, leadId)).orderBy(desc(contactLogs.createdAt));
}

// ---------- KPIs ----------

export async function employeeKpis(employeeId: string) {
  const db = getDb();
  const [assigned] = await db.select({ n: sql<number>`count(*)::int` }).from(leads).where(eq(leads.assignedTo, employeeId));
  const [contacted] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(leads)
    .where(and(eq(leads.assignedTo, employeeId), sql`${leads.firstContactedAt} is not null`));
  const [won] = await db.select({ n: sql<number>`count(*)::int` }).from(leads).where(and(eq(leads.assignedTo, employeeId), eq(leads.status, "won")));
  const [calls] = await db.select({ n: sql<number>`count(*)::int` }).from(contactLogs).where(eq(contactLogs.employeeId, employeeId));

  return {
    assigned: assigned?.n ?? 0,
    contacted: contacted?.n ?? 0,
    won: won?.n ?? 0,
    contactLogsLogged: calls?.n ?? 0,
  };
}

export async function companyKpis() {
  const db = getDb();
  const [total] = await db.select({ n: sql<number>`count(*)::int` }).from(leads);
  const [cold] = await db.select({ n: sql<number>`count(*)::int` }).from(leads).where(eq(leads.status, "cold"));
  const [warm] = await db.select({ n: sql<number>`count(*)::int` }).from(leads).where(eq(leads.status, "warm"));
  const [hot] = await db.select({ n: sql<number>`count(*)::int` }).from(leads).where(eq(leads.status, "hot"));
  const [won] = await db.select({ n: sql<number>`count(*)::int` }).from(leads).where(eq(leads.status, "won"));
  const [lost] = await db.select({ n: sql<number>`count(*)::int` }).from(leads).where(eq(leads.status, "lost"));
  const [fromWebsite] = await db.select({ n: sql<number>`count(*)::int` }).from(leads).where(eq(leads.source, "website"));
  const [unassigned] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(leads)
    .where(sql`${leads.assignedTo} is null`);

  return {
    total: total?.n ?? 0,
    cold: cold?.n ?? 0,
    warm: warm?.n ?? 0,
    hot: hot?.n ?? 0,
    won: won?.n ?? 0,
    lost: lost?.n ?? 0,
    fromWebsite: fromWebsite?.n ?? 0,
    unassigned: unassigned?.n ?? 0,
  };
}
