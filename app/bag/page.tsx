import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BagClient } from "@/components/bag-client";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";

export const metadata = {
  title: "Bag | WeCure",
  description: "Review your bag and place your order.",
};

export default function BagPage() {
  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <PageBreadcrumbs items={[{ label: "Bag" }]} />

        <section className="mt-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">Checkout</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Your bag, ready for checkout.</h1>
          <p className="mt-3 text-sm leading-7 text-ink-900/65 sm:text-base">Review your items, confirm delivery details, then pay securely by mobile money.</p>
        </section>
        <div className="mt-8 sm:mt-10">
          <BagClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
