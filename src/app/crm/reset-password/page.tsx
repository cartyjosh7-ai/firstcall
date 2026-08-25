import type { Metadata } from "next";
import { resetPasswordAction } from "../actions";

export const metadata: Metadata = { title: "Reset password" };
export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  if (!token) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-5 py-16">
        <p className="text-sm text-rust">Missing or invalid reset link. Request a new one from the sign-in page.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">First Call</p>
      <h1 className="mt-2 font-serif text-3xl">Set a new password</h1>

      <form action={resetPasswordAction} className="mt-8 grid gap-3">
        <input type="hidden" name="token" value={token} />
        <label className="text-sm">
          New password
          <input
            required
            name="password"
            type="password"
            minLength={8}
            className="mt-1 w-full rounded-lg border border-line bg-[#12130f] px-3 py-2"
          />
          <span className="mt-1 block text-xs text-muted">At least 8 characters.</span>
        </label>
        {error ? (
          <p className="text-sm text-rust">
            That link is invalid or expired (links last 1 hour), or the password is too short. Request a new
            link from the sign-in page.
          </p>
        ) : null}
        <button type="submit" className="mt-3 w-full rounded-full bg-gold py-3 font-medium text-ink hover:opacity-90">
          Set password
        </button>
      </form>
    </div>
  );
}
