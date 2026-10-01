import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OrdersClient } from "@/components/orders-client";
import { AccountNav } from "@/components/account-nav";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";

export const metadata = {
  title: "Orders | WeCure",
  description: "View your order history.",
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <PageBreadcrumbs items={[{ label: "Orders" }]} />

        <div className="mt-6">
          <AccountNav />
        </div>

        <section className="mt-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">Orders</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Your orders, at a glance.</h1>
          <p className="mt-3 text-sm leading-7 text-ink-900/65 sm:text-base">Track payment and fulfilment status, then open any order for the full details.</p>
        </section>
        <div className="mt-8 sm:mt-10">
          <OrdersClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
