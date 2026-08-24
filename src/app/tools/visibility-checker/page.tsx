"use client";

import { useState } from "react";
import Link from "next/link";
import { trades } from "@/lib/content";

const questions = [
  {
    q: "When someone nearby searches your main service, are you in the Google Map Pack (the three-pack with the map)?",
    yes: 20,
  },
  {
    q: "Have you seen your business named in a Google AI Overview for a service query?",
    yes: 20,
  },
  {
    q: "Have ChatGPT, Perplexity, or Gemini recommended you when asked for a local provider in your trade?",
    yes: 20,
  },
  {
    q: "Could a voice assistant confirm your hours and offer to call you?",
    yes: 20,
  },
  {
    q: "Does your site show license/insurance, recent reviews, and a click-to-call button in the first screen on a phone?",
    yes: 20,
  },
];

export default function VisibilityCheckerPage() {
  const [step, setStep] = useState(0);
  const [trade, setTrade] = useState("");
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <p className="text-xs uppercase tracking-widest text-gold">Self-assessment</p>
        <p className="mt-4 font-serif text-6xl">{score}/100</p>
        <p className="mt-4 text-muted">
          This is a 60-second honesty check, not the live scan. Run the 100-point audit on your
          actual pages next.
        </p>
        <Link
          href="/audit"
          className="mt-8 inline-block rounded-full bg-gold px-5 py-3 text-ink no-underline"
        >
          Get the real 100-point audit
        </Link>
      </div>
    );
  }

  if (step === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <p className="text-xs uppercase tracking-widest text-gold">Free tool · 1/6</p>
        <h1 className="mt-3 font-serif text-4xl">How findable are you in the AI era?</h1>
        <p className="mt-4 text-muted">Sixty seconds, five surfaces. Pick your trade to start.</p>
        <div className="mt-8 grid gap-2">
          {trades.filter((t) => t !== "Other").map((t) => (
            <button
              key={t}
              onClick={() => {
                setTrade(t);
                setStep(1);
              }}
              className="rounded-xl border border-line px-4 py-3 text-left hover:border-gold"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const q = questions[step - 1];
  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">
        {trade} · {step + 1}/6
      </p>
      <h1 className="mt-3 font-serif text-3xl">{q.q}</h1>
      <div className="mt-8 flex gap-3">
        <button
          className="rounded-full bg-gold px-6 py-3 text-ink"
          onClick={() => {
            const next = score + q.yes;
            if (step === questions.length) {
              setScore(next);
              setDone(true);
            } else {
              setScore(next);
              setStep(step + 1);
            }
          }}
        >
          Yes
        </button>
        <button
          className="rounded-full border border-line px-6 py-3"
          onClick={() => {
            if (step === questions.length) setDone(true);
            else setStep(step + 1);
          }}
        >
          No / not sure
        </button>
      </div>
    </div>
  );
}
