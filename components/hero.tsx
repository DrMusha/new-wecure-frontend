import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { HomepageProductSearch } from "@/components/homepage-product-search";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_70%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_right,rgba(191,219,254,0.4),transparent_32%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700 shadow-sm sm:px-4 sm:text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Online pharmacy in Zambia
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl lg:text-6xl">
              Find the health essentials you need.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink-900/65 sm:text-lg sm:leading-8">
              Search medicines, wellness products, and everyday care, then order securely in a few simple steps.
            </p>

            <div className="mt-7 rounded-[1.75rem] border border-white/90 bg-white/90 p-3 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.55)] sm:p-4">
              <p className="px-2 text-sm font-semibold text-ink-950">What are you looking for?</p>
              <HomepageProductSearch />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm text-ink-900/55">Browse:</span>
              {[
                { label: "Medicines", href: "/products?search=medicine" },
                { label: "Wellness", href: "/products?search=wellness" },
                { label: "Baby care", href: "/products?search=baby" },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="rounded-full border border-sand-200 bg-white px-3 py-1.5 text-sm font-medium text-ink-800 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                  {item.label}
                </Link>
              ))}
              <Link href="/categories" className="inline-flex items-center gap-1 px-2 py-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
                All categories <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-7 grid gap-3 text-sm text-ink-900/65 sm:grid-cols-3">
              {['Clear product details', 'Secure mobile money', 'Saved order history'].map((item) => (
                <p key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />{item}</p>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:justify-self-end">
            <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white p-2 shadow-[0_32px_90px_-50px_rgba(15,23,42,0.65)] sm:rounded-[2.5rem] sm:p-3">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                <Image src="/assets/image2.jpg" alt="WeCure pharmacy products" fill priority className="object-cover object-center" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0)_45%,rgba(15,23,42,0.5)_100%)]" />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-xs">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">WeCure Pharmacy</p>
                  <p className="mt-1 text-sm font-semibold text-ink-950">Search, add to bag, and pay with your phone.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
