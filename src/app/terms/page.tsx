import type { Metadata } from "next";
import Link from "next/link";
import { foundation, site } from "@/lib/content";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <article className="prose-fc mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Legal</p>
      <h1 className="font-serif text-5xl text-paper">Terms of Service</h1>
      <p className="text-sm text-muted">Last updated August 22, 2026.</p>
      <h2>Who we are</h2>
      <p>
        These terms govern use of {site.url} and the free audit tools. Paid work is governed by the{" "}
        <Link href="/legal/msa">Master Services Agreement</Link> and the applicable{" "}
        <Link href="/legal/sow">Statement of Work</Link>. The legal name on invoices must match the
        Stripe account and your formation documents ({site.legalName} until you set LEGAL_ENTITY_NAME).
      </p>
      <h2>The free audit</h2>
      <p>
        The 100-point scan fetches public pages you submit. It is not a ranking, traffic, or revenue
        estimate. Scores can be wrong if the site blocks our fetch. We may email you about the result
        if you give us an address. No obligation to buy.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not submit URLs you are not allowed to have us fetch, probe our APIs, or use the tools to
        harm others. We may refuse or rate-limit scans.
      </p>
      <h2>Foundation</h2>
      <p>
        Foundation is {foundation.priceLabel}, billed monthly in advance, month-to-month, with 30
        days&apos; written notice to cancel. Local SEO is not guaranteed placement. We report honestly
        and do not fabricate results.
      </p>
      <h2>Liability</h2>
      <p>
        The website and free tools are provided as-is. For paid work, liability is limited as stated
        in the MSA. We are not liable for lost profits from search-engine or AI-platform changes we
        do not control.
      </p>
      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of Alberta, Canada. {site.legalName} is based in
        Calgary, Alberta.
      </p>
      <h2>Contact</h2>
      <p>
        <a href={`mailto:${site.email}`}>{site.email}</a>, {site.mailingAddress}
      </p>
    </article>
  );
}
