import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/audit";
import { captureLead } from "@/lib/leads";

export async function POST(req: NextRequest) {
  let body: { url?: string; email?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const url = (body.url || "").trim();
  if (!url) {
    return NextResponse.json({ error: "A website URL is required." }, { status: 400 });
  }

  const result = await runAudit(url);

  captureLead({
    kind: "audit",
    name: body.name,
    email: body.email,
    url: result.url || url,
    score: result.fetched ? result.score : undefined,
  }).catch(() => {});

  return NextResponse.json(result, { status: result.fetched || result.error ? 200 : 500 });
}
