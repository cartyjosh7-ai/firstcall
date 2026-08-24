import type { Metadata } from "next";
import { Cta } from "@/components/chrome";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Who we are</p>
      <h1 className="mt-3 font-serif text-5xl">The seasoned navigator for how customers search now.</h1>
      <p className="mt-4 text-muted">
        First Call is a standalone firm built for one job: making owner-led local and home-service
        businesses the most visible, most trusted, most chosen name in their market.
      </p>
      <p className="mt-6 text-muted">
        You built a great business the hard way. Then the ground moved. Customers started asking an
        assistant, glancing at a map, speaking into a phone, and deciding in seconds. First Call
        exists for this moment.
      </p>
      <h2 className="mt-12 font-serif text-3xl">Six values, no exceptions</h2>
      <ol className="mt-6 space-y-4 text-muted">
        <li>01 Evidence over opinion — if we cannot measure it, we do not claim it.</li>
        <li>02 Own the outcome — senior strategists, end to end.</li>
        <li>03 Built to be chosen — reviews, citations, structured authority.</li>
        <li>04 Clarity beats cleverness — the plan in your words.</li>
        <li>05 Compound, do not chase — owned assets, not rented traffic.</li>
        <li>06 Tell the truth — honest timelines, no fabricated numbers.</li>
      </ol>
      <Cta title="Work with senior people who own the result." />
    </div>
  );
}
