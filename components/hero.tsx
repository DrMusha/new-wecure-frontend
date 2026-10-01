import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, PackageCheck } from "lucide-react";
import { HomepageProductSearch } from "@/components/homepage-product-search";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_70%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_right,rgba(191,219,254,0.4),transparent_32%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:flex lg:min-h-[calc(100vh-4.5rem)] lg:items-center lg:px-8 lg:py-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
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

            <div className="mx-auto mt-6 max-w-2xl text-left lg:mx-0">
              <p className="mb-2 px-3 text-sm font-medium text-ink-900/60">What are you looking for?</p>
              <HomepageProductSearch />
            </div>

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

            <div className="mt-6 grid gap-2 text-left text-sm text-ink-900/65 sm:grid-cols-3">
              {['Clear product details', 'Secure mobile money', 'Saved order history'].map((item) => (
                <p key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />{item}</p>
              ))}
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-lg gap-3 sm:grid-cols-[1.45fr_0.9fr] lg:mx-0 lg:max-w-none lg:self-stretch">
          <div className="relative min-h-64 overflow-hidden rounded-[2rem] border border-white/80 bg-white p-2 shadow-[0_30px_80px_-52px_rgba(15,23,42,0.7)] sm:min-h-80 sm:rounded-[2.5rem] sm:p-3 lg:min-h-0">
            <Image src="/assets/image2.jpg" alt="WeCure pharmacy products" fill priority className="object-cover object-center" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.46)_0%,rgba(15,23,42,0.06)_65%)]" />
            <div className="absolute bottom-4 left-4 max-w-xs rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur sm:bottom-6 sm:left-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Simple from start to finish</p>
              <p className="mt-1 text-sm font-semibold text-ink-950">Search, add to bag, and pay with your phone.</p>
            </div>
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur sm:right-6 sm:top-6">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> WeCure Pharmacy
            </div>
          </div>

          <div className="grid gap-3 sm:grid-rows-[1fr_auto]">
            <div className="relative min-h-48 overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.6)] lg:min-h-0">
              <Image src="/assets/image1.jpg" alt="Everyday health and wellness products" fill className="object-cover object-center" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02)_35%,rgba(15,23,42,0.46)_100%)]" />
              <p className="absolute bottom-4 left-4 right-4 text-sm font-semibold text-white">Everyday care, all in one place.</p>
            </div>
            <div className="flex items-start gap-3 rounded-[2rem] border border-brand-100 bg-white/90 p-4 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><PackageCheck className="h-5 w-5" /></span>
              <div><p className="font-semibold text-ink-950">Built for clear choices</p><p className="mt-1 text-sm leading-6 text-ink-900/60">Browse product details and keep your order history in one place.</p></div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
