import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLead, listContactLogs, listEmployees } from "@/lib/db/queries";
import { StatusPill, SourceTag } from "../../status-pill";
import { assignLeadAction, logContactAction, setLeadStatusAction, updateNotesAction } from "../../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const lead = await getLead(id);
  return { title: lead?.businessName ?? "Lead" };
}

const CONTACT_TYPES = ["call", "email", "text", "meeting", "note"] as const;

export default async function LeadProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/crm/login");

  const { id } = await params;
  const { error } = await searchParams;
  const lead = await getLead(id);
  if (!lead) notFound();

  const isManager = session.user.role === "manager";
  if (!isManager && lead.assignedTo !== session.user.id) {
    // Employees only see their own book of leads.
    redirect("/crm/leads");
  }

  const [logs, employees] = await Promise.all([listContactLogs(id), isManager ? listEmployees() : Promise.resolve([])]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-3xl">{lead.businessName}</h1>
          <StatusPill status={lead.status} />
          <SourceTag source={lead.source} />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
          <Field label="Contact" value={lead.contactName} />
          <Field label="Email" value={lead.email} />
          <Field label="Phone" value={lead.phone} />
          <Field label="Website" value={lead.website} />
          <Field label="Trade" value={lead.trade} />
          <Field label="Added" value={new Date(lead.createdAt).toLocaleDateString("en-CA")} />
        </dl>

        {lead.status !== "won" && lead.status !== "lost" ? (
          <div className="mt-4 flex gap-3">
            <form action={setLeadStatusAction}>
              <input type="hidden" name="leadId" value={lead.id} />
              <input type="hidden" name="status" value="won" />
              <button type="submit" className="rounded-full bg-gold px-4 py-1.5 text-xs font-medium text-ink hover:opacity-90">
                Mark won
              </button>
            </form>
            <form action={setLeadStatusAction}>
              <input type="hidden" name="leadId" value={lead.id} />
              <input type="hidden" name="status" value="lost" />
              <button type="submit" className="rounded-full border border-line px-4 py-1.5 text-xs text-muted hover:text-paper">
                Mark lost
              </button>
            </form>
          </div>
        ) : null}

        <section className="mt-10">
          <h2 className="font-serif text-xl">Log a contact</h2>
          <p className="mt-1 text-sm text-muted">
            The first entry here automatically flips this lead to <b>hot</b>.
          </p>
          <form action={logContactAction} className="mt-4 grid gap-3 rounded-2xl border border-line bg-[#12130f] p-5">
            <input type="hidden" name="leadId" value={lead.id} />
            <div className="flex flex-wrap gap-3">
              {CONTACT_TYPES.map((t, i) => (
                <label key={t} className="flex items-center gap-2 text-sm capitalize">
                  <input type="radio" name="type" value={t} defaultChecked={i === 0} className="accent-gold" />
                  {t}
                </label>
              ))}
            </div>
            <textarea
              required
              name="summary"
              rows={3}
              placeholder="What happened on this contact?"
              className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm"
            />
            {error ? <p className="text-sm text-rust">Add a summary before logging the contact.</p> : null}
            <button type="submit" className="w-fit rounded-full bg-gold px-4 py-2 text-sm font-medium text-ink hover:opacity-90">
              Log contact
            </button>
          </form>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl">Contact history</h2>
          {logs.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No contact logged yet.</p>
          ) : (
            <ol className="mt-4 space-y-4">
              {logs.map((log) => (
                <li key={log.id} className="rounded-xl border border-line bg-[#12130f] p-4">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="capitalize text-gold">{log.type}</span>
                    <span>{new Date(log.createdAt).toLocaleString("en-CA")}</span>
                  </div>
                  <p className="mt-2 text-sm">{log.summary}</p>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl">Notes</h2>
          <form action={updateNotesAction} className="mt-3">
            <input type="hidden" name="leadId" value={lead.id} />
            <textarea
              name="notes"
              rows={4}
              defaultValue={lead.notes ?? ""}
              placeholder="Freeform notes about this lead…"
              className="w-full rounded-lg border border-line bg-[#12130f] px-3 py-2 text-sm"
            />
            <button type="submit" className="mt-2 rounded-full border border-line px-4 py-1.5 text-xs text-muted hover:text-paper">
              Save notes
            </button>
          </form>
        </section>
      </div>

      {isManager ? (
        <aside className="h-fit rounded-2xl border border-line bg-[#12130f] p-5">
          <h3 className="font-serif text-lg">Assignment</h3>
          <p className="mt-1 text-xs text-muted">Manager-only.</p>
          <form action={assignLeadAction} className="mt-4 grid gap-3">
            <input type="hidden" name="leadId" value={lead.id} />
            <select name="employeeId" defaultValue={lead.assignedTo ?? ""} className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm">
              <option value="">Unassigned</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
            <button type="submit" className="rounded-full bg-gold py-2 text-sm font-medium text-ink hover:opacity-90">
              Save assignment
            </button>
          </form>
        </aside>
      ) : null}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-muted">{label}</dt>
      <dd className="mt-0.5">{value || "—"}</dd>
    </div>
  );
}
