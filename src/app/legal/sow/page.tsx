import type { Metadata } from "next";
import { salesPackages, site, type PackageId } from "@/lib/content";

export const metadata: Metadata = { title: "Statement of Work" };

function isPackageId(value: string | undefined): value is PackageId {
  return value != null && value in salesPackages;
}

export default async function SowPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const { package: pkgParam } = await searchParams;
  const pkgId: PackageId = isPackageId(pkgParam) ? pkgParam : "foundation";
  const pkg = salesPackages[pkgId];

  return (
    <article className="prose-fc mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Contract</p>
      <h1 className="font-serif text-5xl text-paper">{pkg.name} Statement of Work</h1>
      <p>
        This SOW is issued under the <a href="/legal/msa">MSA</a>. Offer: {pkg.name} —{" "}
        {pkg.priceOneTimeLabel}
        {pkg.priceMonthlyLabel ? `, then ${pkg.priceMonthlyLabel}` : ""}.
      </p>
      <h2>Scope — included</h2>
      <ul>
        {pkg.included.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      <h2>Scope — excluded</h2>
      <ul>
        {pkg.notIncluded.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      {pkgId === "foundation" ? (
        <>
          <h2>30 / 60 / 90 days</h2>
          <ul>
            <li>
              Days 1–30: access, GBP baseline, category decision, citation audit, review system live,
              technical/on-page and LocalBusiness schema, first content piece, reporting template with
              baseline calls/jobs (even if zero).
            </li>
            <li>
              Days 31–60: review velocity, remaining citations, service/location page architecture,
              profile posts/Q&A, iterate from the first report.
            </li>
            <li>
              Days 61–90: local wins window (typical), deepen content, confirm tracking, recommend stay
              on Foundation or talk Growth.
            </li>
          </ul>
        </>
      ) : (
        <>
          <h2>Kickoff</h2>
          <p>
            Timeline and milestones for {pkg.name} are confirmed with your strategist at kickoff, based
            on the scope above.
          </p>
        </>
      )}
      <h2>Reporting</h2>
      <p>
        Monthly, in plain English: more visible? more calls? what&apos;s next? We will not invent
        client case-study numbers.
      </p>
      <h2>Commercials</h2>
      <p>
        {pkg.priceOneTimeLabel}
        {pkg.priceMonthlyLabel ? ` setup fee, then ${pkg.priceMonthlyLabel}` : ""}. {pkg.cadence} Payment
        via Stripe or invoice to {site.email}. Work starts after the first payment clears and access is
        granted.
      </p>
    </article>
  );
}
