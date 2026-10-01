import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { ProductCard } from "@/components/product-card";
import { listCategories, listProductsPage } from "@/lib/backend";
import Link from "next/link";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { ProductSearch } from "@/components/product-search";

export const metadata = {
  title: "Products | WeCure",
  description: "Browse products from WeCure Pharmacy.",
};

const PAGE_SIZE = 12;

type ProductsPageProps = {
  searchParams?: Promise<{
    page?: string | string[];
    search?: string | string[];
    categoryId?: string | string[];
  }>;
};

function getSearchParam(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() || "";
}

function getPage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function buildPageHref(page: number, search: string, categoryId: string) {
  const params = new URLSearchParams();
  if (page > 1) {
    params.set("page", String(page));
  }
  if (search) {
    params.set("search", search);
  }
  if (categoryId) params.set("categoryId", categoryId);
  const query = params.toString();
  return `/products${query ? `?${query}` : ""}`;
}

function visiblePages(current: number, total: number) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = getPage(resolvedSearchParams?.page);
  const search = getSearchParam(resolvedSearchParams?.search);
  const categoryId = getSearchParam(resolvedSearchParams?.categoryId);
  const [productPage, categories] = await Promise.all([
    listProductsPage({ status: "published", search, categoryId, page: currentPage, pageSize: PAGE_SIZE }).catch(() => ({
      items: [],
      page: currentPage,
      pageSize: PAGE_SIZE,
      total: 0,
      totalPages: 1,
    })),
    listCategories().catch(() => []),
  ]);

  const validProducts = productPage.items.filter(Boolean);
  const validCategories = categories.filter((category) => category?.id);
  const categoryMap = new Map(
    validCategories.map((category) => [category.id, category.name]),
  );
  const activeCategory = validCategories.find((category) => category.id === categoryId);
  const totalPages = Math.max(1, productPage.totalPages || 1);
  const activePage = Math.min(Math.max(1, productPage.page || currentPage), totalPages);
  const startItem = productPage.total === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(activePage * PAGE_SIZE, productPage.total);
  const hasPreviousPage = activePage > 1;
  const hasNextPage = activePage < totalPages;

  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <PageBreadcrumbs items={[{ label: "Products" }]} />

        <section className="mx-auto max-w-3xl pt-5 text-center sm:pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">Product catalog</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-950 sm:text-5xl">Find what you need.</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink-900/65 sm:text-base">Search by product name, brand, or category. We’ll help you get to the right product quickly.</p>
        </section>

        <div className="mt-8"><ProductSearch defaultValue={search} id="catalog-product-search" prominent className="mx-auto max-w-2xl" /></div>

        <section className="mt-10 rounded-[1.75rem] border border-sand-200 bg-white/90 p-4 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.4)] sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-900"><SlidersHorizontal className="h-4 w-4 text-brand-600" /> Browse by category</div>
            {(search || categoryId) ? <Link href="/products" className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"><X className="h-4 w-4" /> Clear filters</Link> : null}
          </div>
          <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
            <Link href={search ? `/products?search=${encodeURIComponent(search)}` : "/products"} className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${!categoryId ? "border-ink-950 bg-ink-950 text-white" : "border-sand-200 bg-sand-50 text-ink-800 hover:border-brand-200 hover:text-brand-700"}`}>All products</Link>
            {validCategories.map((category) => {
              const params = new URLSearchParams();
              if (search) params.set("search", search);
              params.set("categoryId", category.id);
              return <Link key={category.id} href={`/products?${params}`} className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${categoryId === category.id ? "border-brand-600 bg-brand-600 text-white" : "border-sand-200 bg-sand-50 text-ink-800 hover:border-brand-200 hover:text-brand-700"}`}>{category.name || "Untitled category"}</Link>;
            })}
          </div>
          <details className="mt-4 sm:hidden">
            <summary className="cursor-pointer rounded-xl bg-sand-50 px-3 py-2 text-sm font-medium text-ink-800">Choose a category</summary>
            <div className="mt-2 grid gap-1">
              <Link href={search ? `/products?search=${encodeURIComponent(search)}` : "/products"} className="rounded-xl px-3 py-2 text-sm font-medium text-ink-800 hover:bg-brand-50">All products</Link>
              {validCategories.map((category) => {
                const params = new URLSearchParams();
                if (search) params.set("search", search);
                params.set("categoryId", category.id);
                return <Link key={category.id} href={`/products?${params}`} className={`rounded-xl px-3 py-2 text-sm font-medium ${categoryId === category.id ? "bg-brand-50 text-brand-700" : "text-ink-800 hover:bg-brand-50"}`}>{category.name || "Untitled category"}</Link>;
              })}
            </div>
          </details>
        </section>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-ink-950">{search ? `Results for “${search}”` : activeCategory ? activeCategory.name : "All products"}</p>
            <p className="mt-1 text-sm text-ink-900/60">{productPage.total} {productPage.total === 1 ? "product" : "products"} found{activeCategory ? ` in ${activeCategory.name}` : ""}.</p>
          </div>
          {categoryId ? <span className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700">{activeCategory?.name || "Category filter"}</span> : null}
        </div>

        {validProducts.length > 0 ? (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {validProducts.map((product, index) => (
                <ProductCard
                  key={product.id || `product-${index}`}
                  product={product}
                  categoryName={product.categoryId ? categoryMap.get(product.categoryId) : undefined}
                />
              ))}
            </div>

            <nav aria-label="Product pages" className="mt-10 flex flex-col gap-3 rounded-[1.5rem] border border-sand-200 bg-white/90 px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-ink-900/70">
                Showing {startItem}-{endItem} of {productPage.total} products
              </p>
              <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1 sm:overflow-visible sm:pb-0">
                  {hasPreviousPage ? (
                    <Link
                      href={buildPageHref(activePage - 1, search, categoryId)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-900/10 bg-white px-3 py-2 text-sm font-semibold text-ink-900 transition hover:border-brand-300 hover:text-brand-600 sm:px-4"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Link>
                  ) : null}
                  <div className="flex items-center gap-1">
                    {visiblePages(activePage, totalPages).map((page, index, pages) => <span key={page} className="flex items-center gap-1">{index > 0 && page - pages[index - 1] > 1 ? <span className="px-1 text-ink-900/40">…</span> : null}<Link aria-current={page === activePage ? "page" : undefined} href={buildPageHref(page, search, categoryId)} className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-semibold ${page === activePage ? "bg-ink-950 text-white" : "text-ink-800 hover:bg-brand-50 hover:text-brand-700"}`}>{page}</Link></span>)}
                  </div>
                  {hasNextPage ? (
                    <Link
                      href={buildPageHref(activePage + 1, search, categoryId)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-900/10 bg-white px-3 py-2 text-sm font-semibold text-ink-900 transition hover:border-brand-300 hover:text-brand-600 sm:px-4"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : null}
              </div>
            </nav>
          </>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-sand-300 bg-white p-8 text-sm text-ink-900/65">
            <p className="text-lg font-semibold text-ink-950">No matching products yet.</p>
            <p className="mt-2 max-w-md leading-6">Try another product name, choose a different category, or return to the full catalog.</p>
            <Link href="/products" className="mt-5 inline-flex rounded-full bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">Browse all products</Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
