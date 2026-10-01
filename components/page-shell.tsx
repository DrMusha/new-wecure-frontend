import { SectionHeading } from "@/components/section-heading";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageShell({ eyebrow, title, description }: PageShellProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-8 rounded-[2rem] border border-white/80 bg-white/95 p-5 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/70 sm:mt-10 sm:p-8">
        <p className="max-w-2xl text-sm leading-7 text-ink-900/70">
          WeCure is designed to make it easier to discover pharmacy essentials, understand each product, and complete your order with confidence.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
            Shop products <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/search" className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
            <Search className="h-4 w-4" /> Find a product
          </Link>
        </div>
      </div>
    </section>
  );
}
