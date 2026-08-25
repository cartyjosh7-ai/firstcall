import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["manager", "employee"]);
export const leadSource = pgEnum("lead_source", ["scraper", "website", "employee", "manager"]);
export const leadStatus = pgEnum("lead_status", ["cold", "warm", "hot", "won", "lost"]);
export const contactType = pgEnum("contact_type", ["call", "email", "text", "meeting", "note"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: userRole("role").notNull().default("employee"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name"),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  trade: text("trade"),
  notes: text("notes"),
  source: leadSource("source").notNull(),
  status: leadStatus("status").notNull().default("warm"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  createdBy: uuid("created_by").references(() => users.id),
  firstContactedAt: timestamp("first_contacted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactLogs = pgTable("contact_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => users.id),
  type: contactType("type").notNull(),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type ContactLog = typeof contactLogs.$inferSelect;
