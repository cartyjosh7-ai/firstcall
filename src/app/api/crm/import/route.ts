import { NextRequest, NextResponse } from "next/server";
import { bulkCreateScraperLeads } from "@/lib/db/queries";

export const runtime = "nodejs";

/**
 * Bulk-ingest endpoint for the Calgary open-data lead importer
 * (scripts/import-calgary-leads.mjs) — always lands as source="scraper",
 * status="cold" (the cold-call list). Not a web scraper: the importer pulls
 * from the City of Calgary's licensed open-data business-licence dataset,
 * not from any scraped third-party site.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRM_IMPORT_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRM_IMPORT_SECRET is not configured." }, { status: 500 });
  }
  if (req.headers.get("x-import-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const list = Array.isArray(body) ? body : (body as { leads?: unknown[] })?.leads;
  if (!Array.isArray(list) || list.length === 0) {
    return NextResponse.json({ error: "Expected a non-empty array of leads (or { leads: [...] })." }, { status: 400 });
  }

  const rows = list
    .filter((r): r is Record<string, unknown> => typeof r === "object" && r !== null)
    .map((r) => ({
      businessName: typeof r.businessName === "string" ? r.businessName : "",
      website: typeof r.website === "string" ? r.website : undefined,
      phone: typeof r.phone === "string" ? r.phone : undefined,
      email: typeof r.email === "string" ? r.email : undefined,
      trade: typeof r.trade === "string" ? r.trade : undefined,
      notes: typeof r.notes === "string" ? r.notes : undefined,
    }))
    .filter((r) => r.businessName);

  if (rows.length === 0) {
    return NextResponse.json({ error: "Every lead needs at least a businessName." }, { status: 400 });
  }

  const created = await bulkCreateScraperLeads(rows);
  return NextResponse.json({ ok: true, created: created.length });
}
