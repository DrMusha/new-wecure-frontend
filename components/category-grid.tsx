import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PackageSearch } from "lucide-react";
import { listCategories } from "@/lib/backend";

function getFallbackGradient(index: number) {
  const styles = [
    "from-brand-50 via-white to-sand-100",
    "from-sand-50 via-white to-brand-50",
    "from-blue-50 via-white to-slate-100",
    "from-slate-50 via-white to-brand-100",
    "from-brand-50 via-white to-sand-50",
    "from-sand-100 via-white to-brand-50",
  ];
  return styles[index % styles.length];
}

export async function CategoryGrid() {
  const categories = await listCategories().catch(() => []);
  const categoryCandidates = categories.slice(0, 6).filter((category) => category?.id);
  // Keep the visual rhythm deliberate: the section renders category pairs only.
  const visibleCategories = categoryCandidates.length % 2 === 0
    ? categoryCandidates
    : categoryCandidates.slice(0, -1);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">Browse by need</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
              Shop your way to the right product.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-ink-900/65 sm:text-base">
              Choose a category to open a focused product list, then search or add items straight to your bag.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
          >
            View all categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCategories.length > 0 ? (
              visibleCategories.map((category, index) => {
                const label = category.name?.trim() || "Untitled";
                return (
                  <Link
                    key={category.id}
                    href={`/products?categoryId=${category.id}`}
                    className="group relative overflow-hidden rounded-[2rem] border border-sand-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_24px_70px_-46px_rgba(15,23,42,0.5)]"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${getFallbackGradient(index + 1)}`} />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.92)_82%)]" />
                    <div className="relative flex h-full min-h-[13rem] flex-col justify-between p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-600">
                            Category
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-gray-950">
                            {label}
                          </h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-sm ring-1 ring-brand-100">
                          {category.imageUrl ? (
                            <Image
                              src={category.imageUrl}
                              alt={label}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-2xl object-cover"
                            />
                          ) : (
                            <PackageSearch className="h-5 w-5 text-brand-600" />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <p className="max-w-[14rem] text-sm leading-6 text-ink-900/65">
                          {category.description || "Browse products selected for this category."}
                        </p>
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-brand-600 shadow-sm ring-1 ring-brand-100 transition group-hover:translate-x-0.5">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="sm:col-span-2 lg:col-span-3">
                <div className="rounded-[2rem] border border-dashed border-sand-300 bg-white/80 p-6 text-sm leading-7 text-ink-900/65">
                  Categories are being prepared. You can still browse the full catalog.
                </div>
              </div>
            )}
        </div>
    </section>
  );
}
