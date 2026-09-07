import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listLeads } from "@/lib/db/queries";
import type { Lead } from "@/lib/db/schema";
import { StatusPill, SourceTag } from "../status-pill";
import { runOutreachBatchAction } from "../actions";

export const metadata: Metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

const STATUSES: Lead["status"][] = ["cold", "warm", "hot", "won", "lost"];
const SOURCES: Lead["source"][] = ["scraper", "website", "employee", "manager"];

export default async function CrmLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; source?: string; outreachSent?: string; outreachSkipped?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/crm/login");

  const { status, source, outreachSent, outreachSkipped } = await searchParams;
  const isManager = session.user.role === "manager";

  const leads = await listLeads({
    status: STATUSES.includes(status as Lead["status"]) ? (status as Lead["status"]) : undefined,
    source: SOURCES.includes(source as Lead["source"]) ? (source as Lead["source"]) : undefined,
    assignedTo: isManager ? undefined : session.user.id,
  });

  function filterHref(next: { status?: string; source?: string }) {
    const params = new URLSearchParams();
    const s = next.status ?? status;
    const src = next.source ?? source;
    if (s) params.set("status", s);
    if (src) params.set("source", src);
    const qs = params.toString();
    return qs ? `/crm/leads?${qs}` : "/crm/leads";
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">{isManager ? "Every lead" : "Your leads"}</p>
          <h1 className="mt-2 font-serif text-3xl">Leads</h1>
        </div>
        <Link href="/crm/leads/new" className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-ink no-underline hover:opacity-90">
          + Add a lead
        </Link>
      </div>

      {isManager ? (
        <div className="mt-6 rounded-2xl border border-line bg-[#12130f] p-5">
          <h2 className="font-serif text-lg">Send outreach</h2>
          <p className="mt-1 text-xs text-muted">
            Drafts a CASL-compliant email for each cold lead and sends it via Resend. Each lead is sent to at most once —
            a send flips it to <b>hot</b>.
          </p>
          {outreachSent != null ? (
            <p className="mt-3 text-sm text-gold">
              Sent {outreachSent}, skipped {outreachSkipped ?? 0}.
            </p>
          ) : null}
          <form action={runOutreachBatchAction} className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              Send outreach to next
              <input
                type="number"
                name="count"
                defaultValue={10}
                min={1}
                max={25}
                className="w-16 rounded-lg border border-line bg-ink px-2 py-1 text-sm"
              />
              cold leads
            </label>
            <button type="submit" className="rounded-full bg-gold px-4 py-1.5 text-sm font-medium text-ink hover:opacity-90">
              Send
            </button>
          </form>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip href={filterHref({ status: undefined })} active={!status}>
          All statuses
        </FilterChip>
        {STATUSES.map((s) => (
          <FilterChip key={s} href={filterHref({ status: s })} active={status === s}>
            {s}
          </FilterChip>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <FilterChip href={filterHref({ source: undefined })} active={!source}>
          All sources
        </FilterChip>
        {SOURCES.map((s) => (
          <FilterChip key={s} href={filterHref({ source: s })} active={source === s}>
            {s}
          </FilterChip>
        ))}
      </div>

      {leads.length === 0 ? (
        <p className="mt-10 text-sm text-muted">No leads match this filter yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-[#12130f] text-left text-xs uppercase tracking-widest text-muted">
                <th className="px-4 py-3 font-normal">Business</th>
                <th className="px-4 py-3 font-normal">Trade</th>
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
                  <td className="px-4 py-3 text-muted">{l.trade || "—"}</td>
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
    </div>
  );
}

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-xs capitalize no-underline ${
        active ? "border-gold bg-gold text-ink" : "border-line text-muted hover:text-paper"
      }`}
    >
      {children}
    </Link>
  );
}
