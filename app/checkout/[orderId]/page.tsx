import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CheckoutClient } from "@/components/checkout-client";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { CheckoutSteps } from "@/components/checkout-steps";

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
        <section className="mt-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">Payment</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Complete your payment.</h1>
          <p className="mt-3 text-sm leading-7 text-ink-900/65 sm:text-base">Use your MTN, Airtel Money, or Zamtel Money number. Keep this page open while we confirm payment.</p>
        </section>
        <div className="mt-6"><CheckoutSteps current="payment" /></div>
        <div className="mt-8">
          <CheckoutClient orderId={orderId} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
