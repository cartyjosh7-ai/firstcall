import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { userCount } from "@/lib/db/queries";
import { setupManagerAction } from "../actions";

export const metadata: Metadata = { title: "Set up your account" };
export const dynamic = "force-dynamic";

export default async function CrmSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const count = await userCount();
  if (count > 0) redirect("/crm/login");

  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-gold">First-time setup</p>
      <h1 className="mt-2 font-serif text-3xl">Create the manager account</h1>
      <p className="mt-3 text-sm text-muted">
        This only appears while the CRM has zero accounts. Whoever creates this account gets the
        company/manager account, with visibility into every lead and every employee. Do this yourself,
        once.
      </p>

      <form action={setupManagerAction} className="mt-8 grid gap-3">
        <label className="text-sm">
          Your name
          <input required name="name" className="mt-1 w-full rounded-lg border border-line bg-[#12130f] px-3 py-2" />
        </label>
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
            minLength={8}
            className="mt-1 w-full rounded-lg border border-line bg-[#12130f] px-3 py-2"
          />
          <span className="mt-1 block text-xs text-muted">At least 8 characters.</span>
        </label>
        {error ? <p className="text-sm text-rust">Fill in every field with a password of 8+ characters.</p> : null}
        <button type="submit" className="mt-3 w-full rounded-full bg-gold py-3 font-medium text-ink hover:opacity-90">
          Create manager account
        </button>
      </form>
    </div>
  );
}
