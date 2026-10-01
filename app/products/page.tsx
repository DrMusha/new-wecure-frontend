import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { ProductCard } from "@/components/product-card";
import { listCategories, listProductsPage } from "@/lib/backend";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const totalPages = Math.max(1, productPage.totalPages || 1);
  const activePage = Math.min(Math.max(1, productPage.page || currentPage), totalPages);
  const startItem = productPage.total === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(activePage * PAGE_SIZE, productPage.total);
  const hasPreviousPage = activePage > 1;
  const hasNextPage = activePage < totalPages;

  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PageBreadcrumbs items={[{ label: "Products" }]} />

        <SectionHeading
          eyebrow="Catalog"
          title={search ? `Results for "${search}"` : categoryId ? "Products in this category." : "Shop trusted health essentials."}
          description={search ? "Browse products that match your search." : "Explore medicines, wellness products, and everyday essentials in one place."}
        />

        <div className="mt-7 max-w-2xl"><ProductSearch defaultValue={search} /></div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link href="/products" className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!categoryId ? "bg-ink-950 text-white" : "border border-ink-900/10 bg-white text-ink-900 hover:border-brand-300 hover:text-brand-600"}`}>
            All products
          </Link>
          {validCategories.slice(0, 6).map((category, index) => (
            <Link
              key={category.id || `category-filter-${index}`}
              href={`/products?categoryId=${category.id}`}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${categoryId === category.id ? "border-ink-950 bg-ink-950 text-white" : "border-ink-900/10 bg-white text-ink-800 hover:border-brand-300 hover:text-brand-600"}`}
            >
              {category.name || "Untitled category"}
            </Link>
          ))}
        </div>

        {validProducts.length > 0 ? (
          <>
            <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
              {validProducts.map((product, index) => (
                <ProductCard
                  key={product.id || `product-${index}`}
                  product={product}
                  categoryName={product.categoryId ? categoryMap.get(product.categoryId) : undefined}
                />
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 rounded-[1.5rem] border border-ink-900/10 bg-white/90 px-4 py-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] sm:rounded-[2rem] sm:px-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-ink-900/70">
                Showing {startItem}-{endItem} of {productPage.total} products
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                <p className="order-first text-center text-sm font-medium text-ink-900/70 sm:order-none sm:px-2">
                  Page {activePage} of {totalPages}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                  {hasPreviousPage ? (
                    <Link
                      href={buildPageHref(activePage - 1, search, categoryId)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-900/10 bg-white px-3 py-2 text-sm font-semibold text-ink-900 transition hover:border-brand-300 hover:text-brand-600 sm:px-4"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Link>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-400 sm:px-4">
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </span>
                  )}
                  {hasNextPage ? (
                    <Link
                      href={buildPageHref(activePage + 1, search, categoryId)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-900/10 bg-white px-3 py-2 text-sm font-semibold text-ink-900 transition hover:border-brand-300 hover:text-brand-600 sm:px-4"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-400 sm:px-4">
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-ink-900/10 bg-white p-8 text-sm text-ink-900/60">
            No products match this search yet. Try another name or browse all products.
            <Link href="/products" className="ml-2 font-semibold text-brand-600 hover:text-brand-700">Browse all products</Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
