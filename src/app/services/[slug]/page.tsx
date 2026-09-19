import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { Cta } from "@/components/chrome";
import { services } from "@/lib/content";
import { HeroPanel } from "@/components/motion/hero-panel";

type Props = { params: Promise<{ slug: string }> };

const d = (n: number) => ({ "--d": n }) as CSSProperties;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const svc = services.find((s) => s.slug === slug);
  if (!svc) return {};
  return { title: svc.name };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const svc = services.find((s) => s.slug === slug);
  if (!svc) notFound();

  return (
    <>
      <HeroPanel className="pb-6 pt-16">
        <div className="mx-auto max-w-3xl px-5">
          <p className="reveal text-xs uppercase tracking-widest text-gold" style={d(0)}>
            <span className="ruleline">{svc.surface}</span>
          </p>
          <h1 className="reveal mt-3 font-serif text-5xl" style={d(1)}>
            {svc.headline}
          </h1>
          <p className="reveal mt-4 text-muted" style={d(2)}>
            {svc.intro}
          </p>
        </div>
      </HeroPanel>

      <div className="mx-auto max-w-3xl px-5 pb-4">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="reveal" style={d(0)}>
            <h2 className="font-serif text-2xl">The problem</h2>
            <p className="mt-2 text-muted">{svc.problem}</p>
          </div>
          <div className="reveal" style={d(1)}>
            <h2 className="font-serif text-2xl">The outcome</h2>
            <p className="mt-2 text-muted">{svc.outcome}</p>
          </div>
        </div>
        <p className="reveal mt-16 text-xs uppercase tracking-widest text-gold" style={d(0)}>
          <span className="ruleline">What we actually do</span>
        </p>
        <div className="mt-8 space-y-6">
          {svc.work.map((w, i) => (
            <div key={w.title} className="whycard reveal border-t border-line pt-4" style={d(i + 1)}>
              <h3 className="font-serif text-2xl">{w.title}</h3>
              <p className="mt-2 text-muted">{w.body}</p>
            </div>
          ))}
        </div>
      </div>
      <Cta title={`Ready to win ${svc.name}?`} />
    </>
  );
}
