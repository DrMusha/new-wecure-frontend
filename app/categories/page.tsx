import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PackageSearch, Search } from "lucide-react";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listCategories } from "@/lib/backend";

export const metadata = {
  title: "Categories | WeCure",
  description: "Browse product categories from WeCure Pharmacy.",
};

export default async function CategoriesPage() {
  const categories = await listCategories().catch(() => []);
  const validCategories = categories.filter((category) => category?.id);

  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <PageBreadcrumbs items={[{ label: "Categories" }]} />

        <section className="mt-6 overflow-hidden rounded-[2rem] border border-brand-100 bg-[radial-gradient(circle_at_top_right,rgba(191,219,254,0.72),transparent_30%),linear-gradient(135deg,#eff6ff_0%,#ffffff_62%)] p-6 shadow-sm sm:mt-8 sm:rounded-[2.5rem] sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">Browse by category</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl lg:text-5xl">
                Start with what you need.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-ink-900/65 sm:text-base">
                Explore focused collections for medicines, wellness, personal care, and everyday health essentials.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Search all products
            </Link>
          </div>
        </section>

        {validCategories.length > 0 ? (
          <section className="mt-10 sm:mt-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">All categories</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">Find your collection</h2>
              </div>
              <p className="hidden text-sm text-ink-900/55 sm:block">Choose a category to see its products.</p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {validCategories.map((category, index) => (
              <Link
                key={category.id || `category-card-${index}`}
                href={`/products?categoryId=${category.id}`}
                className="group relative overflow-hidden rounded-[2rem] border border-sand-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_24px_70px_-46px_rgba(15,23,42,0.5)]"
              >
                <div className="relative aspect-[16/10] bg-sand-50">
                  {category.imageUrl ? (
                    <Image src={category.imageUrl} alt={category.name || "Category"} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <PackageSearch className="h-12 w-12 text-brand-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02)_34%,rgba(15,23,42,0.38)_100%)]" />
                  <p className="absolute bottom-4 left-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    Shop category <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </p>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-600">Category</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink-950">{category.name || "Untitled category"}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-900/65">
                    {category.description || "Discover products grouped into a category that fits your needs."}
                  </p>
                </div>
              </Link>
            ))}
            </div>
          </section>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-brand-200 bg-white p-8 text-center text-sm text-ink-900/60">
            No categories are available right now. Please check back again soon.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
