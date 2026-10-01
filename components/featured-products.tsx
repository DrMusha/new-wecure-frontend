import { Suspense } from "react";
import { listProducts } from "@/lib/backend";
import { LoadingProductCard, ProductCard } from "@/components/product-card";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

async function getFeaturedProducts() {
  return listProducts({ status: "published", isFeatured: true, limit: 8 }).catch(() => []);
}

export function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="rounded-[2rem] border border-brand-100 bg-[radial-gradient(circle_at_top_right,rgba(191,219,254,0.72),transparent_27%),linear-gradient(180deg,#f8fbff_0%,#ffffff_42%)] p-5 shadow-sm sm:rounded-[2.5rem] sm:p-7 lg:p-8">
        <div className="flex flex-col gap-5 border-b border-brand-100 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-7">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Popular essentials
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
              Featured items, ready when you are.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-ink-900/65 sm:text-base">
              A considered selection of products customers come back for—add them to your bag in a tap or explore the details first.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
          >
            Browse all products
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <Suspense fallback={<LoadingRows />}>
          <FeaturedProductsList />
        </Suspense>
      </div>
    </section>
  );
}

async function FeaturedProductsList() {
  const products = await getFeaturedProducts();

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.length > 0 ? products.map((product) => (
          <ProductCard key={product.id} product={product} />
        )) : (
          <div className="col-span-full rounded-[1.5rem] border border-dashed border-brand-200 bg-white/80 px-6 py-10 text-center">
            <p className="text-base font-semibold text-ink-950">Featured products are being refreshed.</p>
            <p className="mt-2 text-sm text-ink-900/65">Browse the full catalogue to find what you need.</p>
            <Link href="/products" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800">
              Browse products <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      <LoadingProductCard />
      <LoadingProductCard />
      <LoadingProductCard />
      <LoadingProductCard />
    </div>
  );
}
