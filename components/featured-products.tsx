import { Suspense } from "react";
import { listProducts } from "@/lib/backend";
import { LoadingProductCard, ProductCard } from "@/components/product-card";

async function getFeaturedProducts() {
  return listProducts({ status: "published", isFeatured: true, limit: 8 }).catch(() => []);
}

export function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2.5rem] border border-blue-100 bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_42%,#ffffff_100%)] p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center w-fit rounded-lg border border-gray-200 bg-white gap-1 p-2 shadow-sm">
              <div className="w-1 h-6 rounded-full bg-blue-400" />
              <h2 className="text-lg lg:text-3xl font-bold tracking-tight text-gray-900">
                Featured Items
              </h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              A hand-picked view of the products people reach for most, pulled
              straight from the live backend and presented in a cleaner shopping
              layout.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 md:min-w-[28rem] lg:min-w-[34rem]">
            {[
              { title: "Live feed", text: "Backend-synced products" },
              { title: "Fast browse", text: "Simple card layout" },
              { title: "Trusted pick", text: "Featured essentials" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
                  {item.title}
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {item.text}
                </p>
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
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      <LoadingProductCard />
      <LoadingProductCard />
      <LoadingProductCard />
      <LoadingProductCard />
    </div>
  );
}
