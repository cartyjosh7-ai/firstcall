"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function RoiCalculatorPage() {
  const [jobs, setJobs] = useState(20);
  const [ticket, setTicket] = useState(850);
  const [share, setShare] = useState(30);

  const lost = useMemo(() => Math.round(jobs * ticket * (share / 100)), [jobs, ticket, share]);

  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Free tool</p>
      <h1 className="mt-3 font-serif text-4xl">Cost of staying invisible</h1>
      <p className="mt-4 text-muted">
        A back-of-the-envelope for owners. Not a forecast. If better-found competitors take a share
        of jobs you could have won, this is the monthly revenue on the table.
      </p>
      <label className="mt-8 block text-sm">
        Jobs you book per month
        <input
          type="number"
          value={jobs}
          onChange={(e) => setJobs(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
        />
      </label>
      <label className="mt-4 block text-sm">
        Average ticket ($)
        <input
          type="number"
          value={ticket}
          onChange={(e) => setTicket(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
        />
      </label>
      <label className="mt-4 block text-sm">
        Share you believe you lose to better-found rivals (%)
        <input
          type="number"
          value={share}
          onChange={(e) => setShare(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2"
        />
      </label>
      <p className="mt-8 font-serif text-5xl">${lost.toLocaleString()}</p>
      <p className="mt-2 text-sm text-muted">modeled monthly revenue on the table</p>
      <Link href="/audit" className="mt-8 inline-block text-gold">
        Get the 100-point audit →
      </Link>
    </div>
  );
}
