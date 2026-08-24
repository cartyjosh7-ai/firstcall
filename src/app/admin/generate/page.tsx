import type { Metadata } from "next";
import { GenerateForm } from "@/components/generate-form";

export const metadata: Metadata = {
  title: "Generate a proposal",
  robots: { index: false, follow: false },
};

export default function AdminGeneratePage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Internal tool</p>
      <h1 className="mt-3 font-serif text-4xl">Generate a research brief & proposal</h1>
      <p className="mt-4 text-muted">
        For a real prospect you're talking to right now. Runs the live audit against their site, then
        builds a research brief and a client-ready proposal you can print or screenshot on the spot.
      </p>
      <div className="mt-10">
        <GenerateForm />
      </div>
    </div>
  );
}
