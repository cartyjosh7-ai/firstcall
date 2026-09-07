#!/usr/bin/env node
/**
 * Pulls businesses matching First Call's trades from the City of Calgary's
 * open-data Business Licences dataset (Open Government Licence – City of
 * Calgary, commercial use permitted) and bulk-imports them into the CRM as
 * cold leads via POST /api/crm/import.
 *
 * This is NOT a web scraper — data.calgary.ca is a licensed open-data API
 * (Socrata), not a scrape of a commercial directory. See
 * docs/business/compliance-rules.md for why that distinction matters and
 * why Yellow Pages / HomeStars / Yelp / Google Maps are not options.
 *
 * Important limitation, confirmed against the live dataset: Alberta
 * regulates HVAC, roofing, remediation, and trucking provincially, so
 * Calgary's business-licence categories only have clean, specific matches
 * for Cleaning & Janitorial and Auto & Wraps. The other four trades are
 * filtered by keyword match against the business's own trade name within
 * the generic "CONTRACTOR" licence bucket — lower precision/recall than the
 * category match. Review the CRM list before calling; this is a discovery
 * tool, not a guarantee every result is a real fit.
 *
 * Usage:
 *   node scripts/import-calgary-leads.mjs --trade=cleaning,auto           # dry run (default)
 *   node scripts/import-calgary-leads.mjs --trade=all --import            # actually import
 *   node scripts/import-calgary-leads.mjs --trade=hvac --limit=100 --import
 *
 *   node scripts/import-calgary-leads.mjs --delete-all
 *       Deletes every scraper-sourced lead still untouched (cold — no
 *       contact logged, not assigned, not won/lost). Use this if you switch
 *       to a better prospecting process later. Anything already worked is
 *       never touched, even if it came from this same import.
 *
 * Flags:
 *   --trade=<list>   Comma-separated: hvac, roofing, remediation, cleaning, auto, trucking, all (default: all)
 *   --limit=<n>       Max rows fetched per trade before local filtering (default: 500)
 *   --import          Actually POST to the CRM. Without this flag, only prints a summary — nothing is sent.
 *   --delete-all      Deletes all untouched scraper leads from the CRM (see above). Ignores --trade/--limit/--import.
 *   --target=<url>    API base URL (default: https://firstcall-teal.vercel.app)
 *
 * Requires CRM_IMPORT_SECRET in .env.local (same file the app itself uses).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const ENV_PATH = path.join(REPO_ROOT, ".env.local");
const SEEN_CACHE_PATH = path.join(REPO_ROOT, "data", "calgary-import-seen.json");
const SOCRATA_ENDPOINT = "https://data.calgary.ca/resource/vdjc-pybd.json";

// Licence statuses observed as still active in the live dataset.
const ACTIVE_STATUSES = [
  "Licensed",
  "Renewal Licensed",
  "Pending Renewal",
  "Renewal Invoiced",
  "Renewal Notification Sent",
];

// Matches First Call's own trades list (src/lib/content.ts) exactly.
const TRADE_CONFIG = {
  cleaning: {
    label: "Cleaning & Janitorial",
    mode: "category",
    // Confirmed real licencetypes values for this trade.
    categoryLikes: ["%CLEANING SERVICE%"],
  },
  auto: {
    label: "Auto & Wraps",
    mode: "category",
    categoryLikes: ["%AUTO BODY SHOP%", "%MOTOR VEHICLE REPAIR%"],
  },
  hvac: {
    label: "HVAC",
    mode: "keyword",
    // Alberta regulates HVAC provincially — Calgary's licence just says
    // CONTRACTOR, so fall back to matching the business's own trade name.
    keywords: ["heating", "air condition", "hvac", "furnace", "refrigeration mechanical", "boiler"],
  },
  roofing: {
    label: "Roofing",
    mode: "keyword",
    keywords: ["roof"],
  },
  remediation: {
    label: "Mold & Remediation",
    mode: "keyword",
    keywords: ["restoration", "remediation", "mold", "mould", "flood", "water damage", "fire damage", "disaster"],
  },
  trucking: {
    label: "Trucking & Equipment",
    mode: "keyword",
    keywords: ["trucking", "hauling", "freight", "towing", "tow truck"],
  },
};

// --- CLI args ---
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const tradeArg = typeof args.trade === "string" ? args.trade : "all";
const trades = tradeArg === "all" ? Object.keys(TRADE_CONFIG) : tradeArg.split(",").map((t) => t.trim());
const limit = Number(args.limit) || 500;
const doImport = Boolean(args.import);
const target = typeof args.target === "string" ? args.target : "https://firstcall-teal.vercel.app";

for (const t of trades) {
  if (!TRADE_CONFIG[t]) {
    console.error(`Unknown trade "${t}". Valid: ${Object.keys(TRADE_CONFIG).join(", ")}, all`);
    process.exit(1);
  }
}

function readEnvVar(name) {
  if (!fs.existsSync(ENV_PATH)) return undefined;
  const raw = fs.readFileSync(ENV_PATH, "utf8");
  const match = raw.match(new RegExp(`^${name}=(.*)$`, "m"));
  return match ? match[1].trim() : undefined;
}

function readSeenCache() {
  try {
    return new Set(JSON.parse(fs.readFileSync(SEEN_CACHE_PATH, "utf8")));
  } catch {
    return new Set();
  }
}

function writeSeenCache(seenSet) {
  fs.mkdirSync(path.dirname(SEEN_CACHE_PATH), { recursive: true });
  fs.writeFileSync(SEEN_CACHE_PATH, JSON.stringify([...seenSet]), "utf8");
}

async function fetchCategoryTrade(config) {
  const statusClause = ACTIVE_STATUSES.map((s) => `jobstatusdesc='${s}'`).join(" OR ");
  const likeClause = config.categoryLikes.map((l) => `upper(licencetypes) like upper('${l}')`).join(" OR ");
  const where = encodeURIComponent(`(${likeClause}) AND (${statusClause})`);
  const url = `${SOCRATA_ENDPOINT}?$where=${where}&$limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Calgary API ${res.status} for ${config.label}`);
  return res.json();
}

async function fetchContractorBucket() {
  const statusClause = ACTIVE_STATUSES.map((s) => `jobstatusdesc='${s}'`).join(" OR ");
  const where = encodeURIComponent(`upper(licencetypes) like '%CONTRACTOR%' AND (${statusClause})`);
  const url = `${SOCRATA_ENDPOINT}?$where=${where}&$limit=50000`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Calgary API ${res.status} fetching contractor bucket`);
  return res.json();
}

function matchesKeywords(row, keywords) {
  const name = (row.tradename || "").toLowerCase();
  return keywords.some((k) => name.includes(k));
}

function toLead(row, tradeLabel) {
  const notesParts = [
    row.licencetypes ? `Licence: ${row.licencetypes}` : null,
    row.address ? `Address: ${row.address}` : null,
    row.comdistnm ? `Community: ${row.comdistnm}` : null,
    row.jobstatusdesc ? `Status: ${row.jobstatusdesc}` : null,
    "Source: City of Calgary Business Licences open data (not a web scrape).",
  ].filter(Boolean);

  return {
    businessName: row.tradename,
    trade: tradeLabel,
    notes: notesParts.join(" — "),
    _id: row.getbusid, // used for local dedup only, stripped before import
  };
}

async function deleteAll() {
  const secret = readEnvVar("CRM_IMPORT_SECRET");
  if (!secret) throw new Error("CRM_IMPORT_SECRET not found in .env.local");

  const res = await fetch(`${target}/api/crm/import`, {
    method: "DELETE",
    headers: { "x-import-secret": secret },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Delete failed: ${res.status} ${JSON.stringify(body)}`);

  console.log(`Deleted ${body.deleted} untouched scraper leads.`);
  if (fs.existsSync(SEEN_CACHE_PATH)) fs.unlinkSync(SEEN_CACHE_PATH);
}

async function main() {
  if (args["delete-all"]) {
    await deleteAll();
    return;
  }

  let contractorBucket = null;
  const allLeads = [];
  const perTradeCounts = {};

  for (const key of trades) {
    const config = TRADE_CONFIG[key];
    let rows;
    if (config.mode === "category") {
      rows = await fetchCategoryTrade(config);
    } else {
      if (!contractorBucket) contractorBucket = await fetchContractorBucket();
      rows = contractorBucket.filter((r) => matchesKeywords(r, config.keywords));
    }
    const leads = rows.filter((r) => r.tradename).map((r) => toLead(r, config.label));
    perTradeCounts[config.label] = leads.length;
    allLeads.push(...leads);
  }

  // De-dup within this run by business name (a business can hold multiple licences).
  const byName = new Map();
  for (const lead of allLeads) {
    if (!byName.has(lead.businessName)) byName.set(lead.businessName, lead);
  }
  const deduped = [...byName.values()];

  // De-dup against previous runs of this script.
  const seen = readSeenCache();
  const fresh = deduped.filter((l) => !seen.has(l._id));

  console.log("Per-trade matches found:");
  for (const [label, count] of Object.entries(perTradeCounts)) {
    console.log(`  ${label}: ${count}`);
  }
  console.log(`Total unique businesses: ${deduped.length}`);
  console.log(`New since last run: ${fresh.length}`);

  if (fresh.length === 0) {
    console.log("Nothing new to import.");
    return;
  }

  if (!doImport) {
    console.log("\nDry run — no leads sent. Re-run with --import to actually add these to the CRM.");
    console.log("Sample:");
    for (const l of fresh.slice(0, 5)) {
      console.log(`  [${l.trade}] ${l.businessName} — ${l.notes}`);
    }
    return;
  }

  const secret = readEnvVar("CRM_IMPORT_SECRET");
  if (!secret) throw new Error("CRM_IMPORT_SECRET not found in .env.local");

  const payload = fresh.map(({ _id, ...lead }) => lead);
  const res = await fetch(`${target}/api/crm/import`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-import-secret": secret },
    body: JSON.stringify({ leads: payload }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Import failed: ${res.status} ${JSON.stringify(body)}`);

  console.log(`\nImported ${body.created} new cold leads into the CRM.`);
  for (const l of fresh) seen.add(l._id);
  writeSeenCache(seen);
}

main().catch((err) => {
  console.error("FAILED:", err.message);
  process.exit(1);
});
