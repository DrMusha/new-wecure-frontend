import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCategory, listProducts } from "@/lib/backend";
import { ProductCard } from "@/components/product-card";

type CategoryPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const { id } = await params;
  try {
    const category = await getCategory(id);
    return {
      title: `${category.name} | WeCure`,
      description: category.description || "Browse this category on WeCure.",
    };
  } catch {
    return {
      title: "Category | WeCure",
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const category = await getCategory(id);
  const products = await listProducts({ categoryId: id, limit: 24 });

  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PageBreadcrumbs
          items={[
            { label: "Categories", href: "/categories" },
            { label: category.name },
          ]}
        />

        <Link href="/categories" className="mt-4 inline-flex items-center gap-2 rounded-full border border-sand-200 bg-white px-4 py-2 text-sm font-medium text-ink-800 transition hover:border-brand-200 hover:text-brand-700">
          <ArrowLeft className="h-4 w-4" />
          Back to categories
        </Link>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-ink-900/10 bg-white shadow-sm">
          <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
                Category
              </p>
              <h1 className="mt-3 break-words text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
                {category.name}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-900/70">
                {category.description || "Browse products in this category."}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-56 w-56 overflow-hidden rounded-[2rem] bg-brand-50">
                {category.imageUrl ? (
                  <Image src={category.imageUrl} alt={category.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <PackageSearch className="h-12 w-12 text-brand-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
                Products
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink-950">
                Items in this category
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-ink-900/60">{products.length} items</p>
              <Link href={`/products?categoryId=${id}`} className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">View in catalog</Link>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} categoryName={category.name} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-dashed border-ink-900/15 bg-white p-8 text-sm text-ink-900/70">
              No products are available in this category right now.
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
