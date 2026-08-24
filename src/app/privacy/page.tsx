import type { Metadata } from "next";
import { site } from "@/lib/content";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <article className="prose-fc mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Legal</p>
      <h1 className="font-serif text-5xl text-paper">Privacy Policy</h1>
      <p className="text-sm text-muted">Last updated August 22, 2026. Controller: {site.legalName}.</p>
      <h2>What we collect</h2>
      <p>
        When you request an audit, contact us, or start Foundation, we collect the details you
        provide: name, business name, email, phone, website, trade, and message. The live audit
        fetches public pages you point us at. We also collect standard analytics about how this site
        is used (pages viewed, referrer, approximate location from IP at the network layer).
      </p>
      <h2>How we use it</h2>
      <p>
        We use your information to run the scan, email you the result, follow up within one business
        day, send contracts and invoices, process payment via Stripe if you start Foundation, and
        deliver the engagement. We do not sell or rent your data.
      </p>
      <h2>Processors</h2>
      <p>
        Hosting (typically Vercel), email (Resend when configured), payment (Stripe), and the
        ordinary infrastructure needed to run the site. Stripe processes card data; we do not store
        full card numbers.
      </p>
      <h2>How long we keep it</h2>
      <p>
        Lead records and audit scores are kept while we might work together and for a reasonable
        period afterward for accounting and dispute handling (typically up to seven years for
        invoices). You can ask us to delete marketing records earlier.
      </p>
      <h2>Your choices (PIPEDA)</h2>
      <p>
        {site.legalName} is based in Alberta, Canada, and handles personal information under the
        Personal Information Protection and Electronic Documents Act (PIPEDA): we collect only what
        we need, use it only for the purposes stated here, and protect it with reasonable
        safeguards. Email {site.email} to access, correct, or delete your information, or to opt out
        of communications. Every marketing email we send includes a one-click unsubscribe link,
        actioned immediately.
      </p>
      <h2>Email & CASL</h2>
      <p>
        Commercial emails from us comply with Canada's Anti-Spam Legislation (CASL): we identify the
        sender, include our mailing address, and provide a working unsubscribe in every message. We
        do not buy, sell, or scrape email lists, and we do not send commercial email without your
        consent or an existing business relationship (e.g. you requested an audit or contacted us).
      </p>
      <h2>Contact</h2>
      <p>
        Privacy questions: <a href={`mailto:${site.email}`}>{site.email}</a>, {site.mailingAddress}.
        This policy describes our current practice. Have counsel review it against your actual
        entity, hosting, and analytics stack before you treat it as final legal advice.
      </p>
    </article>
  );
}
