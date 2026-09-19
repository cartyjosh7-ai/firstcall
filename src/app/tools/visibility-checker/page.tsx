"use client";

import { useEffect, useState } from "react";
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

function StepFade({ stepKey, children }: { stepKey: string | number; children: React.ReactNode }) {
  const [in_, setIn] = useState(false);
  useEffect(() => {
    setIn(false);
    const raf = requestAnimationFrame(() => setIn(true));
    return () => cancelAnimationFrame(raf);
  }, [stepKey]);
  return (
    <div
      className="transition-all duration-300 ease-out"
      style={{ opacity: in_ ? 1 : 0, transform: in_ ? "none" : "translateY(8px)" }}
    >
      {children}
    </div>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mt-6 h-1 overflow-hidden rounded-full bg-line">
      <div
        className="h-full rounded-full bg-gold transition-[width] duration-400 ease-out"
        style={{ width: `${(step / total) * 100}%` }}
      />
    </div>
  );
}

export default function VisibilityCheckerPage() {
  const [step, setStep] = useState(0);
  const [trade, setTrade] = useState("");
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <StepFade stepKey="done">
          <p className="text-xs uppercase tracking-widest text-gold">
            <span className="ruleline">Self-assessment</span>
          </p>
          <p className="mt-4 font-serif text-6xl tabular-nums text-gold">{score}/100</p>
          <p className="mt-4 text-muted">
            This is a 60-second honesty check, not the live scan. Run the 100-point audit on your
            actual pages next.
          </p>
          <Link href="/audit" className="btn-primary mt-8">
            Get the real 100-point audit
            <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </StepFade>
      </div>
    );
  }

  if (step === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <StepFade stepKey={0}>
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
                className="whycard rounded-xl border border-line px-4 py-3 text-left"
              >
                {t}
              </button>
            ))}
          </div>
        </StepFade>
      </div>
    );
  }

  const q = questions[step - 1];
  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <StepFade stepKey={step}>
        <p className="text-xs uppercase tracking-widest text-gold">
          {trade} · {step + 1}/6
        </p>
        <ProgressBar step={step} total={questions.length} />
        <h1 className="mt-6 font-serif text-3xl">{q.q}</h1>
        <div className="mt-8 flex gap-3">
          <button
            className="btn-primary"
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
            className="btn-secondary"
            onClick={() => {
              if (step === questions.length) setDone(true);
              else setStep(step + 1);
            }}
          >
            <span className="bl-title">No / not sure</span>
          </button>
        </div>
      </StepFade>
    </div>
  );
}
