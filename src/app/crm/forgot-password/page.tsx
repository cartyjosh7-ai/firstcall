import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordResetAction } from "../actions";

export const metadata: Metadata = { title: "Forgot password" };
export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">First Call</p>
      <h1 className="mt-2 font-serif text-3xl">Reset your password</h1>

      {sent ? (
        <p className="mt-6 text-sm text-muted">
          If that email has an account, a reset link is on its way — it expires in 1 hour. Check your inbox
          (and spam folder), then come back and sign in.
        </p>
      ) : (
        <form action={requestPasswordResetAction} className="mt-8 grid gap-3">
          <label className="text-sm">
            Email
            <input
              required
              name="email"
              type="email"
              className="mt-1 w-full rounded-lg border border-line bg-[#12130f] px-3 py-2"
            />
          </label>
          <button type="submit" className="mt-3 w-full rounded-full bg-gold py-3 font-medium text-ink hover:opacity-90">
            Send reset link
          </button>
        </form>
      )}

      <p className="mt-8 text-xs text-muted">
        <Link href="/crm/login">← Back to sign in</Link>
      </p>
    </div>
  );
}
