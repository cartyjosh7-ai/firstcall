export const site = {
  name: "First Call",
  tagline: "Be the first call.",
  description:
    "Local SEO for home services. We get owner-led local businesses ranked #1 on Google and the Map Pack, so the phone rings first.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://firstcallconsulting.ai",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "cartyjosh7@gmail.com",
  legalName: process.env.LEGAL_ENTITY_NAME ?? "First Call",
  // CASL requires a valid mailing address in every commercial electronic message.
  mailingAddress: process.env.NEXT_PUBLIC_MAILING_ADDRESS ?? "[Set NEXT_PUBLIC_MAILING_ADDRESS — required by CASL]",
} as const;

export const trades = [
  "HVAC",
  "Roofing",
  "Mold & Remediation",
  "Cleaning & Janitorial",
  "Auto & Wraps",
  "Trucking & Equipment",
  "Other",
] as const;

export const industries = [
  {
    slug: "hvac",
    name: "HVAC",
    label: "Heating & cooling",
    headline: "HVAC marketing that books the job.",
    intent:
      "Emergency 'AC repair near me', 'furnace not working', and high-value 'AC replacement' research queries.",
    leaks: [
      "Emergency demand goes to whoever appears first, not whoever is best",
      "Seasonal spikes overwhelm a slow or invisible web presence",
      "High-value system replacements lost to better-found competitors",
    ],
    plan: [
      {
        title: "Own emergency intent",
        body: "Near-me and 'no heat / no cool' queries captured across map, AI, and voice, with click-to-call ready.",
      },
      {
        title: "Seasonal demand capture",
        body: "Content and profile tuned to spike with the weather, so peak demand finds you first.",
      },
      {
        title: "Replacement research",
        body: "Answer-first guides that win the high-margin replacement buyer before the competition is even considered.",
      },
    ],
  },
  {
    slug: "roofing",
    name: "Roofing",
    label: "Roofing",
    headline: "Roofing marketing for storm demand and replacement.",
    intent:
      "Storm-damage, leak, and full-replacement queries where the first trusted name on the map or in an AI answer gets the inspection.",
    leaks: [
      "Storm surge goes to whoever Google and ChatGPT name first",
      "Insurance and replacement research happens off your site",
      "Thin city pages fail to earn citations or map rank",
    ],
    plan: [
      {
        title: "Own storm intent",
        body: "Profile, reviews, and click-to-call ready before the next weather event.",
      },
      {
        title: "Win replacement research",
        body: "Citable guides and schema so AI names you for replacement, not just emergency patches.",
      },
      {
        title: "Proof that converts",
        body: "Reviews, photos, and a five-second trust path from search to booked inspection.",
      },
    ],
  },
  {
    slug: "remediation",
    name: "Mold & Remediation",
    label: "Air quality & remediation",
    headline: "Named first when the problem is found.",
    intent:
      "Mold, water damage, and indoor-air queries where a worried owner asks an assistant and calls the single name they hear.",
    leaks: [
      "AI answers cite national brands instead of the local licensed crew",
      "Service-area businesses miss map coverage zone by zone",
      "Sites fail the five-second trust test on a phone",
    ],
    plan: [
      {
        title: "Become the cited answer",
        body: "Answer-first content and entity signals so ChatGPT, Perplexity, and Gemini can name you.",
      },
      {
        title: "Zone-by-zone near-me",
        body: "Visibility engineered for the territories you actually serve.",
      },
      {
        title: "Trust in under five seconds",
        body: "Licensing, insurance, and click-to-call on every surface that matters.",
      },
    ],
  },
  {
    slug: "cleaning",
    name: "Cleaning & Janitorial",
    label: "Cleaning & janitorial",
    headline: "The first name for recurring and commercial cleaning.",
    intent:
      "Office, facility, and residential cleaning searches where reviews, proximity, and a clear next step decide the contract.",
    leaks: [
      "Map pack is crowded with similar names and thin profiles",
      "Commercial RFPs start in AI overviews you are not in",
      "Sites talk features instead of proof and response time",
    ],
    plan: [
      {
        title: "Profile and reviews",
        body: "Category, recency, and response rate that win the pack for your service area.",
      },
      {
        title: "Commercial findability",
        body: "Pages and schema for the contracts you actually want.",
      },
      {
        title: "A path to book",
        body: "Fast, trusted site with a human next step, not a form that dies.",
      },
    ],
  },
  {
    slug: "auto",
    name: "Auto & Wraps",
    label: "Vehicle wraps & performance",
    headline: "Found when someone is ready to wrap or build.",
    intent:
      "Wrap, fleet, and performance shop queries that mix local maps with research-heavy AI answers.",
    leaks: [
      "Portfolio lives on social, not in citable, indexed pages",
      "AI cites national wrap chains for local jobs",
      "Phone users bounce before they see proof",
    ],
    plan: [
      {
        title: "Make the work citable",
        body: "Project pages, schema, and photos engines can actually quote.",
      },
      {
        title: "Win local + research",
        body: "Map pack for near-me, AEO/GEO for the buyer still deciding.",
      },
      {
        title: "Convert the visit",
        body: "Trust-first site with fleet and performance paths that call.",
      },
    ],
  },
  {
    slug: "trucking",
    name: "Trucking & Equipment",
    label: "Truck & equipment services",
    headline: "The shop fleets call first.",
    intent:
      "Repair, upfit, and equipment service queries from operators who pick the nearest trusted name.",
    leaks: [
      "GBP categories do not match what the shop actually sells",
      "B2B buyers ask ChatGPT and get a national chain",
      "Hours, fleet photos, and NAP are inconsistent",
    ],
    plan: [
      {
        title: "Identity that matches the work",
        body: "Categories, citations, and pages for the services that pay.",
      },
      {
        title: "Get named in AI",
        body: "Citable service content for fleet and equipment operators.",
      },
      {
        title: "Make calling effortless",
        body: "Hours, photos, and click-to-call that survive a 2 a.m. breakdown.",
      },
    ],
  },
] as const;

export const services = [
  {
    slug: "local-seo",
    name: "Local SEO & the Map Pack",
    surface: "Surface 01 / Maps",
    headline: "Local SEO & the Map Pack",
    intro:
      "Local SEO is the work that puts your business in the Google Map Pack and 'near me' results, where most local buyers decide. We engineer the highest-weighted signals: the correct primary category, a complete Business Profile, steady recent reviews, consistent citations, and location pages that earn the rank.",
    problem:
      "The three businesses in the map pack take most of the calls. Everyone below the fold competes for scraps.",
    outcome:
      "You appear in the top three map results for the services and neighborhoods that pay, and your rank holds because it is built on owned, consistent signals.",
    work: [
      {
        title: "Primary category and profile",
        body: "We set the single most important lever, your primary category, then complete every field, add real photos, and run the posts and Q&A that move rank.",
      },
      {
        title: "Review velocity and recency",
        body: "We install a system that earns steady, recent, authentic reviews and responds to every one.",
      },
      {
        title: "Location and service pages",
        body: "Useful pages for each service and territory, wired with NAP and LocalBusiness schema.",
      },
      {
        title: "Citations and consistency",
        body: "Consistent listings so engines and AI treat your identity as settled.",
      },
    ],
  },
  {
    slug: "aeo",
    name: "Answer Engine Optimization (AEO)",
    surface: "Surface 02 / Google AI",
    headline: "Become the answer inside Google AI Overviews.",
    intro:
      "Answer Engine Optimization is how you show up when Google writes the answer instead of a list of links. We build answer-first content, FAQ schema, and entity clarity so the overview can cite you.",
    problem:
      "AI Overviews name one or two sources. If you are not cited, the click never happens.",
    outcome:
      "Your pages are structured to be quoted: clear answers, proof, and schema a model can trust.",
    work: [
      {
        title: "Answer-first pages",
        body: "Lead with the owner's question, then the proof. No throat-clearing.",
      },
      {
        title: "FAQ and speakable schema",
        body: "Markup that matches how overviews and voice extract answers.",
      },
      {
        title: "Entity consolidation",
        body: "One identity across the site, profile, and citations.",
      },
    ],
  },
  {
    slug: "geo",
    name: "Generative Engine Optimization (GEO)",
    surface: "Surface 03 / AI Assistants",
    headline: "Get cited inside ChatGPT, Perplexity, and Gemini.",
    intro:
      "GEO is the work of becoming the named local recommendation in generative answers. We build citable content, stacked schema, and off-site entity signals.",
    problem:
      "Assistants pick a small set of sources. Most local firms have nothing a model can quote.",
    outcome:
      "You are a candidate for the single cited answer in your trade and city.",
    work: [
      {
        title: "Citable assets",
        body: "Pages with facts, process, licensing, and geography a model can reuse.",
      },
      {
        title: "Stacked schema",
        body: "Organization, LocalBusiness, Service, FAQ, and sameAs links that agree.",
      },
      {
        title: "Off-site entity",
        body: "Citations and mentions that corroborate who you are.",
      },
    ],
  },
  {
    slug: "voice",
    name: "Voice & Near-Me",
    surface: "Surface 04 / Voice",
    headline: "Win the single spoken recommendation.",
    intro:
      "Voice names one business. We make sure the spoken answer, the near-me pack, and click-to-call all point at you.",
    problem:
      "If the assistant cannot confirm you are open, local, and trusted, it names someone else.",
    outcome:
      "Hours, NAP, reviews, and mobile conversion are aligned so a spoken 'call them' is possible.",
    work: [
      {
        title: "Near-me readiness",
        body: "Profile completeness, categories, and service areas that match reality.",
      },
      {
        title: "Spoken-answer structure",
        body: "Short, factual answers on the site that voice systems can read.",
      },
      {
        title: "Call path",
        body: "Click-to-call, hours, and trust signals that survive a phone screen.",
      },
    ],
  },
  {
    slug: "websites",
    name: "Conversion Websites",
    surface: "Surface 05 / Site",
    headline: "Trust-first sites engineered to be chosen in the first instant.",
    intro:
      "The site has about five seconds to prove you are the one to call. We build fast, schema-complete, conversion-first sites for trades.",
    problem:
      "Pretty templates without proof, schema, or a call path lose the job.",
    outcome:
      "A site that matches the story on Maps and in AI, and turns the visit into a call.",
    work: [
      {
        title: "Five-second trust",
        body: "License, insurance, reviews, and the next action above the fold.",
      },
      {
        title: "Speed and crawl",
        body: "Core Web Vitals, robots, llms.txt, and crawler access.",
      },
      {
        title: "Schema graph",
        body: "A connected graph, not a single LocalBusiness tag.",
      },
    ],
  },
] as const;

export const guides = [
  {
    slug: "the-2026-ai-search-playbook-for-home-services",
    title: "The 2026 AI Search Playbook for Home Services",
    dek: "Where local buyers decide now, and what to own if you want the call.",
  },
  {
    slug: "how-to-get-cited-by-chatgpt-and-perplexity",
    title: "How to Get Cited by ChatGPT and Perplexity",
    dek: "What generative engines actually quote from a local business.",
  },
  {
    slug: "aeo-vs-seo-what-changed",
    title: "AEO vs SEO: What Changed",
    dek: "Rankings still matter. Being the answer matters more than it used to.",
  },
  {
    slug: "winning-the-google-map-pack",
    title: "Winning the Google Map Pack",
    dek: "Category, recency, and consistency — the levers that actually move the pack.",
  },
] as const;

export const foundation = {
  id: "foundation",
  name: "Foundation",
  priceOneTime: 2799,
  priceOneTimeLabel: "CAD $2,799 one-time",
  priceMonthly: 139.99,
  priceMonthlyLabel: "CAD $139.99 / month",
  priceLabel: "CAD $2,799 one-time + $139.99/month",
  cadence: "One-time setup, then month-to-month. Cancel the monthly retainer anytime with 30 days' notice.",
  forWho: "Single-location home-service businesses getting found.",
  included: [
    "Business Profile + local optimization",
    "Review acquisition system",
    "Core on-page + LocalBusiness schema",
    "Foundational content",
    "Plain-English monthly reporting (calls, jobs, visibility)",
    "Senior strategist ownership",
  ],
  notIncluded: [
    "Paid ads media spend",
    "Full multi-location AEO / GEO (Growth)",
    "Digital PR and expansion markets (Domination)",
    "Custom software builds",
  ],
};

/**
 * Activated 2026-09-06 (was previously scoped-but-dormant, Foundation-only
 * first-sale strategy). Growth/Domination/Audit were priced as ranges
 * because real scope varies per client (e.g. Domination scales with location
 * count) — the user chose the low end of each range as a fixed, self-serve
 * checkout price rather than gating these behind a sales conversation. If a
 * client's real scope is bigger than the low end, that's a manual upsell
 * after the fact, not something checkout enforces.
 */
export const growth = {
  id: "growth",
  name: "Growth",
  priceOneTime: 3800,
  priceOneTimeLabel: "CAD $3,800 one-time",
  priceMonthly: 249,
  priceMonthlyLabel: "CAD $249 / month",
  priceLabel: "Starting at CAD $3,800 one-time + $249/month",
  cadence: "One-time setup, then month-to-month. Cancel the monthly retainer anytime with 30 days' notice.",
  forWho: "Established local/regional businesses ready to scale past the basics.",
  included: [
    "Everything in Foundation",
    "Technical SEO audit + fixes",
    "4–8 optimized content pages/month",
    "Internal linking strategy + basic link building",
    "GA4 + rank tracking",
  ],
  notIncluded: ["Digital PR and expansion markets (Domination)", "Custom software builds"],
} as const;

export const domination = {
  id: "domination",
  name: "Domination",
  priceOneTime: 5500,
  priceOneTimeLabel: "CAD $5,500 one-time",
  priceMonthly: 449,
  priceMonthlyLabel: "CAD $449 / month",
  priceLabel: "Starting at CAD $5,500 one-time + $449/month",
  cadence: "One-time setup, then month-to-month. Cancel the monthly retainer anytime with 30 days' notice.",
  forWho: "Multi-location businesses and competitive niches that need to win outright.",
  included: [
    "Everything in Growth",
    "Aggressive content production (8–12 pages/month)",
    "Digital PR and link building",
    "Conversion rate optimization",
    "Google Map Pack monitoring across every location",
    "Quarterly strategy review",
  ],
  notIncluded: ["Custom software builds"],
} as const;

export const audit = {
  id: "audit",
  name: "Technical SEO Audit",
  priceOneTime: 497,
  priceOneTimeLabel: "CAD $497 one-time",
  priceMonthly: null,
  priceMonthlyLabel: null,
  priceLabel: "Starting at CAD $497 one-time",
  cadence: "One-time engagement — no retainer.",
  forWho: "Anyone who wants a full technical/on-page/local/backlink audit before committing to a retainer.",
  included: [
    "Full technical, on-page, local, and backlink audit",
    "Prioritized action plan",
    "Walkthrough call",
  ],
  notIncluded: ["Ongoing implementation (see Foundation, Growth, or Domination)"],
} as const;

/** Every self-serve, checkout-purchasable offer, keyed by id. Used by /api/checkout and /start. */
export const salesPackages = { foundation, growth, domination, audit } as const;
export type PackageId = keyof typeof salesPackages;

/**
 * Not sold via public checkout. The GEO add-on only makes sense for an
 * existing retainer client (it attaches to their subscription) — per the
 * 2026-09-06 decision, that flow isn't built yet, so it stays dormant here.
 */
export const dormantAddOns = [
  {
    id: "geo",
    name: "AI Search Add-on",
    priceLabel: "CAD $99–$199/month",
    description:
      "Optional add-on for retainer clients who also want visibility inside ChatGPT, Perplexity, and Gemini answers. Not part of the core Google-first offer, and not a standalone entry point — attach it to an existing client from the CRM once that flow is built, not via public checkout.",
  },
] as const;
