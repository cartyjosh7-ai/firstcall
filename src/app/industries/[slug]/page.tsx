import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { Cta } from "@/components/chrome";
import { industries } from "@/lib/content";
import { HeroPanel } from "@/components/motion/hero-panel";

type Props = { params: Promise<{ slug: string }> };

const d = (n: number) => ({ "--d": n }) as CSSProperties;

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) return {};
  return { title: `${ind.name} marketing & local SEO` };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) notFound();

  return (
    <>
      <HeroPanel className="pb-6 pt-16">
        <div className="mx-auto max-w-3xl px-5">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
            <span className="ruleline">Trade / {ind.name}</span>
          </p>
          <h1 className="reveal mt-3 font-serif text-5xl" style={d(1)}>
            {ind.headline}
          </h1>
          <p className="reveal mt-4 text-muted" style={d(2)}>
            {ind.intent}
          </p>
        </div>
      </HeroPanel>

      <div className="mx-auto max-w-3xl px-5 pb-4">
        <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
          <span className="ruleline">Where the calls leak out</span>
        </p>
        <ol className="mt-6 space-y-3">
          {ind.leaks.map((l, i) => (
            <li key={l} className="reveal flex gap-4 text-muted" style={d(i + 1)}>
              <span className="font-mono text-gold">0{i + 1}</span>
              {l}
            </li>
          ))}
        </ol>

        <p className="reveal mt-16 text-xs uppercase tracking-widest text-gold" style={d(0)}>
          <span className="ruleline">How we make you the first call</span>
        </p>
        <div className="mt-8 space-y-6">
          {ind.plan.map((p, i) => (
            <div key={p.title} className="whycard reveal border-t border-line pt-4" style={d(i + 1)}>
              <h3 className="font-serif text-2xl">{p.title}</h3>
              <p className="mt-2 text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
      <Cta title={`Be the first call in ${ind.name.toLowerCase()}.`} />
    </>
  );
}
