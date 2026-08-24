"use client";

import { useState } from "react";
import Link from "next/link";
import { foundation } from "@/lib/content";

export default function StartPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallback, setFallback] = useState<string | null>(null);

  async function startCheckout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.invoice) {
        setFallback(data.invoice);
        return;
      }
      throw new Error(data.error || "Checkout is not configured yet.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Start Foundation</p>
      <h1 className="mt-3 font-serif text-4xl">Pay {foundation.priceLabel} and we start month one.</h1>
      <p className="mt-4 text-muted">
        Month-to-month. 30 days&apos; notice to cancel. By paying you agree to the{" "}
        <Link href="/legal/msa">MSA</Link> and <Link href="/legal/sow">Foundation SOW</Link>.
      </p>
      <button
        onClick={startCheckout}
        disabled={busy}
        className="mt-8 w-full rounded-full bg-gold py-3 font-medium text-ink disabled:opacity-60"
      >
        {busy ? "Redirecting…" : "Continue to payment"}
      </button>
      {error ? <p className="mt-4 text-sm text-rust">{error}</p> : null}
      {fallback ? <p className="mt-4 text-sm text-muted">{fallback}</p> : null}
      <p className="mt-6 text-sm text-muted">
        No Stripe keys in this environment? Request an invoice from{" "}
        <Link href="/pricing">the pricing page</Link>.
      </p>
    </div>
  );
}
