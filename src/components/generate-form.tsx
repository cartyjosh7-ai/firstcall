"use client";

import { useEffect, useState } from "react";
import { trades } from "@/lib/content";

const SECRET_KEY = "fc_admin_secret";

export function GenerateForm() {
  const [secret, setSecret] = useState("");
  const [business, setBusiness] = useState("");
  const [website, setWebsite] = useState("");
  const [trade, setTrade] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; mock: boolean } | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SECRET_KEY);
      if (saved) setSecret(saved);
    } catch {
      /* localStorage unavailable — fine, just skip persistence */
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      try {
        window.localStorage.setItem(SECRET_KEY, secret);
      } catch {
        /* ignore */
      }
      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(secret ? { "x-admin-secret": secret } : {}),
        },
        body: JSON.stringify({ business, website, trade, location, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      setResult({ id: data.id, mock: data.mock });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl border border-line bg-[#12130f] p-6">
        <label className="text-sm">
          Admin secret (matches ADMIN_API_SECRET, leave blank if unset locally)
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
          />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
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
              placeholder="theirbusiness.com"
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
              <option value="">Select</option>
              {trades.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Location (city, province)
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Calgary, AB"
              className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
            />
          </label>
          <label className="text-sm md:col-span-2">
            Their email (optional — used only if you later email them a report)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
            />
          </label>
        </div>
        <button
          disabled={busy}
          className="rounded-full bg-gold py-3 font-medium text-ink disabled:opacity-60"
        >
          {busy ? "Generating…" : "Generate research + proposal"}
        </button>
        <p className="text-xs text-muted">
          Runs the real audit live. Uses the Claude agents if ANTHROPIC_API_KEY is set, otherwise the
          free rule-based engine — either way, nothing here costs more than a few seconds.
        </p>
      </form>

      {error ? <p className="mt-4 text-rust">{error}</p> : null}

      {result ? (
        <div className="mt-6 rounded-2xl border border-line p-6">
          <p className="text-sm text-muted">
            {result.mock ? "Built with the free rule-based engine." : "Built with the real Claude agents."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`/reports/${result.id}`}
              className="rounded-full border border-line px-5 py-2.5 text-sm no-underline hover:border-gold"
            >
              View research brief
            </a>
            <a
              href={`/reports/${result.id}/proposal`}
              className="rounded-full bg-gold px-5 py-2.5 text-sm text-ink no-underline hover:opacity-90"
            >
              View & print proposal
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
