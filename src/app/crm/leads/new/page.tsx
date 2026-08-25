import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { createLeadAction } from "../../actions";

export const metadata: Metadata = { title: "Add a lead" };
export const dynamic = "force-dynamic";

export default async function NewLeadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/crm/login");
  const { error } = await searchParams;

  return (
    <div className="max-w-xl">
      <p className="text-xs uppercase tracking-widest text-gold">New lead</p>
      <h1 className="mt-2 font-serif text-3xl">Add a lead</h1>
      <p className="mt-2 text-sm text-muted">
        Manually added leads start as <b>warm</b> and become <b>hot</b> the moment you log a contact
        against them.
      </p>

      <form action={createLeadAction} className="mt-8 grid gap-3 rounded-2xl border border-line bg-[#12130f] p-6">
        <label className="text-sm">
          Business name *
          <input required name="businessName" className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2" />
        </label>
        <label className="text-sm">
          Contact name
          <input name="contactName" className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            Email
            <input name="email" type="email" className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2" />
          </label>
          <label className="text-sm">
            Phone
            <input name="phone" className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2" />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            Website
            <input name="website" className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2" />
          </label>
          <label className="text-sm">
            Trade
            <input name="trade" className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2" />
          </label>
        </div>
        <label className="text-sm">
          Notes
          <textarea name="notes" rows={3} className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2" />
        </label>
        {error ? <p className="text-sm text-rust">Business name is required.</p> : null}
        <button type="submit" className="mt-2 w-full rounded-full bg-gold py-3 font-medium text-ink hover:opacity-90">
          Add lead
        </button>
      </form>
    </div>
  );
}
