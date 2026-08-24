import type { Metadata } from "next";
import { foundation, site } from "@/lib/content";

export const metadata: Metadata = { title: "Master Services Agreement" };

export default function MsaPage() {
  return (
    <article className="prose-fc mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Contract</p>
      <h1 className="font-serif text-5xl text-paper">Master Services Agreement</h1>
      <p className="text-sm text-muted">
        Short-form MSA for Foundation. Have counsel review. Print or PDF from the browser.
      </p>
      <h2>1. Parties</h2>
      <p>
        This agreement is between {site.legalName} (&quot;First Call,&quot; &quot;we&quot;) and the
        client named on the Statement of Work or Stripe checkout (&quot;you&quot;).
      </p>
      <h2>2. Services</h2>
      <p>
        We provide the services described in each SOW. The current productized offer is Foundation
        ({foundation.priceOneTimeLabel} setup, then {foundation.priceMonthlyLabel}). Work is performed
        by a senior strategist. We do not guarantee map pack rank, call volume, or revenue.
      </p>
      <h2>3. Term and cancellation</h2>
      <p>
        Month-to-month. Either party may cancel with 30 days&apos; written notice to {site.email}.
        Fees already paid for the then-current month are not refunded except where required by law.
        There is no annual lock-in.
      </p>
      <h2>4. Fees and payment</h2>
      <p>
        The one-time setup fee is due before work begins. The monthly retainer is billed in advance via
        Stripe Checkout or invoice. Late amounts may pause work. You are responsible for applicable
        taxes.
      </p>
      <h2>5. Ownership</h2>
      <p>
        Assets we create for you (profile copy, on-page content, schema, reports) are yours. Our
        playbooks, scoring model, and unlicensed tools remain ours. Third-party platforms (Google,
        review sites, AI engines) remain under their terms.
      </p>
      <h2>6. Your responsibilities</h2>
      <p>
        Timely access to Business Profile, analytics, DNS, CMS, and a point of contact. Honest
        information. No review gating or fake reviews.
      </p>
      <h2>7. Confidentiality and data</h2>
      <p>Each party keeps the other&apos;s non-public information confidential. Privacy: /privacy.</p>
      <h2>8. Limitation of liability</h2>
      <p>
        Except for fraud, willful misconduct, or amounts that cannot be limited by law, each party&apos;s
        total liability under this MSA is limited to the fees you paid in the three months before the
        claim. Neither party is liable for indirect or lost-profit damages.
      </p>
      <h2>9. Independent contractor</h2>
      <p>We are not your employee. We may use subcontractors we supervise.</p>
      <h2>10. Law</h2>
      <p>
        Governing law and venue: the state of your principal place of business unless we agree
        otherwise in the SOW. This is not legal advice.
      </p>
      <p>
        Paying Foundation or signing the SOW constitutes acceptance of this MSA.
      </p>
    </article>
  );
}
