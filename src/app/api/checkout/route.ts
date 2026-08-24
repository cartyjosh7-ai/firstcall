import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { site } from "@/lib/content";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const setupPrice = process.env.STRIPE_PRICE_FOUNDATION_SETUP;
  const monthlyPrice = process.env.STRIPE_PRICE_FOUNDATION_MONTHLY;
  const stripe = getStripe();

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    // no body is fine, checkout can start with nothing collected yet
  }

  const business = typeof body.business === "string" ? body.business.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";
  const trade = typeof body.trade === "string" ? body.trade.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!stripe || !setupPrice || !monthlyPrice) {
    return NextResponse.json({
      invoice: `Checkout isn't fully configured yet. Email ${site.email} with your business, website, and trade and we'll send a Stripe invoice or payment link directly.`,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        { price: setupPrice, quantity: 1 },
        { price: monthlyPrice, quantity: 1 },
      ],
      success_url: `${site.url}/start/success`,
      cancel_url: `${site.url}/start`,
      customer_email: email || undefined,
      metadata: { business, website, trade },
      subscription_data: { metadata: { business, website, trade } },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed." },
      { status: 500 },
    );
  }
}
