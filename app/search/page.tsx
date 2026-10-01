import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { ProductSearch } from "@/components/product-search";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto min-h-[60vh] max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <PageBreadcrumbs items={[{ label: "Search" }]} />
        <SectionHeading
          className="mt-7"
          eyebrow="Find what you need"
          title="Search medicines and health essentials."
          description="Type a product name, brand, or category. We’ll suggest matching products as you type."
        />
        <div className="mt-8 rounded-[2rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/70 sm:p-6">
          <ProductSearch />
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="mr-1 self-center text-ink-900/55">Try:</span>
            {['Pain relief', 'Vitamins', 'Baby care', 'Skin care'].map((term) => (
              <a key={term} href={`/products?search=${encodeURIComponent(term)}`} className="rounded-full bg-sand-100 px-3 py-1.5 font-medium text-ink-900 transition hover:bg-brand-50 hover:text-brand-700">
                {term}
              </a>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
