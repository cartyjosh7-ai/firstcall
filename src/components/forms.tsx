"use client";

import { useState } from "react";
import type { AuditResult } from "@/lib/audit";
import { trades } from "@/lib/content";

export function AuditForm() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, email, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setResult(data as AuditResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl border border-line bg-[#12130f] p-6 md:grid-cols-2">
        <label className="md:col-span-2 text-sm">
          Website
          <input
            required
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourbusiness.com"
            className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Your name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Email (so we can send the follow-up)
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
          />
        </label>
        <button
          disabled={busy}
          className="md:col-span-2 rounded-full bg-gold py-3 font-medium text-ink disabled:opacity-60"
        >
          {busy ? "Scanning…" : "Run my audit"}
        </button>
        <p className="md:col-span-2 text-xs text-muted">
          Free, instant, and yours to keep. We read only your public pages. A strategist follows up
          within one business day.
        </p>
      </form>
      {error ? <p className="mt-4 text-rust">{error}</p> : null}
      {result ? <AuditReport result={result} /> : null}
    </div>
  );
}

function AuditReport({ result }: { result: AuditResult }) {
  return (
    <div className="mt-10 rounded-2xl border border-line p-6">
      {result.error ? (
        <p className="text-muted">{result.error}</p>
      ) : (
        <>
          <p className="text-xs uppercase tracking-widest text-gold">Live scan</p>
          <p className="mt-2 font-serif text-5xl">
            {result.score}
            <span className="text-2xl text-muted">/{result.max}</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            {result.url} · {result.pagesRead} page{result.pagesRead === 1 ? "" : "s"} read
          </p>
          <ul className="mt-6 space-y-3">
            {result.categories.map((c) => (
              <li key={c.id}>
                <div className="flex justify-between text-sm">
                  <span>{c.name}</span>
                  <span>
                    {c.score}/{c.max}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full bg-gold"
                    style={{ width: `${(c.score / c.max) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <h3 className="mt-8 font-serif text-xl">Gaps named</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {result.checks
              .filter((c) => !c.passed)
              .map((c) => (
                <li key={c.id} className="text-muted">
                  <span className="text-paper">{c.label}.</span> {c.detail}
                </li>
              ))}
          </ul>
          {result.checks.every((c) => c.passed) ? (
            <p className="mt-3 text-sm text-muted">The public pages passed the automated checks.</p>
          ) : null}
          <p className="mt-6 text-sm text-muted">{result.followUp}</p>
          <p className="mt-4 text-sm">
            Next: <a href="/start">start Foundation</a> or <a href="/contact">talk to a strategist</a>.
          </p>
        </>
      )}
    </div>
  );
}

export function ContactForm({ kind = "contact" }: { kind?: "contact" | "proposal" }) {
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("busy");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, kind }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send");
      setStatus("ok");
      setMessage(
        "Received. A senior strategist will reply within one business day with a clear next step.",
      );
      e.currentTarget.reset();
    } catch (err) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Could not send");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
      <label className="text-sm">
        Your name
        <input name="name" required className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2" />
      </label>
      <label className="text-sm">
        Business name
        <input name="business" className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2" />
      </label>
      <label className="text-sm">
        Email
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
        />
      </label>
      <label className="text-sm">
        Phone
        <input name="phone" className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2" />
      </label>
      <label className="text-sm">
        Website
        <input name="website" className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2" />
      </label>
      <label className="text-sm">
        Trade
        <select name="trade" className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2">
          <option value="">Select your trade</option>
          {trades.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="md:col-span-2 text-sm">
        How can we help? (optional)
        <textarea name="message" rows={4} className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2" />
      </label>
      <button
        disabled={status === "busy"}
        className="md:col-span-2 rounded-full bg-gold py-3 font-medium text-ink disabled:opacity-60"
      >
        {status === "busy" ? "Sending…" : kind === "proposal" ? "Request Foundation" : "Send message"}
      </button>
      {message ? <p className="md:col-span-2 text-sm text-muted">{message}</p> : null}
      <p className="md:col-span-2 text-xs text-muted">
        By submitting you agree to be contacted about your audit or engagement. We never sell your
        data. See <a href="/privacy">Privacy</a> and <a href="/terms">Terms</a>.
      </p>
    </form>
  );
}
