import { Suspense } from "react";
import { listProducts } from "@/lib/backend";
import { LoadingProductCard, ProductCard } from "@/components/product-card";

async function getFeaturedProducts() {
  return listProducts({ status: "published", isFeatured: true, limit: 8 }).catch(() => []);
}

export function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="rounded-[1.5rem] border border-blue-100 bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_42%,#ffffff_100%)] p-3 shadow-sm sm:rounded-[2.5rem] sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="flex w-fit items-center gap-1 rounded-lg border border-gray-200 bg-white p-1.5 shadow-sm sm:p-2">
              <div className="h-5 w-1 rounded-full bg-blue-400 sm:h-6" />
              <h2 className="text-base font-bold tracking-tight text-gray-900 sm:text-lg lg:text-3xl">
                Featured Items
              </h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-500 sm:mt-4 sm:text-base sm:leading-7">
              A hand-picked selection of the items customers reach for most.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 md:max-w-[28rem] lg:max-w-[34rem]">
            {[
              { title: "Popular now", text: "Customer favorites" },
              { title: "Easy browse", text: "Quick to scan" },
              { title: "Trusted pick", text: "Featured essentials" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">{item.title}</p>
                <p className="mt-2 text-sm font-semibold text-gray-900">{item.text}</p>
              </div>
            ))}
          </div>
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
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
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
