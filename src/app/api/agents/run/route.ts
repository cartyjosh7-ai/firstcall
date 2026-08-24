import { NextRequest, NextResponse } from "next/server";
import { runEngine } from "@/lib/agents/orchestrate";
import { site } from "@/lib/content";

export const runtime = "nodejs";
// Two sequential Claude tool-use agents can take well over Vercel's default
// timeout. Respected on plans that allow extending function duration
// (no-op, capped lower, elsewhere).
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const requiredSecret = process.env.ADMIN_API_SECRET;
  if (requiredSecret) {
    const provided = req.headers.get("x-admin-secret");
    if (provided !== requiredSecret) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const business = typeof body.business === "string" ? body.business.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";
  const trade = typeof body.trade === "string" ? body.trade.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : undefined;
  const email = typeof body.email === "string" ? body.email.trim() : undefined;

  if (!business || !website || !trade) {
    return NextResponse.json(
      { error: "business, website, and trade are required." },
      { status: 400 },
    );
  }

  try {
    const report = await runEngine({ business, website, trade, location, email });
    return NextResponse.json({
      id: report.id,
      reportUrl: `${site.url}/reports/${report.id}`,
      mock: report.mock,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Engine failed." },
      { status: 500 },
    );
  }
}
