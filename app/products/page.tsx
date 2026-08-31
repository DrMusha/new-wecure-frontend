import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { ProductCard } from "@/components/product-card";
import { listCategories, listProductsPage } from "@/lib/backend";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Products | WeCure",
  description: "Browse live products from the WeCure backend.",
};

const PAGE_SIZE = 12;

type ProductsPageProps = {
  searchParams?: Promise<{
    page?: string | string[];
  }>;
};

function getPage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function buildPageHref(page: number) {
  const params = new URLSearchParams();
  if (page > 1) {
    params.set("page", String(page));
  }
  const query = params.toString();
  return `/products${query ? `?${query}` : ""}`;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = getPage(resolvedSearchParams?.page);
  const [productPage, categories] = await Promise.all([
    listProductsPage({ status: "published", page: currentPage, pageSize: PAGE_SIZE }).catch(() => ({
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
          title="Shop from the live product feed."
          description="These products are now pulled from the Go backend and rendered with a cleaner shopping layout."
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products" className="rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-white">
            All products
          </Link>
          {validCategories.slice(0, 6).map((category, index) => (
            <Link
              key={category.id || `category-filter-${index}`}
              href={`/categories/${category.id}`}
              className="rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm font-medium text-ink-800 transition hover:border-brand-300 hover:text-brand-600"
            >
              {category.name || "Untitled category"}
            </Link>
          ))}
        </div>

        {validProducts.length > 0 ? (
          <>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {validProducts.map((product, index) => (
                <ProductCard
                  key={product.id || `product-${index}`}
                  product={product}
                  categoryName={product.categoryId ? categoryMap.get(product.categoryId) : undefined}
                />
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 rounded-[2rem] border border-ink-900/10 bg-white/90 px-5 py-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-900/70">
                Showing {startItem}-{endItem} of {productPage.total} products
              </p>
              <div className="flex items-center gap-2">
                {hasPreviousPage ? (
                  <Link
                    href={buildPageHref(activePage - 1)}
                    className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-brand-300 hover:text-brand-600"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400">
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </span>
                )}
                <p className="px-2 text-sm font-medium text-ink-900/70">
                  Page {activePage} of {totalPages}
                </p>
                {hasNextPage ? (
                  <Link
                    href={buildPageHref(activePage + 1)}
                    className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-brand-300 hover:text-brand-600"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-ink-900/10 bg-white p-8 text-sm text-ink-900/60">
            No products are available yet. Once the backend has published items, they will appear here automatically.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
