import type { Metadata } from "next";
import { Cta } from "@/components/chrome";

export const metadata: Metadata = { title: "Markets" };

export default function MarketsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Coverage</p>
      <h1 className="mt-3 font-serif text-5xl">Local and home-service businesses across the US.</h1>
      <p className="mt-4 text-muted">
        Foundation is built for a single location and a defined service area. We do not publish a
        national visibility index with invented scores. If you want a read on your market, run the
        audit.
      </p>
      <Cta />
    </div>
  );
}
