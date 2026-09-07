import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { site, salesPackages, type PackageId } from "@/lib/content";

export const runtime = "nodejs";

const PRICE_ENV: Record<PackageId, { setup: string; monthly?: string }> = {
  foundation: { setup: "STRIPE_PRICE_FOUNDATION_SETUP", monthly: "STRIPE_PRICE_FOUNDATION_MONTHLY" },
  growth: { setup: "STRIPE_PRICE_GROWTH_SETUP", monthly: "STRIPE_PRICE_GROWTH_MONTHLY" },
  domination: { setup: "STRIPE_PRICE_DOMINATION_SETUP", monthly: "STRIPE_PRICE_DOMINATION_MONTHLY" },
  // One-time only — no recurring price.
  audit: { setup: "STRIPE_PRICE_AUDIT" },
};

function isPackageId(value: unknown): value is PackageId {
  return typeof value === "string" && value in salesPackages;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    // no body is fine, checkout can start with nothing collected yet
  }

  const pkgId: PackageId = isPackageId(body.package) ? body.package : "foundation";
  const pkg = salesPackages[pkgId];
  const envKeys = PRICE_ENV[pkgId];
  const setupPrice = process.env[envKeys.setup];
  const monthlyPrice = envKeys.monthly ? process.env[envKeys.monthly] : undefined;
  const isSubscription = Boolean(envKeys.monthly);
  const stripe = getStripe();

  const business = typeof body.business === "string" ? body.business.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";
  const trade = typeof body.trade === "string" ? body.trade.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  const hasRequiredPrices = isSubscription ? Boolean(setupPrice && monthlyPrice) : Boolean(setupPrice);

  if (!stripe || !hasRequiredPrices) {
    return NextResponse.json({
      invoice: `Checkout isn't fully configured yet for ${pkg.name}. Email ${site.email} with your business, website, and trade and we'll send a Stripe invoice or payment link directly.`,
    });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = isSubscription
    ? [
        { price: setupPrice!, quantity: 1 },
        { price: monthlyPrice!, quantity: 1 },
      ]
    : [{ price: setupPrice!, quantity: 1 }];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items,
      success_url: `${site.url}/start/success`,
      cancel_url: `${site.url}/start`,
      customer_email: email || undefined,
      metadata: { business, website, trade, package: pkgId },
      ...(isSubscription
        ? { subscription_data: { metadata: { business, website, trade, package: pkgId } } }
        : {}),
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed." },
      { status: 500 },
    );
  }
}
