import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cta } from "@/components/chrome";
import { services } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

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
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">{svc.surface}</p>
      <h1 className="mt-3 font-serif text-5xl">{svc.headline}</h1>
      <p className="mt-4 text-muted">{svc.intro}</p>
      <h2 className="mt-12 font-serif text-2xl">The problem</h2>
      <p className="mt-2 text-muted">{svc.problem}</p>
      <h2 className="mt-8 font-serif text-2xl">The outcome</h2>
      <p className="mt-2 text-muted">{svc.outcome}</p>
      <h2 className="mt-12 font-serif text-3xl">What we actually do</h2>
      <div className="mt-6 space-y-6">
        {svc.work.map((w) => (
          <div key={w.title} className="border-t border-line pt-4">
            <h3 className="font-serif text-2xl">{w.title}</h3>
            <p className="mt-2 text-muted">{w.body}</p>
          </div>
        ))}
      </div>
      <Cta title={`Ready to win ${svc.name}?`} />
    </div>
  );
}
