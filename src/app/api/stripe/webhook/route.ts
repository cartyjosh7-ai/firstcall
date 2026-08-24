import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { captureLead } from "@/lib/leads";
import { runEngine } from "@/lib/agents/orchestrate";
import { site } from "@/lib/content";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `Invalid signature: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};
    const business = metadata.business || "";
    const website = metadata.website || "";
    const trade = metadata.trade || "";
    const email = session.customer_details?.email || session.customer_email || undefined;

    if (business && website && trade) {
      // Respond to Stripe first; generate the client's first deliverable
      // (two sequential Claude agents) after the response is sent.
      after(async () => {
        try {
          const report = await runEngine({ business, website, trade, email });
          await captureLead({
            kind: "won",
            email,
            business,
            website,
            trade,
            reportUrl: `${site.url}/reports/${report.id}`,
          });
        } catch {
          await captureLead({ kind: "won", email, business, website, trade }).catch(() => {});
        }
      });
    } else {
      await captureLead({
        kind: "won",
        email,
        business: business || undefined,
        website: website || undefined,
        trade: trade || undefined,
      }).catch(() => {});
    }
  }

  return NextResponse.json({ received: true });
}
