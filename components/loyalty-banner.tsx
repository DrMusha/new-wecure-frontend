import Link from "next/link";
import { Sparkles } from "lucide-react";

export function LoyaltyBanner() {
  return <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <Link href="/loyalty" className="flex flex-col gap-4 rounded-[2rem] bg-ink-950 px-6 py-6 text-white shadow-[0_28px_70px_-48px_rgba(15,23,42,0.8)] transition hover:bg-ink-900 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white"><Sparkles className="h-5 w-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">WeCure Loyalty</p><h2 className="mt-1 text-xl font-semibold">Unlock massive discounts on your orders.</h2></div></div>
      <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-950">Join the program</span>
    </Link>
  </section>;
}
