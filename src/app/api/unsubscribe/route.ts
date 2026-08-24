import { NextRequest, NextResponse } from "next/server";
import { addUnsubscribe, verifyUnsubscribeToken } from "@/lib/unsubscribe";

export const runtime = "nodejs";

function page(message: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>First Call</title></head>
<body style="background:#0c0d0b;color:#f4efe4;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
<div style="max-width:28rem;padding:2rem;text-align:center;">
<p style="color:#c9a227;font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;">First Call</p>
<p style="margin-top:1rem;">${message}</p>
</div></body></html>`;
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") || "";
  const token = req.nextUrl.searchParams.get("token") || "";

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return new NextResponse(page("Invalid or expired unsubscribe link."), {
      status: 400,
      headers: { "content-type": "text/html" },
    });
  }

  await addUnsubscribe(email);
  return new NextResponse(page("You have been unsubscribed and will not receive further emails from First Call."), {
    status: 200,
    headers: { "content-type": "text/html" },
  });
}
