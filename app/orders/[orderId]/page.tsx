import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OrderDetailClient } from "@/components/order-detail-client";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <PageBreadcrumbs items={[{ label: "Orders", href: "/orders" }, { label: "Order details" }]} />
        <section className="mt-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">Order details</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Everything about this order.</h1>
          <p className="mt-3 text-sm leading-7 text-ink-900/65 sm:text-base">Follow its progress, manage payment, and review what is on the way.</p>
        </section>
        <div className="mt-8 sm:mt-10">
          <OrderDetailClient orderId={orderId} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
