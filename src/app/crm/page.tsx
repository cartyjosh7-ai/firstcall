import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { companyKpis, employeeKpis, listEmployees, listLeads } from "@/lib/db/queries";
import { StatusPill, SourceTag } from "./status-pill";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-[#12130f] p-4">
      <div className="font-serif text-3xl">{value}</div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  );
}

export default async function CrmDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/crm/login");

  if (session.user.role === "manager") {
    const [kpis, employees, recentLeads] = await Promise.all([
      companyKpis(),
      listEmployees(),
      listLeads(),
    ]);
    const employeeStats = await Promise.all(
      employees.map(async (e) => ({ employee: e, kpis: await employeeKpis(e.id) })),
    );

    return (
      <div>
        <p className="text-xs uppercase tracking-widest text-gold">Company overview</p>
        <h1 className="mt-2 font-serif text-3xl">Everything, at a glance</h1>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Total leads" value={kpis.total} />
          <Stat label="Cold (call list)" value={kpis.cold} />
          <Stat label="Warm" value={kpis.warm} />
          <Stat label="Hot" value={kpis.hot} />
          <Stat label="Won" value={kpis.won} />
          <Stat label="Lost" value={kpis.lost} />
          <Stat label="From the website" value={kpis.fromWebsite} />
          <Stat label="Unassigned" value={kpis.unassigned} />
        </div>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">Team</h2>
            <Link href="/crm/employees" className="text-sm text-gold no-underline hover:underline">
              Manage team →
            </Link>
          </div>
          {employeeStats.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No employees yet. Add one from the Team page.</p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-[#12130f] text-left text-xs uppercase tracking-widest text-muted">
                    <th className="px-4 py-3 font-normal">Employee</th>
                    <th className="px-4 py-3 font-normal">Assigned</th>
                    <th className="px-4 py-3 font-normal">Contacted</th>
                    <th className="px-4 py-3 font-normal">Contact logs</th>
                    <th className="px-4 py-3 font-normal">Won</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeStats.map(({ employee, kpis: ek }) => (
                    <tr key={employee.id} className="border-b border-line/60 last:border-0">
                      <td className="px-4 py-3">
                        <Link href={`/crm/employees/${employee.id}`} className="text-paper no-underline hover:text-gold">
                          {employee.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted">{ek.assigned}</td>
                      <td className="px-4 py-3 text-muted">{ek.contacted}</td>
                      <td className="px-4 py-3 text-muted">{ek.contactLogsLogged}</td>
                      <td className="px-4 py-3 text-muted">{ek.won}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">Recent leads</h2>
            <Link href="/crm/leads" className="text-sm text-gold no-underline hover:underline">
              All leads →
            </Link>
          </div>
          <RecentLeadsTable leads={recentLeads.slice(0, 8)} />
        </section>
      </div>
    );
  }

  // Employee view — their own queue and their own numbers only.
  const [myKpis, myLeads] = await Promise.all([
    employeeKpis(session.user.id),
    listLeads({ assignedTo: session.user.id }),
  ]);

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gold">Your workflow</p>
      <h1 className="mt-2 font-serif text-3xl">Welcome back, {session.user.name}</h1>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Assigned to you" value={myKpis.assigned} />
        <Stat label="Contacted" value={myKpis.contacted} />
        <Stat label="Contact logs" value={myKpis.contactLogsLogged} />
        <Stat label="Won" value={myKpis.won} />
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Your leads</h2>
          <Link href="/crm/leads/new" className="text-sm text-gold no-underline hover:underline">
            + Add a lead
          </Link>
        </div>
        <RecentLeadsTable leads={myLeads} />
      </section>
    </div>
  );
}

function RecentLeadsTable({
  leads,
}: {
  leads: Awaited<ReturnType<typeof listLeads>>;
}) {
  if (leads.length === 0) {
    return <p className="mt-4 text-sm text-muted">Nothing here yet.</p>;
  }
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[640px] border-collapse text-sm">
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
  );
}
