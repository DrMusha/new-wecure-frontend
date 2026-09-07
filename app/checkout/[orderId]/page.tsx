import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CheckoutClient } from "@/components/checkout-client";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { SectionHeading } from "@/components/section-heading";

export const metadata = {
  title: "Checkout | WeCure",
  description: "Complete payment for your WeCure order.",
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <div className="min-h-screen bg-mesh-radial text-ink-950">
      <SiteHeader />
      <main id="content" className="mx-auto max-w-5xl px-4 pb-12 pt-8 sm:px-6 sm:py-12 lg:px-8">
        <PageBreadcrumbs items={[{ label: "Bag", href: "/bag" }, { label: "Checkout" }]} />
        <SectionHeading
          eyebrow="Checkout"
          title="Complete your payment."
          description="Use one mobile money number for MTN, Airtel Money, or Zamtel Money. We will track the payment status here."
        />
        <div className="mt-10">
          <CheckoutClient orderId={orderId} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
