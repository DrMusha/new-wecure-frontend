import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listCategories } from "@/lib/backend";

function getFallbackGradient(index: number) {
  const styles = [
    "from-blue-50 via-white to-blue-100",
    "from-sky-50 via-white to-cyan-100",
    "from-indigo-50 via-white to-blue-100",
    "from-blue-100 via-white to-slate-100",
    "from-cyan-50 via-white to-blue-50",
    "from-slate-50 via-white to-blue-100",
  ];
  return styles[index % styles.length];
}

export async function CategoryGrid() {
  const categories = await listCategories().catch(() => []);
  const visibleCategories = categories.slice(0, 6).filter((category) => category?.id);
  const leadCategory = visibleCategories[0];
  const otherCategories = visibleCategories.slice(1);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2.5rem] border border-blue-100 bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_42%,#ffffff_100%)] p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                Categories
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Shop by category and find what you need faster.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              Explore the live category feed with a layout that makes the primary category feel featured,
              while keeping the rest easy to scan on mobile and desktop.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
          >
            View all categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          {leadCategory ? (
            <Link
              href={`/categories/${leadCategory.id}`}
              className="group relative min-h-[20rem] overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg lg:col-span-6 lg:row-span-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${getFallbackGradient(0)}`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(191,219,254,0.3),transparent_28%)]" />
              <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
                <div className="max-w-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700/90">
                    Featured category
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950">
                    {leadCategory.name?.trim() || "Untitled category"}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-gray-600">
                    {leadCategory.description || "Start with one of our most popular categories and explore from there."}
                  </p>
                </div>

                <div className="mt-8 flex items-end justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
                    Explore now
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                  <div className="relative h-24 w-24 overflow-hidden rounded-3xl border border-white/80 bg-white shadow-sm">
                    {leadCategory.imageUrl ? (
                      <Image
                        src={leadCategory.imageUrl}
                        alt={leadCategory.name || "Category"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white text-3xl font-semibold uppercase text-blue-600">
                        {(leadCategory.name?.trim()?.charAt(0) || "C").toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            {otherCategories.length > 0 ? (
              otherCategories.map((category, index) => {
                const label = category.name?.trim() || "Untitled";
                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    className="group relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${getFallbackGradient(index + 1)}`} />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.92)_82%)]" />
                    <div className="relative flex h-full min-h-[12rem] flex-col justify-between p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-500">
                            Category
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-gray-950">
                            {label}
                          </h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-sm ring-1 ring-blue-100">
                          {category.imageUrl ? (
                            <Image
                              src={category.imageUrl}
                              alt={label}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-2xl object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold uppercase text-blue-600">
                              {label.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <p className="max-w-[14rem] text-sm leading-6 text-gray-600">
                          {category.description || "Explore products grouped into easy-to-browse categories."}
                        </p>
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-blue-600 shadow-sm ring-1 ring-blue-100 transition group-hover:translate-x-0.5">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="sm:col-span-2 lg:col-span-6">
                <div className="rounded-[2rem] border border-dashed border-blue-200 bg-white/80 p-6 text-sm leading-7 text-gray-500">
                  No categories are available right now. Please check back again soon.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
