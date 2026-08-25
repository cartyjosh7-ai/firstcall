import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { employeeKpis, findUserById, listLeads } from "@/lib/db/queries";
import { StatusPill, SourceTag } from "../../status-pill";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const user = await findUserById(id);
  return { title: user?.name ?? "Employee" };
}

export const dynamic = "force-dynamic";

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/crm/login");
  if (session.user.role !== "manager") redirect("/crm");

  const { id } = await params;
  const employee = await findUserById(id);
  if (!employee || employee.role !== "employee") notFound();

  const [kpis, leads] = await Promise.all([employeeKpis(id), listLeads({ assignedTo: id })]);

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gold">Employee</p>
      <h1 className="mt-2 font-serif text-3xl">{employee.name}</h1>
      <p className="mt-1 text-sm text-muted">{employee.email}</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Assigned leads" value={kpis.assigned} />
        <Stat label="Contacted" value={kpis.contacted} />
        <Stat label="Contact logs" value={kpis.contactLogsLogged} />
        <Stat label="Won" value={kpis.won} />
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-xl">Their leads</h2>
        {leads.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No leads assigned yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-[#12130f] text-left text-xs uppercase tracking-widest text-muted">
                  <th className="px-4 py-3 font-normal">Business</th>
                  <th className="px-4 py-3 font-normal">Source</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal">Added</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-line/60 last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/crm/leads/${l.id}`} className="text-paper no-underline hover:text-gold">
                        {l.businessName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <SourceTag source={l.source} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={l.status} />
                    </td>
                    <td className="px-4 py-3 text-muted">{new Date(l.createdAt).toLocaleDateString("en-CA")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-[#12130f] p-4">
      <div className="font-serif text-3xl">{value}</div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  );
}
