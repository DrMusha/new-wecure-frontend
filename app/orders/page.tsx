import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OrdersClient } from "@/components/orders-client";
import { AccountNav } from "@/components/account-nav";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { SectionHeading } from "@/components/section-heading";

export const metadata = {
  title: "Orders | WeCure",
  description: "View your order history.",
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PageBreadcrumbs items={[{ label: "Orders" }]} />

        <div className="mt-6">
          <AccountNav />
        </div>

        <div className="mt-8">
          <SectionHeading
            eyebrow="Orders"
            title="Track your recent orders."
            description="See your recent orders and track what you have placed."
          />
        </div>
        <div className="mt-10">
          <OrdersClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
