import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/content";

export const metadata: Metadata = { title: "Resources" };

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Guides</p>
      <h1 className="mt-3 font-serif text-5xl">Plain English on local SEO, AEO, GEO, and voice.</h1>
      <ul className="mt-10 space-y-6">
        {guides.map((g) => (
          <li key={g.slug} className="border-t border-line pt-6">
            <Link href={`/resources/${g.slug}`} className="font-serif text-2xl no-underline">
              {g.title}
            </Link>
            <p className="mt-2 text-muted">{g.dek}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
