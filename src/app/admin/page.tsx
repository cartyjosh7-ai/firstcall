import type { Metadata } from "next";
import Link from "next/link";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { guides, industries, services, site } from "@/lib/content";
import type { EngineReport } from "@/lib/agents/types";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function listReports(): Promise<EngineReport[]> {
  const dir = path.join(process.cwd(), "data", "reports");
  try {
    const files = await readdir(dir);
    const reports = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => JSON.parse(await readFile(path.join(dir, f), "utf8")) as EngineReport),
    );
    return reports.sort((a, b) => (a.generatedAt < b.generatedAt ? 1 : -1));
  } catch {
    return [];
  }
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function CardLink({
  href,
  title,
  meta,
  external,
}: {
  href: string;
  title: string;
  meta?: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className="flex items-center justify-between gap-3 rounded-xl border border-line bg-[#12130f] px-4 py-3 no-underline transition hover:border-gold"
    >
      <span className="text-sm">{title}</span>
      {meta ? <span className="shrink-0 text-xs text-muted">{meta}</span> : null}
    </Link>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export default async function AdminDashboardPage() {
  const reports = await listReports();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Internal — not indexed</p>
      <h1 className="mt-3 font-serif text-4xl">{site.name} dashboard</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Every tool and page built so far, in one place. Bookmark this — everything below is one click
        away.
      </p>

      <Section title="Prospect tools" description="Run these live, on the spot, with a real business.">
        <Grid>
          <CardLink href="/admin/generate" title="Generate research brief + proposal" meta="Live agent run" />
          <CardLink href="/audit" title="Free 100-point visibility audit" meta="Public lead magnet" />
          <CardLink href="/tools/roi-calculator" title="ROI calculator" meta="Public tool" />
          <CardLink href="/tools/visibility-checker" title="Visibility checker" meta="Public tool" />
        </Grid>
      </Section>

      <Section
        title="Generated reports"
        description={
          reports.length
            ? `${reports.length} research brief${reports.length === 1 ? "" : "s"} generated so far.`
            : "None generated yet — use the tool above."
        }
      >
        {reports.length ? (
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-[#12130f] text-left text-xs uppercase tracking-widest text-muted">
                  <th className="px-4 py-3 font-normal">Business</th>
                  <th className="px-4 py-3 font-normal">Trade</th>
                  <th className="px-4 py-3 font-normal">Location</th>
                  <th className="px-4 py-3 font-normal">Generated</th>
                  <th className="px-4 py-3 font-normal">Engine</th>
                  <th className="px-4 py-3 font-normal">Links</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-line/60 last:border-0">
                    <td className="px-4 py-3">{r.input.business}</td>
                    <td className="px-4 py-3 text-muted">{r.input.trade}</td>
                    <td className="px-4 py-3 text-muted">{r.input.location || "—"}</td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(r.generatedAt).toLocaleDateString("en-CA")}
                    </td>
                    <td className="px-4 py-3 text-muted">{r.mock ? "Free / rule-based" : "Claude agents"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link href={`/reports/${r.id}`} className="text-gold no-underline hover:underline">
                          Brief
                        </Link>
                        <Link
                          href={`/reports/${r.id}/proposal`}
                          className="text-gold no-underline hover:underline"
                        >
                          Proposal
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Section>

      <Section title="Site pages">
        <Grid>
          <CardLink href="/" title="Home" />
          <CardLink href="/pricing" title="Pricing" />
          <CardLink href="/start" title="Start Foundation (checkout)" />
          <CardLink href="/playbook" title="Month-1 playbook" />
          <CardLink href="/results" title="Results" />
          <CardLink href="/markets" title="Markets" />
          <CardLink href="/about" title="About" />
          <CardLink href="/contact" title="Contact" />
          <CardLink href="/resources" title="Resources hub" />
        </Grid>
      </Section>

      <Section title="Industry pages" description={`${industries.length} trades covered.`}>
        <Grid>
          {industries.map((i) => (
            <CardLink key={i.slug} href={`/industries/${i.slug}`} title={i.name} />
          ))}
        </Grid>
      </Section>

      <Section title="Service pages" description={`${services.length} services covered.`}>
        <Grid>
          {services.map((s) => (
            <CardLink key={s.slug} href={`/services/${s.slug}`} title={s.name} />
          ))}
        </Grid>
      </Section>

      <Section title="Guides" description={`${guides.length} published.`}>
        <Grid>
          {guides.map((g) => (
            <CardLink key={g.slug} href={`/resources/${g.slug}`} title={g.title} />
          ))}
        </Grid>
      </Section>

      <Section title="Legal & compliance">
        <Grid>
          <CardLink href="/privacy" title="Privacy policy" />
          <CardLink href="/terms" title="Terms" />
          <CardLink href="/legal/msa" title="Master services agreement" />
          <CardLink href="/legal/sow" title="Foundation statement of work" />
        </Grid>
      </Section>
    </div>
  );
}
