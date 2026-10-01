import { LoadingProductCard } from "@/components/product-card";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8" aria-busy="true" aria-label="Loading product catalog">
      <div className="h-4 w-24 animate-pulse rounded-full bg-sand-200" />

      <section className="mx-auto max-w-3xl pt-8 text-center">
        <div className="mx-auto h-3 w-28 animate-pulse rounded-full bg-sand-200" />
        <div className="mx-auto mt-5 h-10 w-72 max-w-full animate-pulse rounded-full bg-sand-200 sm:w-96" />
        <div className="mx-auto mt-4 h-4 w-80 max-w-full animate-pulse rounded-full bg-sand-100" />
      </section>

      <div className="mx-auto mt-8 h-[4.5rem] max-w-2xl animate-pulse rounded-full bg-sand-100 p-2 shadow-sm">
        <div className="h-full rounded-full bg-white" />
      </div>

      <section className="mt-10 rounded-[1.75rem] border border-sand-200 bg-white/90 p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="h-4 w-40 animate-pulse rounded-full bg-sand-200" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-sand-100" />
        </div>
        <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
          <div className="h-8 w-24 animate-pulse rounded-full bg-sand-200" />
          <div className="h-8 w-28 animate-pulse rounded-full bg-sand-100" />
          <div className="h-8 w-24 animate-pulse rounded-full bg-sand-100" />
          <div className="h-8 w-32 animate-pulse rounded-full bg-sand-100" />
        </div>
      </section>

      <div className="mt-10 flex items-end justify-between gap-4">
        <div>
          <div className="h-5 w-36 animate-pulse rounded-full bg-sand-200" />
          <div className="mt-3 h-4 w-28 animate-pulse rounded-full bg-sand-100" />
        </div>
        <div className="h-7 w-24 animate-pulse rounded-full bg-sand-100" />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
        <LoadingProductCard />
        <LoadingProductCard />
        <LoadingProductCard />
        <LoadingProductCard />
      </div>
    </div>
  );
}
