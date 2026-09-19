import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";

export const metadata: Metadata = { title: "Payment received" };

const d = (n: number) => ({ "--d": n }) as CSSProperties;

export default function SuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <div className="reveal mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold" style={d(0)}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0c0d0b" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h1 className="reveal mt-6 font-serif text-4xl" style={d(1)}>
        Payment received. Month one starts when we have access.
      </h1>
      <p className="reveal mt-4 text-muted" style={d(2)}>
        Check your email for the receipt. Reply with GBP, analytics, and CMS access. We will follow
        the month-1 playbook.
      </p>
      <Link href="/playbook" className="linkarrow reveal mt-8 justify-center text-lg" style={d(3)}>
        Read the playbook
        <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}
