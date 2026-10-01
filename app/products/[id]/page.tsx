import Link from "next/link";
import { ArrowLeft, CheckCircle2, Package2, ShieldCheck, Sparkles } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { ProductGallery } from "@/components/product-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCategory, getProduct } from "@/lib/backend";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return {
      title: `${product.name} | WeCure`,
      description: product.description || "Product details from WeCure Pharmacy.",
    };
  } catch {
    return {
      title: "Product | WeCure",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  const category = product.categoryId ? await getCategory(product.categoryId).catch(() => null) : null;
  const images = product.images?.length ? product.images : ["/assets/product-placeholder.png"];
  const price = Number(product.price).toFixed(2);
  const status = product.status ? product.status.replace(/-/g, " ") : "published";
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  const categoryLabel = category?.name || "Pharmacy essentials";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(219,234,254,0.72),transparent_42%),linear-gradient(180deg,#f8fbff_0%,#eff5fb_56%,#ffffff_100%)] text-ink-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_38%),radial-gradient(circle_at_left,rgba(191,219,254,0.32),transparent_30%)]" />
      <SiteHeader />
      <main id="content" className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <PageBreadcrumbs
          items={[
            { label: "Products", href: "/products" },
            ...(category ? [{ label: category.name, href: `/categories/${category.id}` }] : []),
            { label: product.name },
          ]}
        />

        <Link
          href="/products"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-ink-800 shadow-sm backdrop-blur transition hover:border-blue-200 hover:text-blue-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>

        <section className="mt-6 overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/70 backdrop-blur">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-3 sm:p-4">
              <ProductGallery images={images} name={product.name} />
            </div>

            <div className="border-t border-slate-200/70 p-5 sm:p-6 lg:border-l lg:border-t-0 lg:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Product detail
                </span>
                {category ? (
                  <span className="inline-flex items-center rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold text-ink-800">
                    {categoryLabel}
                  </span>
                ) : null}
                {product.isFeatured ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured
                  </span>
                ) : null}
                {product.isPrescription ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Prescription
                  </span>
                ) : null}
              </div>

              <div className="mt-4 border-b border-slate-200/70 pb-5">
                <h1 className="break-words text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-900/70">
                  {product.description || "This product page is built for a premium shopping experience with clear information and a smooth purchase path."}
                </p>
              </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Package2 className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Pack size</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink-950">{product.packSize || "Not specified"}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Availability</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink-950">{statusLabel}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <ShieldCheck className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Source</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink-950">WeCure Pharmacy</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                    Price
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-ink-950">ZMW {price}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {statusLabel}
                </div>
              </div>

              <div className="mt-6 rounded-[1.75rem] border border-slate-200/70 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">About this product</p>
                <p className="mt-3 text-sm leading-7 text-ink-900/70">
                  {product.description || "Clean product information, stronger visual hierarchy, and a focused purchase flow make this page easier to review and trust."}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <AddToCartButton product={product} className="h-12 w-full rounded-full text-base shadow-sm" />
                  <Link
                    href="/bag"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-blue-200 bg-white px-5 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                  >
                    View bag
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
