"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";

const d = (n: number) => ({ "--d": n }) as CSSProperties;

export default function RoiCalculatorPage() {
  const [jobs, setJobs] = useState(20);
  const [ticket, setTicket] = useState(850);
  const [share, setShare] = useState(30);
  const [pulse, setPulse] = useState(false);
  const first = useRef(true);

  const lost = useMemo(() => Math.round(jobs * ticket * (share / 100)), [jobs, ticket, share]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 260);
    return () => clearTimeout(t);
  }, [lost]);

  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
        <span className="ruleline">Free tool</span>
      </p>
      <h1 className="reveal mt-3 font-serif text-4xl" style={d(1)}>
        Cost of staying invisible
      </h1>
      <p className="reveal mt-4 text-muted" style={d(2)}>
        A back-of-the-envelope for owners. Not a forecast. If better-found competitors take a share
        of jobs you could have won, this is the monthly revenue on the table.
      </p>
      <div className="panel reveal mt-8 rounded-2xl border border-line bg-[#12130f] p-6" style={d(3)}>
        <label className="block text-sm">
          Jobs you book per month
          <input
            type="number"
            value={jobs}
            onChange={(e) => setJobs(Number(e.target.value))}
            className="field-input mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
          />
        </label>
        <label className="mt-4 block text-sm">
          Average ticket ($)
          <input
            type="number"
            value={ticket}
            onChange={(e) => setTicket(Number(e.target.value))}
            className="field-input mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
          />
        </label>
        <label className="mt-4 block text-sm">
          Share you believe you lose to better-found rivals (%)
          <input
            type="number"
            value={share}
            onChange={(e) => setShare(Number(e.target.value))}
            className="field-input mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
          />
        </label>
      </div>
      <p
        className="mt-8 font-serif text-6xl tabular-nums text-gold transition-transform duration-200 ease-out"
        style={{ transform: pulse ? "scale(1.04)" : "scale(1)" }}
      >
        ${lost.toLocaleString()}
      </p>
      <p className="mt-2 text-sm text-muted">modeled monthly revenue on the table</p>
      <Link href="/audit" className="linkarrow mt-8" >
        Get the 100-point audit
        <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}
