import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cta } from "@/components/chrome";
import { industries } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

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
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Trade / {ind.name}</p>
      <h1 className="mt-3 font-serif text-5xl">{ind.headline}</h1>
      <p className="mt-4 text-muted">{ind.intent}</p>
      <h2 className="mt-12 font-serif text-3xl">Where the calls leak out</h2>
      <ol className="mt-4 space-y-3 text-muted">
        {ind.leaks.map((l, i) => (
          <li key={l}>
            0{i + 1} {l}
          </li>
        ))}
      </ol>
      <h2 className="mt-12 font-serif text-3xl">How we make you the first call</h2>
      <div className="mt-6 space-y-6">
        {ind.plan.map((p) => (
          <div key={p.title} className="border-t border-line pt-4">
            <h3 className="font-serif text-2xl">{p.title}</h3>
            <p className="mt-2 text-muted">{p.body}</p>
          </div>
        ))}
      </div>
      <Cta title={`Be the first call in ${ind.name.toLowerCase()}.`} />
    </div>
  );
}
