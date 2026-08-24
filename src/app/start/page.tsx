"use client";

import { useState } from "react";
import Link from "next/link";
import { foundation, trades } from "@/lib/content";

export default function StartPage() {
  const [business, setBusiness] = useState("");
  const [website, setWebsite] = useState("");
  const [trade, setTrade] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallback, setFallback] = useState<string | null>(null);

  async function startCheckout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ business, website, trade, email }),
      });
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

  const ready = business.trim() && website.trim() && trade && email.trim();

  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Start Foundation</p>
      <h1 className="mt-3 font-serif text-4xl">
        Pay {foundation.priceOneTimeLabel} today, then {foundation.priceMonthlyLabel}, and we start
        month one.
      </h1>
      <p className="mt-4 text-muted">
        One-time setup, then month-to-month. 30 days&apos; notice to cancel the retainer. By paying you
        agree to the{" "}
        <Link href="/legal/msa">MSA</Link> and <Link href="/legal/sow">Foundation SOW</Link>.
      </p>

      <div className="mt-8 grid gap-3 rounded-2xl border border-line bg-[#12130f] p-6">
        <p className="text-sm text-muted">
          A few details so we can build your first research brief and 90-day plan the moment payment
          clears.
        </p>
        <label className="text-sm">
          Business name
          <input
            required
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Website
          <input
            required
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="yourbusiness.com"
            className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Trade
          <select
            required
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
          >
            <option value="">Select your trade</option>
            {trades.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
          />
        </label>
      </div>

      <button
        onClick={startCheckout}
        disabled={busy || !ready}
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
