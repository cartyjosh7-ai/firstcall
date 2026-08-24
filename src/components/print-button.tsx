"use client";

export function PrintButton({ label = "Print / save as PDF" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden rounded-full border border-line px-5 py-2.5 text-sm no-underline hover:border-gold"
    >
      {label}
    </button>
  );
}
