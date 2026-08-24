import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Payment received" };

export default function SuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <h1 className="font-serif text-4xl">Payment received. Month one starts when we have access.</h1>
      <p className="mt-4 text-muted">
        Check your email for the receipt. Reply with GBP, analytics, and CMS access. We will follow
        the month-1 playbook.
      </p>
      <Link href="/playbook" className="mt-8 inline-block text-gold">
        Read the playbook →
      </Link>
    </div>
  );
}
