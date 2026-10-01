import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { HomepageProductSearch } from "@/components/homepage-product-search";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_70%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_right,rgba(191,219,254,0.4),transparent_32%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-12">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-x-12 lg:gap-y-8">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700 shadow-sm sm:px-4 sm:text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Online pharmacy in Zambia
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              Find the health essentials you need.
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-ink-900/65 sm:text-lg sm:leading-8 lg:mx-0">
              Search medicines, wellness products, and everyday care, then order securely in a few simple steps.
            </p>

          </div>

          <div className="relative mx-auto h-[22rem] w-full max-w-lg lg:mx-0 lg:h-[24rem] lg:max-w-none">
            <div className="absolute bottom-0 left-0 h-[72%] w-[78%] overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_30px_80px_-48px_rgba(15,23,42,0.62)] sm:rounded-[2.5rem]">
              <Image src="/assets/image2.jpg" alt="WeCure pharmacy products" fill priority className="object-cover object-center" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_42%,rgba(15,23,42,0.55)_100%)]" />
              <p className="absolute bottom-5 left-5 right-5 text-sm font-semibold text-white sm:bottom-6 sm:left-6">Everyday care, all in one place.</p>
            </div>

            <div className="absolute right-0 top-0 z-10 h-[78%] w-[76%] overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_30px_80px_-42px_rgba(15,23,42,0.68)] sm:rounded-[2.5rem]">
              <Image src="/assets/image1.jpg" alt="A WeCure pharmacist ready to help" fill className="object-cover object-[62%_center]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02)_42%,rgba(15,23,42,0.5)_100%)]" />
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">WeCure Pharmacy</p>
                <p className="mt-1 text-sm font-semibold text-white">Here to help you make clear, confident choices.</p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-4xl text-left lg:col-span-2">
            <p className="mb-2 px-3 text-sm font-medium text-ink-900/60">What are you looking for?</p>
            <HomepageProductSearch />

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
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

            <div className="mt-6 grid gap-2 text-sm text-ink-900/65 sm:grid-cols-3">
              {['Clear product details', 'Secure mobile money', 'Saved order history'].map((item) => (
                <p key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />{item}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
