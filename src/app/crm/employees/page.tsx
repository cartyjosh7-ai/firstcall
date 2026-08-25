import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { employeeKpis, listEmployees } from "@/lib/db/queries";
import { createEmployeeAction } from "../actions";

export const metadata: Metadata = { title: "Team" };
export const dynamic = "force-dynamic";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/crm/login");
  if (session.user.role !== "manager") redirect("/crm");

  const { error } = await searchParams;
  const employees = await listEmployees();
  const stats = await Promise.all(employees.map(async (e) => ({ employee: e, kpis: await employeeKpis(e.id) })));

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gold">Manager only</p>
      <h1 className="mt-2 font-serif text-3xl">Team</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          {stats.length === 0 ? (
            <p className="text-sm text-muted">No employees yet — add the first one.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-[#12130f] text-left text-xs uppercase tracking-widest text-muted">
                    <th className="px-4 py-3 font-normal">Name</th>
                    <th className="px-4 py-3 font-normal">Assigned</th>
                    <th className="px-4 py-3 font-normal">Contacted</th>
                    <th className="px-4 py-3 font-normal">Contact logs</th>
                    <th className="px-4 py-3 font-normal">Won</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map(({ employee, kpis }) => (
                    <tr key={employee.id} className="border-b border-line/60 last:border-0">
                      <td className="px-4 py-3">
                        <Link href={`/crm/employees/${employee.id}`} className="text-paper no-underline hover:text-gold">
                          {employee.name}
                        </Link>
                        <div className="text-xs text-muted">{employee.email}</div>
                      </td>
                      <td className="px-4 py-3 text-muted">{kpis.assigned}</td>
                      <td className="px-4 py-3 text-muted">{kpis.contacted}</td>
                      <td className="px-4 py-3 text-muted">{kpis.contactLogsLogged}</td>
                      <td className="px-4 py-3 text-muted">{kpis.won}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-[#12130f] p-5">
          <h3 className="font-serif text-lg">Add an employee</h3>
          <p className="mt-1 text-xs text-muted">Set their initial password here — tell them to change it after signing in.</p>
          <form action={createEmployeeAction} className="mt-4 grid gap-3">
            <input required name="name" placeholder="Full name" className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm" />
            <input required name="email" type="email" placeholder="Email" className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm" />
            <input required name="password" type="password" minLength={8} placeholder="Temporary password" className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm" />
            {error ? <p className="text-xs text-rust">Fill every field — password needs 8+ characters.</p> : null}
            <button type="submit" className="rounded-full bg-gold py-2 text-sm font-medium text-ink hover:opacity-90">
              Create account
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
