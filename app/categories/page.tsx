import Image from "next/image";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listCategories, listProducts } from "@/lib/backend";

export const metadata = {
  title: "Categories | WeCure",
  description: "Browse product categories from WeCure Pharmacy.",
};

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([
    listCategories().catch(() => []),
    listProducts({ status: "published", limit: 48 }).catch(() => []),
  ]);

  const validCategories = categories.filter((category) => category?.id);
  const counts = validCategories.map((category) => ({
    ...category,
    count: products.filter((product) => product.categoryId === category.id).length,
  }));

  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PageBreadcrumbs items={[{ label: "Categories" }]} />

        <SectionHeading
          eyebrow="Categories"
          title="Browse categories for every need."
          description="Explore product categories to find medicines, wellness essentials, and more."
        />

        {counts.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {counts.map((category, index) => (
              <Link
                key={category.id || `category-card-${index}`}
                href={`/categories/${category.id}`}
                className="group overflow-hidden rounded-[2rem] border border-ink-900/10 bg-white transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-glow"
              >
                <div className="relative aspect-[4/3] bg-sand-50">
                  {category.imageUrl ? (
                    <Image src={category.imageUrl} alt={category.name || "Category"} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <PackageSearch className="h-12 w-12 text-brand-400" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
                    {category.count} {category.count === 1 ? "product" : "products"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-ink-950">{category.name || "Untitled category"}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-900/65">
                    {category.description || "Discover products grouped into a category that fits your needs."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-ink-900/10 bg-white p-8 text-sm text-ink-900/60">
            No categories are available right now. Please check back again soon.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
