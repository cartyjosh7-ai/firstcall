import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { Cta } from "@/components/chrome";
import { guides } from "@/lib/content";
import { HeroPanel } from "@/components/motion/hero-panel";

type Props = { params: Promise<{ slug: string }> };

const d = (n: number) => ({ "--d": n }) as CSSProperties;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) return {};
  return { title: g.title, description: g.dek };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) notFound();

  return (
    <>
      <HeroPanel className="pb-6 pt-16">
        <div className="mx-auto max-w-3xl px-5">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
            <span className="ruleline">Guide</span>
          </p>
          <h1 className="reveal mt-3 font-serif text-5xl" style={d(1)}>
            {g.title}
          </h1>
          <p className="reveal mt-4 text-muted" style={d(2)}>
            {g.dek}
          </p>
        </div>
      </HeroPanel>

      <article className="prose-fc reveal mx-auto max-w-3xl px-5 pb-4" style={d(0)}>
        <p>
          Local buyers still use Google. They also ask maps, AI overviews, ChatGPT-class assistants,
          and voice. The firm that wins is the one named on all of those surfaces, not the one with
          the prettiest rented ads.
        </p>
        <p>
          First Call builds owned assets: Business Profile, reviews, citations, schema, citable pages,
          and a site that converts in five seconds. We report calls, jobs, and what is next. We do not
          invent case-study numbers.
        </p>
      </article>
      <Cta />
    </>
  );
}
