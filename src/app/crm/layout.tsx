import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: { default: "CRM", template: "%s | First Call CRM" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const employeeNav = [
  { href: "/crm", label: "Dashboard" },
  { href: "/crm/leads", label: "Leads" },
  { href: "/crm/leads/new", label: "Add a lead" },
];

const managerNav = [
  { href: "/crm", label: "Dashboard" },
  { href: "/crm/leads", label: "All leads" },
  { href: "/crm/leads/new", label: "Add a lead" },
  { href: "/crm/employees", label: "Team" },
];

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Login/setup pages render standalone, no shell/session required.
  if (!session?.user) {
    return <div className="min-h-screen">{children}</div>;
  }

  const nav = session.user.role === "manager" ? managerNav : employeeNav;

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-5 py-10">
      <aside className="w-56 shrink-0">
        <div className="sticky top-20">
          <p className="font-serif text-xl">First Call</p>
          <p className="text-xs uppercase tracking-widest text-gold">CRM</p>

          <nav className="mt-8 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm no-underline text-muted hover:bg-[#12130f] hover:text-paper"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 border-t border-line pt-4">
            <p className="text-sm">{session.user.name}</p>
            <p className="text-xs text-muted">
              {session.user.role === "manager" ? "Manager" : "Employee"} · {session.user.email}
            </p>
            <form action={logoutAction} className="mt-3">
              <button type="submit" className="text-xs text-muted underline underline-offset-4 hover:text-paper">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 pb-24">{children}</main>
    </div>
  );
}
