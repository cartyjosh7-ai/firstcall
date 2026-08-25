import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { userCount } from "@/lib/db/queries";
import { loginAction } from "../actions";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function CrmLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/crm");

  const count = await userCount();
  if (count === 0) redirect("/crm/setup");

  const { error, reset } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">First Call</p>
      <h1 className="mt-2 font-serif text-3xl">Sign in to the CRM</h1>

      {reset ? <p className="mt-4 text-sm text-gold">Password set — sign in with your new password.</p> : null}

      <form action={loginAction} className="mt-8 grid gap-3">
        <label className="text-sm">
          Email
          <input
            required
            name="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-line bg-[#12130f] px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Password
          <input
            required
            name="password"
            type="password"
            className="mt-1 w-full rounded-lg border border-line bg-[#12130f] px-3 py-2"
          />
        </label>
        {error ? <p className="text-sm text-rust">Wrong email or password.</p> : null}
        <button type="submit" className="mt-3 w-full rounded-full bg-gold py-3 font-medium text-ink hover:opacity-90">
          Sign in
        </button>
      </form>

      <p className="mt-4 text-xs text-muted">
        <Link href="/crm/forgot-password">Forgot password?</Link>
      </p>
      <p className="mt-4 text-xs text-muted">
        <Link href="/">← Back to the site</Link>
      </p>
    </div>
  );
}
