import { NextRequest, NextResponse } from "next/server";
import { captureLead, type LeadPayload } from "@/lib/leads";

const KINDS = new Set(["audit", "contact", "proposal"]);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const kind = typeof body.kind === "string" && KINDS.has(body.kind) ? body.kind : "contact";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!email && !name) {
    return NextResponse.json({ error: "Name or email is required." }, { status: 400 });
  }

  const lead: LeadPayload = {
    kind: kind as LeadPayload["kind"],
    name: name || undefined,
    email: email || undefined,
    phone: typeof body.phone === "string" ? body.phone : undefined,
    business: typeof body.business === "string" ? body.business : undefined,
    website: typeof body.website === "string" ? body.website : undefined,
    trade: typeof body.trade === "string" ? body.trade : undefined,
    message: typeof body.message === "string" ? body.message : undefined,
  };

  const result = await captureLead(lead);
  return NextResponse.json({ ok: true, ...result });
}
