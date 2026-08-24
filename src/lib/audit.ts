const PRIVATE_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

export type AuditCategoryId =
  | "maps"
  | "overviews"
  | "assistants"
  | "voice"
  | "website";

export type AuditCheck = {
  id: string;
  category: AuditCategoryId;
  label: string;
  passed: boolean;
  points: number;
  max: number;
  detail: string;
};

export type AuditResult = {
  url: string;
  fetched: boolean;
  error?: string;
  score: number;
  max: number;
  categories: {
    id: AuditCategoryId;
    name: string;
    score: number;
    max: number;
  }[];
  checks: AuditCheck[];
  pagesRead: number;
  followUp: string;
};

const CATEGORIES: { id: AuditCategoryId; name: string; max: number }[] = [
  { id: "maps", name: "Google & Map Pack", max: 20 },
  { id: "overviews", name: "AI Overviews", max: 20 },
  { id: "assistants", name: "AI Assistants", max: 15 },
  { id: "voice", name: "Voice & Near-Me", max: 15 },
  { id: "website", name: "Website & Reviews", max: 30 },
];

function isPrivateHostname(hostname: string) {
  const host = hostname.toLowerCase().replace(/\.+$/, "");
  if (PRIVATE_HOSTS.has(host)) return true;
  if (host.endsWith(".local") || host.endsWith(".internal")) return true;
  if (/^10\.\d+\.\d+\.\d+$/.test(host)) return true;
  if (/^192\.168\.\d+\.\d+$/.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(host)) return true;
  if (/^169\.254\.\d+\.\d+$/.test(host)) return true;
  return false;
}

export function normalizeAuditUrl(raw: string): URL {
  const trimmed = raw.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(withProtocol);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http and https URLs can be scanned.");
  }
  if (isPrivateHostname(url.hostname)) {
    throw new Error("That address cannot be scanned.");
  }
  return url;
}

async function fetchText(url: string, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent": "FirstCallAudit/1.0 (+https://firstcallconsulting.ai/audit)",
        accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
      },
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text, finalUrl: res.url, ms: 0 };
  } finally {
    clearTimeout(timer);
  }
}

function has(html: string, pattern: RegExp) {
  return pattern.test(html);
}

function check(
  id: string,
  category: AuditCategoryId,
  label: string,
  passed: boolean,
  max: number,
  detail: string,
): AuditCheck {
  return { id, category, label, passed, points: passed ? max : 0, max, detail };
}

function extractLinks(html: string, base: URL) {
  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((m) => m[1]);
  const out: string[] = [];
  for (const href of hrefs) {
    try {
      const next = new URL(href, base);
      if (next.hostname === base.hostname && next.protocol.startsWith("http")) {
        const path = next.pathname.replace(/\/$/, "") || "/";
        if (!out.includes(path) && path !== base.pathname.replace(/\/$/, "")) {
          out.push(next.toString());
        }
      }
    } catch {
      /* ignore */
    }
  }
  return out.slice(0, 3);
}

export async function runAudit(rawUrl: string): Promise<AuditResult> {
  let url: URL;
  try {
    url = normalizeAuditUrl(rawUrl);
  } catch (err) {
    return {
      url: rawUrl,
      fetched: false,
      error: err instanceof Error ? err.message : "Invalid URL",
      score: 0,
      max: 100,
      categories: CATEGORIES.map((c) => ({ ...c, score: 0 })),
      checks: [],
      pagesRead: 0,
      followUp:
        "A senior strategist still reviews Google Business Profile, reviews vs rivals, and who is getting the calls. Reply within one business day.",
    };
  }

  const started = Date.now();
  let home: Awaited<ReturnType<typeof fetchText>>;
  try {
    home = await fetchText(url.toString());
  } catch {
    return {
      url: url.toString(),
      fetched: false,
      error:
        "We could not read that site. If it sits behind a bot filter, the scanner will not invent a score. Email us the URL and we will review it by hand.",
      score: 0,
      max: 100,
      categories: CATEGORIES.map((c) => ({ ...c, score: 0 })),
      checks: [],
      pagesRead: 0,
      followUp:
        "A senior strategist reviews every scan by hand within one business day and adds what a scanner cannot see.",
    };
  }

  const elapsed = Date.now() - started;
  if (!home.ok || home.text.length < 40) {
    return {
      url: url.toString(),
      fetched: false,
      error: `The site responded ${home.status || "empty"} and could not be scored honestly.`,
      score: 0,
      max: 100,
      categories: CATEGORIES.map((c) => ({ ...c, score: 0 })),
      checks: [],
      pagesRead: 0,
      followUp:
        "A senior strategist reviews every scan by hand within one business day and adds what a scanner cannot see.",
    };
  }

  const html = home.text;
  const lower = html.toLowerCase();
  const origin = new URL(home.finalUrl || url.toString());

  let robots = "";
  try {
    const r = await fetchText(new URL("/robots.txt", origin).toString(), 5000);
    if (r.ok) robots = r.text;
  } catch {
    robots = "";
  }

  const interior = extractLinks(html, origin);
  let extraHtml = "";
  let pagesRead = 1;
  for (const link of interior) {
    try {
      const page = await fetchText(link, 6000);
      if (page.ok) {
        extraHtml += `\n${page.text}`;
        pagesRead += 1;
      }
    } catch {
      /* skip */
    }
  }
  const all = `${html}\n${extraHtml}`.toLowerCase();

  const checks: AuditCheck[] = [
    check("nap", "maps", "Name, address, or phone visible", /\b(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|address|localbusiness)\b/i.test(all), 4, "Map engines need consistent NAP on the site."),
    check("local-schema", "maps", "LocalBusiness or Organization schema", has(html, /localbusiness|organization/i) && has(html, /application\/ld\+json/i), 5, "Structured identity for Maps and knowledge panels."),
    check("city-service", "maps", "City or service-area language", has(all, /\b(serving|near me|service area|[A-Z][a-z]+,?\s+[A-Z]{2})\b/), 4, "Geo language that matches how people search."),
    check("maps-embed", "maps", "Map or Google profile signal", has(all, /google\.com\/maps|maps\.google|g\.page|gbp/i), 3, "A path from the site to the Business Profile."),
    check("hours", "maps", "Hours published", has(all, /hours|open today|monday|weekday/i), 4, "Hours feed map pack and voice."),

    check("faq", "overviews", "FAQ or Q&A content", has(all, /faq|frequently asked|itemtype=["'][^"']*faq/i), 5, "Overviews extract question-and-answer blocks."),
    check("faq-schema", "overviews", "FAQPage schema", has(html, /faqpage/i), 5, "FAQ schema is a direct overview input."),
    check("answer-first", "overviews", "Direct answers on interior pages", pagesRead > 1 && has(extraHtml, /<(h1|h2)[^>]*>[^<]{12,}/i), 5, "Interior pages with real headings, not a brochure homepage only."),
    check("how-to", "overviews", "How / what / when language", has(all, /\b(how to|what to do|when to|cost of)\b/), 5, "Query-shaped copy overviews can quote."),

    check("about-entity", "assistants", "About / entity page", has(all, /about us|our story|licensed|insured|family.owned/i), 4, "Assistants need a stable 'who'."),
    check("sameas", "assistants", "sameAs or social corroboration", has(html, /sameas|facebook\.com|linkedin\.com|instagram\.com/i), 3, "Off-site identity for GEO."),
    check("llms", "assistants", "llms.txt present", has(robots, /llms\.txt/i) || all.includes("llms.txt"), 4, "A machine-readable brief for assistants."),
    check("facts", "assistants", "License, insurance, or years in market", has(all, /licensed|insured|years of|established/i), 4, "Quotable facts beat adjectives."),

    check("click-to-call", "voice", "Click-to-call tel: link", has(html, /href=["']tel:/i), 5, "Voice ends in a call."),
    check("mobile-meta", "voice", "Viewport meta", has(html, /name=["']viewport["']/i), 3, "Near-me traffic is mobile."),
    check("cta", "voice", "Clear call or book action", has(all, /call now|book|schedule|get a quote|request/i), 4, "A spoken 'want me to call them' needs a path."),
    check("speakable", "voice", "Short factual intro", (html.match(/<p[\s>]/gi) ?? []).length >= 2, 3, "Enough prose for a spoken answer, not a hero image only."),

    check("https", "website", "HTTPS", origin.protocol === "https:", 3, "Trust and ranking hygiene."),
    check("title", "website", "Unique title tag", has(html, /<title>[^<]{8,}<\/title>/i), 3, "Basic crawl and click signal."),
    check("meta-desc", "website", "Meta description", has(html, /name=["']description["']/i), 2, "Snippet and overview context."),
    check("h1", "website", "One clear H1", (html.match(/<h1\b/gi) ?? []).length === 1, 3, "A single topic for the page."),
    check("reviews", "website", "Reviews or ratings on-site", has(all, /review|rating|stars|google reviews|testimonial/i), 5, "Proof for humans and models."),
    check("speed", "website", "Responded under 3s", elapsed < 3000, 4, "Response time of the homepage fetch, not lab CWV."),
    check("robots", "website", "robots.txt reachable", robots.length > 0, 2, "Crawler access documented."),
    check("indexable", "website", "Not noindex", !has(html, /noindex/i), 3, "The site allows indexing."),
    check("images-alt", "website", "Image alt text present", has(html, /<img[^>]+alt=/i), 2, "Accessibility and image search."),
    check("contact", "website", "Contact path", has(all, /contact|get in touch|email/i), 3, "A human next step."),
  ];

  const categories = CATEGORIES.map((c) => {
    const mine = checks.filter((ch) => ch.category === c.id);
    const raw = mine.reduce((s, ch) => s + ch.points, 0);
    const rawMax = mine.reduce((s, ch) => s + ch.max, 0) || 1;
    const score = Math.round((raw / rawMax) * c.max);
    return { id: c.id, name: c.name, score, max: c.max };
  });

  const score = categories.reduce((s, c) => s + c.score, 0);

  return {
    url: origin.toString(),
    fetched: true,
    score,
    max: 100,
    categories,
    checks,
    pagesRead,
    followUp:
      "A senior strategist reviews this scan by hand within one business day: Google Business Profile, review position vs local rivals, and who is currently being called instead of you. This scanner does not estimate traffic or rankings.",
  };
}
