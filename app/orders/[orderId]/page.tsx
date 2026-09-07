import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OrderDetailClient } from "@/components/order-detail-client";
import { SectionHeading } from "@/components/section-heading";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Order"
          title="Order details"
          description="Review the status, items, and payment details for this order."
        />
        <div className="mt-10 space-y-8">
          <OrderDetailClient orderId={orderId} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
