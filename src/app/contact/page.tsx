import type { Metadata } from "next";
import { ContactForm } from "@/components/forms";
import { site } from "@/lib/content";
import { Cta } from "@/components/chrome";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Contact</p>
      <h1 className="mt-3 font-serif text-5xl">Let&apos;s make you the first call.</h1>
      <p className="mt-4 text-muted">
        Tell us about your business and market. A senior strategist will get back to you within one
        business day.
      </p>
      <div className="mt-8 rounded-2xl border border-line p-6 text-sm">
        <p className="text-xs uppercase tracking-widest text-muted">Direct line</p>
        <p className="mt-2 font-serif text-2xl">
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
        <p className="mt-2 text-muted">
          Forms land in the same inbox. No queue, no junior hand-off.
        </p>
      </div>
      <div className="mt-10">
        <ContactForm />
      </div>
      <Cta />
    </div>
  );
}
