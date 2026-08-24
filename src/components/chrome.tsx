import Link from "next/link";
import { site } from "@/lib/content";

const nav = [
  { href: "/services/local-seo", label: "Services" },
  { href: "/industries/hvac", label: "Industries" },
  { href: "/tools/visibility-checker", label: "Tools" },
  { href: "/pricing", label: "Foundation" },
  { href: "/about", label: "Company" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="font-serif text-xl tracking-tight no-underline">
          {site.name}
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-muted md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="no-underline hover:text-paper">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/audit"
          className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-ink no-underline hover:opacity-90"
        >
          Free audit
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-4">
        <div>
          <p className="font-serif text-2xl">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            The AI-era visibility firm. We make local and home-service businesses the first call
            customers make, everywhere they search.
          </p>
          <p className="mt-4 text-sm">
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-muted">Services</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/services/local-seo">Local SEO</Link>
            </li>
            <li>
              <Link href="/services/aeo">Answer Engine Optimization</Link>
            </li>
            <li>
              <Link href="/services/geo">Generative Engine Optimization</Link>
            </li>
            <li>
              <Link href="/services/voice">Voice & Near-Me</Link>
            </li>
            <li>
              <Link href="/services/websites">Conversion Websites</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-muted">Company</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/results">Results</Link>
            </li>
            <li>
              <Link href="/pricing">Foundation pricing</Link>
            </li>
            <li>
              <Link href="/start">Start Foundation</Link>
            </li>
            <li>
              <Link href="/playbook">Month-1 playbook</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/resources">Resources</Link>
            </li>
            <li>
              <Link href="/markets">Markets</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-muted">Legal</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
            <li>
              <Link href="/legal/msa">Master services agreement</Link>
            </li>
            <li>
              <Link href="/legal/sow">Foundation statement of work</Link>
            </li>
            <li>
              <Link href="/sitemap.xml">Sitemap</Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line px-5 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.legalName}. Month-to-month. No long lock-in.
      </p>
    </footer>
  );
}

export function Cta({
  title = "See your visibility score before you spend a dollar.",
}: {
  title?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs uppercase tracking-widest text-gold">The first step</p>
      <h2 className="mt-3 max-w-3xl font-serif text-4xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-muted">
        The free 100-point audit names your gaps across every surface, puts a number on staying
        invisible, and shows the path to more calls. Yours to keep, no obligation.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/audit"
          className="rounded-full bg-gold px-5 py-3 text-ink no-underline hover:opacity-90"
        >
          Get your free visibility audit
        </Link>
        <Link href="/contact" className="rounded-full border border-line px-5 py-3 no-underline">
          Talk to a strategist
        </Link>
      </div>
    </section>
  );
}
