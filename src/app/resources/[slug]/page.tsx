import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cta } from "@/components/chrome";
import { guides } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

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
    <article className="prose-fc mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Guide</p>
      <h1 className="font-serif text-5xl text-paper">{g.title}</h1>
      <p>{g.dek}</p>
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
      <Cta />
    </article>
  );
}
